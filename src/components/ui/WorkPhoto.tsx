import Image from "next/image";

import type { WorkPhoto as WorkPhotoAsset } from "@/lib/work-photos";

type WorkPhotoProps = {
  aspect?: WorkPhotoAsset["aspect"];
  className?: string;
  photo: WorkPhotoAsset;
  priority?: boolean;
  sizes?: string;
  tone?: "dark" | "light";
};

const aspectStyles: Record<WorkPhotoAsset["aspect"], string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
};

export function WorkPhoto({
  aspect,
  className = "",
  photo,
  priority = false,
  sizes = "(min-width: 1024px) 44vw, 100vw",
  tone = "light",
}: WorkPhotoProps) {
  const displayedAspect = aspect ?? photo.aspect;
  const captionColor = tone === "dark" ? "text-canvas/72" : "text-ink-muted";
  const frameColor = tone === "dark" ? "border-canvas/18" : "border-line-strong";

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden border bg-brand-deep shadow-panel ${frameColor} ${aspectStyles[displayedAspect]}`}
      >
        <Image
          alt={photo.alt}
          className="object-cover"
          fill
          priority={priority}
          sizes={sizes}
          src={photo.src}
        />
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-1.5 w-28 bg-accent"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-1.5 w-20 bg-accent"
        />
      </div>
      <figcaption className={`mt-4 flex gap-3 text-sm leading-6 ${captionColor}`}>
        <span aria-hidden="true" className="mt-2 size-2 shrink-0 bg-accent" />
        {photo.caption}
      </figcaption>
    </figure>
  );
}
