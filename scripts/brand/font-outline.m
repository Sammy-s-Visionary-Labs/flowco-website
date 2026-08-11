#import <AppKit/AppKit.h>
#import <CoreText/CoreText.h>

typedef struct {
    NSMutableString *path;
} PathWriter;

static NSString *number(CGFloat value) {
    NSString *formatted = [NSString stringWithFormat:@"%.3f", value];
    while ([formatted hasSuffix:@"0"]) {
        formatted = [formatted substringToIndex:formatted.length - 1];
    }
    if ([formatted hasSuffix:@"."]) {
        formatted = [formatted substringToIndex:formatted.length - 1];
    }
    return formatted;
}

static void appendPoint(NSMutableString *output, CGPoint point) {
    [output appendFormat:@"%@ %@", number(point.x), number(point.y)];
}

static void pathElement(void *info, const CGPathElement *element) {
    PathWriter *writer = (PathWriter *)info;
    switch (element->type) {
        case kCGPathElementMoveToPoint:
            [writer->path appendString:@"M"];
            appendPoint(writer->path, element->points[0]);
            break;
        case kCGPathElementAddLineToPoint:
            [writer->path appendString:@"L"];
            appendPoint(writer->path, element->points[0]);
            break;
        case kCGPathElementAddQuadCurveToPoint:
            [writer->path appendString:@"Q"];
            appendPoint(writer->path, element->points[0]);
            [writer->path appendString:@" "];
            appendPoint(writer->path, element->points[1]);
            break;
        case kCGPathElementAddCurveToPoint:
            [writer->path appendString:@"C"];
            appendPoint(writer->path, element->points[0]);
            [writer->path appendString:@" "];
            appendPoint(writer->path, element->points[1]);
            [writer->path appendString:@" "];
            appendPoint(writer->path, element->points[2]);
            break;
        case kCGPathElementCloseSubpath:
            [writer->path appendString:@"Z"];
            break;
    }
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc < 3) {
            fprintf(stderr, "Usage: font-outline FONT.cff TEXT [TRACKING]\n");
            return 2;
        }

        NSString *fontPath = [NSString stringWithUTF8String:argv[1]];
        NSString *text = [NSString stringWithUTF8String:argv[2]];
        CGFloat tracking = argc >= 4 ? strtod(argv[3], NULL) : 0.0;

        NSURL *fontURL = [NSURL fileURLWithPath:fontPath];
        CGDataProviderRef provider = CGDataProviderCreateWithURL((__bridge CFURLRef)fontURL);
        CGFontRef graphicsFont = provider ? CGFontCreateWithDataProvider(provider) : NULL;
        if (!graphicsFont) {
            fprintf(stderr, "Could not load CFF font data at %s\n", fontPath.UTF8String);
            if (provider) CGDataProviderRelease(provider);
            return 3;
        }

        CTFontRef font = CTFontCreateWithGraphicsFont(graphicsFont, 100.0, NULL, NULL);
        CGMutablePathRef combined = CGPathCreateMutable();
        CGFloat cursor = 0.0;
        for (NSUInteger characterIndex = 0; characterIndex < text.length; characterIndex++) {
            unichar character = [text characterAtIndex:characterIndex];
            NSString *glyphName = nil;
            if (character >= 'A' && character <= 'Z') {
                glyphName = [NSString stringWithFormat:@"%C", character];
            } else if (character == ' ') {
                glyphName = @"space";
            } else if (character == ',') {
                CGMutablePathRef comma = CGPathCreateMutable();
                CGPathMoveToPoint(comma, NULL, 4.0, 8.0);
                CGPathAddCurveToPoint(comma, NULL, 4.0, 14.0, 8.5, 18.0, 14.5, 18.0);
                CGPathAddCurveToPoint(comma, NULL, 21.0, 18.0, 25.0, 13.0, 25.0, 7.0);
                CGPathAddCurveToPoint(comma, NULL, 25.0, -1.0, 20.0, -10.0, 9.0, -17.0);
                CGPathAddLineToPoint(comma, NULL, 3.0, -10.0);
                CGPathAddCurveToPoint(comma, NULL, 9.0, -5.0, 12.0, -1.0, 12.5, 1.0);
                CGPathAddCurveToPoint(comma, NULL, 7.0, 1.0, 4.0, 3.5, 4.0, 8.0);
                CGPathCloseSubpath(comma);
                CGAffineTransform commaPlacement = CGAffineTransformMakeTranslation(cursor, 0.0);
                CGPathAddPath(combined, &commaPlacement, comma);
                CGPathRelease(comma);
                cursor += 29.0;
                if (characterIndex + 1 < text.length) cursor += tracking;
                continue;
            } else if (character == '&') {
                glyphName = @"ampersand";
            } else {
                fprintf(stderr, "Unsupported descriptor character: %u\n", character);
                CGPathRelease(combined);
                CFRelease(font);
                CGFontRelease(graphicsFont);
                CGDataProviderRelease(provider);
                return 4;
            }

            CGGlyph glyph = CGFontGetGlyphWithGlyphName(
                graphicsFont,
                (__bridge CFStringRef)glyphName
            );
            if (glyph == 0 && character != ' ') {
                fprintf(stderr, "Embedded font is missing glyph %s\n", glyphName.UTF8String);
                CGPathRelease(combined);
                CFRelease(font);
                CGFontRelease(graphicsFont);
                CGDataProviderRelease(provider);
                return 5;
            }

            CGSize advance = CGSizeZero;
            CTFontGetAdvancesForGlyphs(font, kCTFontOrientationHorizontal, &glyph, &advance, 1);
            CGPathRef glyphPath = CTFontCreatePathForGlyph(font, glyph, NULL);
            if (glyphPath) {
                CGAffineTransform placement = CGAffineTransformMakeTranslation(cursor, 0.0);
                CGPathAddPath(combined, &placement, glyphPath);
                CGPathRelease(glyphPath);
            }
            cursor += advance.width;
            if (characterIndex + 1 < text.length) cursor += tracking;
        }

        CGRect bounds = CGPathGetBoundingBox(combined);
        PathWriter writer = { .path = [NSMutableString string] };
        CGPathApply(combined, &writer, pathElement);

        NSDictionary *result = @{
            @"path": writer.path,
            @"bbox": @[
                @(bounds.origin.x),
                @(bounds.origin.y),
                @(bounds.size.width),
                @(bounds.size.height),
            ],
            @"advance": @(cursor),
            @"ascent": @(CTFontGetAscent(font)),
            @"descent": @(CTFontGetDescent(font)),
        };
        NSData *json = [NSJSONSerialization dataWithJSONObject:result options:0 error:NULL];
        fwrite(json.bytes, 1, json.length, stdout);
        fputc('\n', stdout);

        CGPathRelease(combined);
        CFRelease(font);
        CGFontRelease(graphicsFont);
        CGDataProviderRelease(provider);
    }
    return 0;
}
