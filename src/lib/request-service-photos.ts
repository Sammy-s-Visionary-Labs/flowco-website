import sharp from "sharp";

import {
  getRequestServicePhotoMetadataError,
  hasSubmittedRequestServicePhotos,
  normalizeRequestServicePhotoContentType,
  requestServicePhotoLimits,
  type RequestServiceAttachment,
  type RequestServicePhotoContentType,
} from "./request-service";

sharp.cache(false);

export type RequestServicePhotoValidationResult =
  | {
      hadPhotos: boolean;
      attachments: RequestServiceAttachment[];
      success: true;
    }
  | {
      error: string;
      hadPhotos: boolean;
      success: false;
    };

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const pngEndChunk = [
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
];

function bytesMatch(
  content: Uint8Array,
  expected: readonly number[],
  offset = 0,
) {
  return expected.every((byte, index) => content[offset + index] === byte);
}

function asciiMatches(content: Uint8Array, value: string, offset: number) {
  return [...value].every(
    (character, index) => content[offset + index] === character.charCodeAt(0),
  );
}

function isJpeg(content: Uint8Array) {
  return (
    content.length >= 32 &&
    bytesMatch(content, [0xff, 0xd8, 0xff]) &&
    bytesMatch(content, [0xff, 0xd9], content.length - 2)
  );
}

function isPng(content: Uint8Array) {
  return (
    content.length >= 45 &&
    bytesMatch(content, pngSignature) &&
    bytesMatch(content, [0x00, 0x00, 0x00, 0x0d], 8) &&
    asciiMatches(content, "IHDR", 12) &&
    bytesMatch(content, pngEndChunk, content.length - pngEndChunk.length)
  );
}

function isWebp(content: Uint8Array) {
  if (
    content.length < 20 ||
    !asciiMatches(content, "RIFF", 0) ||
    !asciiMatches(content, "WEBP", 8)
  ) {
    return false;
  }

  const declaredSize =
    content[4] |
    (content[5] << 8) |
    (content[6] << 16) |
    (content[7] << 24);
  const chunkType = String.fromCharCode(...content.slice(12, 16));

  return (
    declaredSize >>> 0 === content.length - 8 &&
    ["VP8 ", "VP8L", "VP8X"].includes(chunkType)
  );
}

function detectContentType(
  content: Uint8Array,
): RequestServicePhotoContentType | null {
  if (isJpeg(content)) {
    return "image/jpeg";
  }

  if (isPng(content)) {
    return "image/png";
  }

  if (isWebp(content)) {
    return "image/webp";
  }

  return null;
}

async function normalizePhoto(
  content: Uint8Array,
  index: number,
): Promise<RequestServiceAttachment> {
  const { data, info } = await sharp(content, {
    failOn: "error",
    limitInputChannels: 4,
    limitInputPixels: requestServicePhotoLimits.maxInputPixels,
    pages: 1,
    sequentialRead: true,
  })
    .rotate()
    .resize({
      fit: "inside",
      height: requestServicePhotoLimits.maxOutputDimension,
      width: requestServicePhotoLimits.maxOutputDimension,
      withoutEnlargement: true,
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ progressive: true, quality: 80 })
    .toUint8Array();

  if (
    info.format !== "jpeg" ||
    info.width < 1 ||
    info.height < 1 ||
    info.width > requestServicePhotoLimits.maxOutputDimension ||
    info.height > requestServicePhotoLimits.maxOutputDimension
  ) {
    throw new Error("Unexpected normalized image output.");
  }

  const outputMetadata = await sharp(data).metadata();

  if (
    outputMetadata.exif ||
    outputMetadata.icc ||
    outputMetadata.iptc ||
    outputMetadata.xmp
  ) {
    throw new Error("Normalized image retained metadata.");
  }

  return {
    content: data,
    contentType: "image/jpeg",
    filename: `project-photo-${index + 1}.jpg`,
  };
}

export async function validateRequestServicePhotos(
  formData: FormData,
): Promise<RequestServicePhotoValidationResult> {
  const submittedEntries = formData.getAll("photos");

  if (!hasSubmittedRequestServicePhotos(formData)) {
    return { attachments: [], hadPhotos: false, success: true };
  }

  if (submittedEntries.length > requestServicePhotoLimits.maxFiles) {
    return {
      error: `Choose no more than ${requestServicePhotoLimits.maxFiles} photos.`,
      hadPhotos: true,
      success: false,
    };
  }

  if (submittedEntries.some((entry) => typeof entry === "string")) {
    return {
      error: "Choose JPG, PNG, or WebP photos only.",
      hadPhotos: true,
      success: false,
    };
  }

  const files = submittedEntries as File[];
  const metadataError = getRequestServicePhotoMetadataError(files);

  if (metadataError) {
    return {
      error: metadataError,
      hadPhotos: true,
      success: false,
    };
  }

  const attachments: RequestServiceAttachment[] = [];

  for (const [index, file] of files.entries()) {
    const claimedContentType = normalizeRequestServicePhotoContentType(file.type);

    if (claimedContentType === null) {
      return {
        error: "Choose JPG, PNG, or WebP photos only.",
        hadPhotos: true,
        success: false,
      };
    }

    let content: Uint8Array;

    try {
      content = new Uint8Array(await file.arrayBuffer());
    } catch {
      return {
        error:
          "One photo could not be read. Choose it again or use another photo.",
        hadPhotos: true,
        success: false,
      };
    }

    const detectedContentType = detectContentType(content);

    if (
      content.length !== file.size ||
      detectedContentType === null ||
      claimedContentType !== detectedContentType
    ) {
      return {
        error: "Choose JPG, PNG, or WebP photos only.",
        hadPhotos: true,
        success: false,
      };
    }

    try {
      attachments.push(await normalizePhoto(content, index));
    } catch {
      return {
        error:
          "One photo could not be safely prepared. Choose it again or use another photo.",
        hadPhotos: true,
        success: false,
      };
    }
  }

  const normalizedTotalBytes = attachments.reduce(
    (total, attachment) => total + attachment.content.byteLength,
    0,
  );

  if (normalizedTotalBytes > requestServicePhotoLimits.maxTotalBytes) {
    return {
      error:
        "The photos could not be prepared within the 3 MB limit. Choose fewer photos.",
      hadPhotos: true,
      success: false,
    };
  }

  return { attachments, hadPhotos: true, success: true };
}
