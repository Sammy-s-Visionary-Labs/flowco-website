import type { SitePath } from "@/lib/seo";
import { publishedServicePages } from "./service-pages";
import { site } from "./site";

export type LocationFaq = {
  answer: string;
  question: string;
};

export type LocationRelatedLink = {
  href: SitePath;
  label: string;
};

export type LocationPageDefinition = {
  city: string;
  ctaBody: string;
  ctaEyebrow: string;
  ctaTitle: string;
  description: string;
  eyebrow: string;
  faqDescription: string;
  faqTitle: string;
  faqs: readonly LocationFaq[];
  intro: string;
  localContext: readonly string[];
  localContextDescription: string;
  localContextTitle: string;
  nearbyCommunities: readonly string[];
  nearbyDescription: string;
  path: SitePath;
  process: readonly {
    body: string;
    step: string;
    title: string;
  }[];
  processDescription: string;
  processTitle: string;
  relatedLinks: readonly LocationRelatedLink[];
  relatedNote: string;
  servicesDescription: string;
  servicesTitle: string;
  slug: string;
  title: string;
};

const coreServiceLinks = publishedServicePages
  .filter((page) => page.path.startsWith("/services/"))
  .map((page) => ({
    href: page.path,
    label: page.label,
  }));

export const toledoServiceAreaPage = {
  path: "/service-areas/toledo",
  slug: "toledo",
  city: "Toledo",
  title: "Sewer, Water, Drainage & Excavation in Toledo, Ohio",
  eyebrow: "Toledo service area",
  description: `${site.name} provides underground sewer, water line, drainage, stormwater, excavation, and utility trenching services in Toledo, Ohio. Call ${site.phone} or request service for Toledo-area underground utility work.`,
  intro: `${site.name} serves Toledo as the lead community in our ${site.serviceArea} coverage. From older city neighborhoods to commercial corridors and partner sites, we focus on underground sewer, water, drainage, excavation, and utility trenching—not general indoor plumbing.`,
  servicesTitle: "Underground services available in Toledo",
  servicesDescription: `Toledo property owners, businesses, contractors, and municipal partners can request these focused underground services from ${site.name}.`,
  localContextTitle: "Why Toledo properties call for underground utility help",
  localContextDescription:
    "Toledo is the center of our service area. Local requests often involve buried lines, wet-site drainage, and utility work tied to older properties, commercial sites, and surrounding Northwest Ohio projects.",
  localContext: [
    "Older Toledo neighborhoods and commercial blocks often depend on aging underground sewer and water service lines that need repair or replacement.",
    "Wet weather across Lucas County can leave standing water, runoff, and drainage problems that call for practical stormwater and drainage work.",
    "Site upgrades, additions, and utility renewals in Toledo regularly need excavation and trenching focused on buried infrastructure—not general landscaping.",
    "Contractors and municipal partners working in Toledo can bring in a specialist crew for sewer, water, drainage, excavation, and utility trenching scopes.",
  ],
  nearbyCommunities: site.primaryCities.filter((city) => city !== "Toledo"),
  nearbyDescription: `From Toledo, ${site.name} also serves nearby ${site.serviceArea} communities. Contact us with the property city or ZIP to confirm coverage and the right next step.`,
  processTitle: "How a Toledo service request works",
  processDescription:
    "A clear path from a Toledo property or project need to a practical underground utility plan.",
  process: [
    {
      step: "01",
      title: "Tell us the Toledo location",
      body: "Call or request service with the Toledo address area or ZIP, what you are seeing, and whether the work is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the underground fit",
      body: "We review whether the job matches our sewer, water, drainage, excavation, or utility trenching scope for the Toledo site.",
    },
    {
      step: "03",
      title: "Plan the next field step",
      body: "You get a clear next step for the Toledo job—or an honest recommendation when the work falls outside our underground utility focus.",
    },
  ],
  faqTitle: "Toledo underground utility questions",
  faqDescription: `Direct answers for sewer, water, drainage, and excavation searches in Toledo and nearby ${site.serviceArea} communities.`,
  faqs: [
    {
      question: `Does ${site.name} serve Toledo, Ohio?`,
      answer: `Yes. Toledo is the lead community in our ${site.serviceArea} service area. ${site.name} provides underground sewer, water line, drainage, stormwater, excavation, and utility trenching work for Toledo properties and partner projects.`,
    },
    {
      question: "What underground services can Toledo customers request?",
      answer:
        "Toledo customers can request sewer line repair or replacement, water service line repair, replacement, and installation, stormwater and drainage work, site excavation, utility trenching, and commercial or contractor/municipal support when the scope fits.",
    },
    {
      question: "Do you only work inside Toledo city limits?",
      answer: `No. Toledo is our lead market, and we also serve surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question: "How do I request underground utility service in Toledo?",
      answer: `Call ${site.phone} or use Request Service. Include the Toledo city or ZIP details, a short description of the underground problem or project, and how we should reach you.`,
    },
    {
      question: "Is Ohio Flow Co a general plumbing company in Toledo?",
      answer: `No. ${site.name} is an underground sewer, water, drainage, and excavation specialist serving Toledo and ${site.serviceArea}. We do not position the company as a general indoor plumbing shop.`,
    },
  ],
  relatedNote: `Explore the core underground services Toledo customers request most often, or continue to the commercial pathway if you are a business, contractor, or municipal partner.`,
  relatedLinks: [
    ...coreServiceLinks,
    {
      href: "/commercial",
      label: "Commercial services",
    },
  ],
  ctaEyebrow: "Request Toledo service",
  ctaTitle: `Need underground utility help in Toledo?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us the Toledo location and what is going wrong with the sewer, water, drainage, or underground utility work.`,
} as const satisfies LocationPageDefinition;

export const publishedLocationPages = [toledoServiceAreaPage] as const;

export function locationPageBySlug(slug: string) {
  return publishedLocationPages.find((page) => page.slug === slug);
}
