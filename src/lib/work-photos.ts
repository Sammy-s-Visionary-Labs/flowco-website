export type WorkPhoto = {
  alt: string;
  aspect: "landscape" | "portrait";
  caption: string;
  src: string;
};

export const workPhotos = {
  commercialPrecastWork: {
    src: "/work/commercial-precast-work.webp",
    alt: "Crane crew handling precast concrete structures at a commercial work site",
    caption: "Precast structure handling for a larger underground site scope.",
    aspect: "portrait",
  },
  equipmentMobilization: {
    src: "/work/equipment-mobilization.webp",
    alt: "Yellow Komatsu excavator secured on a transport trailer",
    caption: "Equipment staged for the next underground field assignment.",
    aspect: "landscape",
  },
  residentialExcavation: {
    src: "/work/residential-excavation.webp",
    alt: "Two compact excavators staged on a gravel residential work site",
    caption: "Compact excavation equipment positioned for residential site work.",
    aspect: "landscape",
  },
  sewerLineRepair: {
    src: "/work/sewer-line-repair.webp",
    alt: "Excavator working beside a residential trench during underground sewer line repair",
    caption: "Accessing a buried line in a tight residential work area.",
    aspect: "portrait",
  },
  sewerLineReplacement: {
    src: "/work/sewer-line-replacement.webp",
    alt: "Green sewer pipe being installed in an open residential trench",
    caption: "New sewer pipe placed and prepared for a dependable connection.",
    aspect: "portrait",
  },
  stormwaterInstallation: {
    src: "/work/stormwater-installation.webp",
    alt: "Crane and crew positioning a precast concrete drainage structure",
    caption: "Precast drainage infrastructure being positioned on site.",
    aspect: "portrait",
  },
} as const satisfies Record<string, WorkPhoto>;
