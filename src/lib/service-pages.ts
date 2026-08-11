import type { SitePath } from "@/lib/seo";
import { confirmedServices, site } from "./site";
import { workPhotos, type WorkPhoto } from "./work-photos";

export type ConfirmedServiceId = (typeof confirmedServices)[number]["id"];

export type ServiceFaq = {
  answer: string;
  question: string;
};

export type ServiceRelatedLink = {
  href: SitePath;
  label: string;
};

export type ServicePageDefinition = {
  ctaBody: string;
  ctaEyebrow: string;
  ctaTitle: string;
  description: string;
  eyebrow: string;
  faqDescription: string;
  faqTitle: string;
  faqs: readonly ServiceFaq[];
  intro: string;
  label: string;
  path: SitePath;
  photo?: WorkPhoto;
  process: readonly {
    body: string;
    step: string;
    title: string;
  }[];
  processDescription: string;
  processTitle: string;
  relatedLinks: readonly ServiceRelatedLink[];
  relatedNote: string;
  scope: readonly string[];
  scopeDescription: string;
  serviceIds: readonly ConfirmedServiceId[];
  signs: readonly string[];
  signsDescription: string;
  signsTitle: string;
  title: string;
};

export const sewerLineRepairPage = {
  path: "/services/sewer-line-repair",
  serviceIds: ["sewer_line_repair"],
  label: "Sewer line repair",
  photo: workPhotos.sewerLineRepair,
  title: "Sewer Line Repair in Northwest Ohio",
  eyebrow: `${site.serviceArea} sewer services`,
  description: `${site.name} provides sewer line repair for homes, businesses, and properties across ${site.serviceArea}. Call ${site.phone} or request service for Toledo-area underground sewer problems.`,
  intro: `${site.name} repairs damaged or failing sewer lines for residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. If wastewater is backing up, escaping, or pointing to a buried line problem, we focus on practical underground repair—not general indoor plumbing.`,
  scopeDescription: `${site.name} focuses on underground sewer line repair for homes, businesses, and project partners—not general indoor plumbing.`,
  scope: [
    "Repair of damaged or failing underground sewer lines",
    "Residential sewer line repair on private property",
    "Commercial sewer line repair for businesses and property teams",
    "Support for contractors and municipalities when sewer repair is part of a larger underground job",
    "Clear next-step guidance when repair is the right path versus replacement",
  ],
  signsTitle: "Signs you may need sewer line repair",
  signsDescription:
    "These are common reasons property owners and project partners reach out for sewer line repair.",
  signs: [
    "Repeated sewer backups that keep returning after temporary fixes",
    "Slow drains across multiple fixtures that suggest a main-line issue",
    "Wet spots, odors, or settling ground over a sewer route",
    "Sudden wastewater problems after ground movement, heavy use, or aging lines",
    "A known damaged section that needs repair before the whole line is replaced",
  ],
  processTitle: "Our sewer repair process",
  processDescription:
    "A direct path from the problem you are seeing to a clear field plan.",
  process: [
    {
      step: "01",
      title: "Describe the sewer problem",
      body: "Call or request service with the property location, what you are seeing, and whether the work is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the repair fit",
      body: "We review whether the issue fits our underground sewer repair scope and whether repair is the practical path for the property.",
    },
    {
      step: "03",
      title: "Plan the field work",
      body: "You get a clear next step for sewer line repair—or an honest recommendation when replacement or a different service is the better fit.",
    },
  ],
  faqTitle: "Sewer line repair questions",
  faqDescription: `Direct answers for common sewer repair searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What sewer line repair work does ${site.name} handle?`,
      answer: `${site.name} handles underground sewer line repair for homes, businesses, contractors, and municipalities across ${site.serviceArea}. We focus on buried sewer problems—not general fixture plumbing inside the building.`,
    },
    {
      question: "When is sewer repair the right choice instead of replacement?",
      answer:
        "Repair is often the right path when a defined section of line is damaged and the rest of the system can continue to serve the property. If the line is extensively failed or at the end of its useful life, replacement may be the more durable option. We help sort that out from the problem you describe and what the field work shows.",
    },
    {
      question: `Do you provide sewer line repair in Toledo and nearby communities?`,
      answer: `Yes. ${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question: "Can residential and commercial properties request sewer repair?",
      answer: `Yes. Residential customers, commercial property teams, contractors, and municipalities can all request sewer line repair through a call or the Request Service form.`,
    },
    {
      question: "How do I start a sewer line repair request?",
      answer: `Call ${site.phone} or use Request Service. Include the city or ZIP, a short description of the sewer problem, and how we should reach you.`,
    },
  ],
  relatedNote: `${site.name} also handles sewer line replacement, water service line work, stormwater and drainage, and other underground utility services when those scopes fit the job.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-replacement",
      label: "Sewer line replacement",
    },
    {
      href: "/services/water-service-line",
      label: "Water service line",
    },
    {
      href: "/services/stormwater-and-drainage",
      label: "Stormwater and drainage",
    },
  ],
  ctaEyebrow: "Request sewer repair",
  ctaTitle: `Need sewer line repair in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us where the property is and what is going wrong with the sewer line.`,
} as const satisfies ServicePageDefinition;

export const sewerLineReplacementPage = {
  path: "/services/sewer-line-replacement",
  serviceIds: ["sewer_line_replacement"],
  label: "Sewer line replacement",
  photo: workPhotos.sewerLineReplacement,
  title: "Sewer Line Replacement in Northwest Ohio",
  eyebrow: `${site.serviceArea} sewer services`,
  description: `${site.name} provides sewer line replacement for homes, businesses, and properties across ${site.serviceArea}. Call ${site.phone} or request service when a failing sewer line needs more than repair.`,
  intro: `${site.name} replaces failing or end-of-life sewer lines for residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. When repair will not restore reliable service, we plan underground replacement work around the property and the line that needs to be renewed.`,
  scopeDescription: `${site.name} handles underground sewer line replacement for homes, businesses, and project partners when a new line is the practical long-term solution.`,
  scope: [
    "Replacement of failed or end-of-life underground sewer lines",
    "Residential sewer line replacement on private property",
    "Commercial sewer line replacement for businesses and property teams",
    "Support for contractors and municipalities when sewer replacement is part of a larger underground job",
    "Clear guidance when replacement is the better path than continued repair",
  ],
  signsTitle: "Signs you may need sewer line replacement",
  signsDescription:
    "These are common reasons property owners and project partners look at full sewer line replacement.",
  signs: [
    "Repeated repairs on the same aging or failing sewer line",
    "Widespread deterioration that makes another patch unlikely to last",
    "A line at the end of its useful life that can no longer serve the property reliably",
    "Major collapses, offsets, or damage that call for renewing the line",
    "A planned site or property upgrade that needs a new sewer line installed correctly",
  ],
  processTitle: "Our sewer replacement process",
  processDescription:
    "A straightforward path from the failing line to a clear replacement plan.",
  process: [
    {
      step: "01",
      title: "Describe the sewer condition",
      body: "Call or request service with the property location, what has already failed or been repaired, and whether the work is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm replacement is the right path",
      body: "We review whether the issue fits our underground sewer replacement scope and whether renewing the line is the practical long-term option.",
    },
    {
      step: "03",
      title: "Plan the replacement work",
      body: "You get a clear next step for sewer line replacement—or an honest recommendation when repair or another service is the better fit.",
    },
  ],
  faqTitle: "Sewer line replacement questions",
  faqDescription: `Direct answers for common sewer replacement searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What sewer line replacement work does ${site.name} handle?`,
      answer: `${site.name} handles underground sewer line replacement for homes, businesses, contractors, and municipalities across ${site.serviceArea}. We focus on renewing buried sewer lines—not general fixture plumbing inside the building.`,
    },
    {
      question: "When is replacement better than another repair?",
      answer:
        "Replacement is often the better path when the line is extensively failed, repeatedly patched, or at the end of its useful life. If a defined section can still be repaired and the rest of the system is sound, repair may be enough. We help sort that out from the problem you describe and what the field work shows.",
    },
    {
      question: `Do you provide sewer line replacement in Toledo and nearby communities?`,
      answer: `Yes. ${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question:
        "Can residential and commercial properties request sewer replacement?",
      answer: `Yes. Residential customers, commercial property teams, contractors, and municipalities can all request sewer line replacement through a call or the Request Service form.`,
    },
    {
      question: "How do I start a sewer line replacement request?",
      answer: `Call ${site.phone} or use Request Service. Include the city or ZIP, a short description of the sewer problem or prior repairs, and how we should reach you.`,
    },
  ],
  relatedNote: `${site.name} also handles sewer line repair, water service line work, stormwater and drainage, and other underground utility services when those scopes fit the job.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-repair",
      label: "Sewer line repair",
    },
    {
      href: "/services/water-service-line",
      label: "Water service line",
    },
    {
      href: "/services/stormwater-and-drainage",
      label: "Stormwater and drainage",
    },
  ],
  ctaEyebrow: "Request sewer replacement",
  ctaTitle: `Need sewer line replacement in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us where the property is and why the sewer line may need to be replaced.`,
} as const satisfies ServicePageDefinition;

export const waterServiceLinePage = {
  path: "/services/water-service-line",
  serviceIds: [
    "water_service_line_repair",
    "water_service_line_replacement_installation",
  ],
  label: "Water service line",
  title: "Water Service Line Repair & Replacement in Northwest Ohio",
  eyebrow: `${site.serviceArea} water service work`,
  description: `${site.name} provides water service line repair, replacement, and installation for homes, businesses, and properties across ${site.serviceArea}. Call ${site.phone} or request service for Toledo-area underground water line problems.`,
  intro: `${site.name} repairs, replaces, and installs underground water service lines for residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. When the problem is in the buried service line—not only the fixtures inside the building—we focus on practical underground water line work.`,
  scopeDescription: `${site.name} handles underground water service line repair, replacement, and installation for homes, businesses, and project partners.`,
  scope: [
    "Repair of damaged or failing underground water service lines",
    "Replacement of failed or end-of-life water service lines",
    "New water service line installation when a property needs a properly placed line",
    "Residential water service line work on private property",
    "Commercial water service line work for businesses and property teams",
    "Support for contractors and municipalities when water service work is part of a larger underground job",
  ],
  signsTitle: "Signs you may need water service line work",
  signsDescription:
    "These are common reasons property owners and project partners reach out about the buried water service line.",
  signs: [
    "Low pressure or water loss that points past the fixtures to the service line",
    "Wet spots, pooling, or unexplained water near the service route",
    "A known leak, break, or damaged section in the underground water line",
    "An aging service line that keeps failing or no longer serves the property reliably",
    "A new build, addition, or site upgrade that needs water service line installation or replacement",
  ],
  processTitle: "Our water service line process",
  processDescription:
    "A clear path from the water-line problem to repair, replacement, or installation.",
  process: [
    {
      step: "01",
      title: "Describe the water-line problem",
      body: "Call or request service with the property location, what you are seeing, and whether the work is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the right water-line path",
      body: "We review whether the issue fits our underground water service scope and whether repair, replacement, or installation is the practical option.",
    },
    {
      step: "03",
      title: "Plan the field work",
      body: "You get a clear next step for water service line work—or an honest recommendation when another underground service is the better fit.",
    },
  ],
  faqTitle: "Water service line questions",
  faqDescription: `Direct answers for common water service line searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What water service line work does ${site.name} handle?`,
      answer: `${site.name} handles underground water service line repair, replacement, and installation for homes, businesses, contractors, and municipalities across ${site.serviceArea}. We focus on the buried service line—not general fixture plumbing inside the building.`,
    },
    {
      question: "When is repair enough, and when is replacement or installation needed?",
      answer:
        "Repair can be enough when a defined section of the water service line is damaged and the rest of the line can continue to serve the property. Replacement is often the better path when the line is extensively failed or at the end of its useful life. Installation applies when a property needs a new water service line placed correctly for a build or site upgrade.",
    },
    {
      question: `Do you provide water service line work in Toledo and nearby communities?`,
      answer: `Yes. ${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question:
        "Can residential and commercial properties request water service line work?",
      answer: `Yes. Residential customers, commercial property teams, contractors, and municipalities can all request water service line repair, replacement, or installation through a call or the Request Service form.`,
    },
    {
      question: "How do I start a water service line request?",
      answer: `Call ${site.phone} or use Request Service. Include the city or ZIP, a short description of the water-line problem or project need, and how we should reach you.`,
    },
  ],
  relatedNote: `${site.name} also handles sewer line repair, sewer line replacement, stormwater and drainage work, and other underground utility services when those scopes fit the job.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-repair",
      label: "Sewer line repair",
    },
    {
      href: "/services/sewer-line-replacement",
      label: "Sewer line replacement",
    },
    {
      href: "/services/stormwater-and-drainage",
      label: "Stormwater and drainage",
    },
  ],
  ctaEyebrow: "Request water service line work",
  ctaTitle: `Need water service line help in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us where the property is and what is going wrong with the water service line.`,
} as const satisfies ServicePageDefinition;

export const stormwaterAndDrainagePage = {
  path: "/services/stormwater-and-drainage",
  serviceIds: ["stormwater_management", "drainage_solutions"],
  label: "Stormwater and drainage",
  photo: workPhotos.stormwaterInstallation,
  title: "Stormwater Management & Drainage in Northwest Ohio",
  eyebrow: `${site.serviceArea} drainage services`,
  description: `${site.name} provides stormwater management and drainage solutions for homes, businesses, and properties across ${site.serviceArea}. Call ${site.phone} or request service for standing water, poor drainage, and stormwater problems in the Toledo area.`,
  intro: `${site.name} handles stormwater management and drainage solutions for residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. When water is pooling, rushing where it should not, or failing to leave the site cleanly, we focus on practical underground and site drainage work—not general indoor plumbing.`,
  scopeDescription: `${site.name} focuses on stormwater management and drainage solutions that move water away from buildings, yards, and work sites across ${site.serviceArea}.`,
  scope: [
    "Stormwater management for properties dealing with runoff and heavy-water events",
    "Drainage solutions for standing water, poor grading-related drainage, and wet site conditions",
    "Residential drainage and stormwater work on private property",
    "Commercial drainage and stormwater work for businesses and property teams",
    "Support for contractors and municipalities when stormwater or drainage is part of a larger underground or site job",
  ],
  signsTitle: "Signs you may need stormwater or drainage help",
  signsDescription:
    "These are common reasons property owners and project partners reach out about stormwater and drainage problems.",
  signs: [
    "Standing water that lingers after rain or snowmelt",
    "Runoff that pushes toward a foundation, driveway, or work area",
    "Wet yards, washed-out areas, or eroded paths where water keeps traveling",
    "Drainage that no longer keeps a site usable during wet weather",
    "A commercial or municipal project that needs stormwater or drainage work tied into underground utility planning",
  ],
  processTitle: "Our stormwater and drainage process",
  processDescription:
    "A direct path from the water problem on site to a clear drainage or stormwater plan.",
  process: [
    {
      step: "01",
      title: "Describe the water problem",
      body: "Call or request service with the property location, where water is collecting or moving, and whether the work is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the drainage fit",
      body: "We review whether the issue fits our stormwater and drainage scope and what kind of underground or site response makes sense.",
    },
    {
      step: "03",
      title: "Plan the field work",
      body: "You get a clear next step for stormwater or drainage work—or an honest recommendation when sewer, water-line, excavation, or another service is the better fit.",
    },
  ],
  faqTitle: "Stormwater and drainage questions",
  faqDescription: `Direct answers for common stormwater and drainage searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What stormwater and drainage work does ${site.name} handle?`,
      answer: `${site.name} handles stormwater management and drainage solutions for homes, businesses, contractors, and municipalities across ${site.serviceArea}. We focus on moving and managing water on the property and site—not general fixture plumbing indoors.`,
    },
    {
      question: "What is the difference between stormwater management and drainage solutions?",
      answer:
        "Drainage solutions usually address how water leaves a yard, drive, or local low spot. Stormwater management looks at heavier runoff and how water is handled across a property or site during wet weather. Many jobs involve both, which is why they share one service page here.",
    },
    {
      question: `Do you provide stormwater and drainage work in Toledo and nearby communities?`,
      answer: `Yes. ${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question:
        "Can residential and commercial properties request stormwater or drainage help?",
      answer: `Yes. Residential customers, commercial property teams, contractors, and municipalities can all request stormwater and drainage work through a call or the Request Service form.`,
    },
    {
      question: "How do I start a stormwater or drainage request?",
      answer: `Call ${site.phone} or use Request Service. Include the city or ZIP, a short description of where water is collecting or moving, and how we should reach you.`,
    },
  ],
  relatedNote: `${site.name} also handles sewer line work, water service lines, excavation, and utility trenching when those scopes fit the job.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-repair",
      label: "Sewer line repair",
    },
    {
      href: "/services/water-service-line",
      label: "Water service line",
    },
    {
      href: "/services/excavation-and-trenching",
      label: "Site excavation and utility trenching",
    },
  ],
  ctaEyebrow: "Request stormwater or drainage help",
  ctaTitle: `Need stormwater or drainage help in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us where the property is and how water is collecting or moving on the site.`,
} as const satisfies ServicePageDefinition;

export const excavationAndTrenchingPage = {
  path: "/services/excavation-and-trenching",
  serviceIds: ["site_excavation", "utility_trenching"],
  label: "Site excavation and utility trenching",
  photo: workPhotos.residentialExcavation,
  title: "Site Excavation & Utility Trenching in Northwest Ohio",
  eyebrow: `${site.serviceArea} underground utility work`,
  description: `${site.name} provides site excavation and utility trenching for homes, businesses, contractors, and municipalities across ${site.serviceArea}. Call ${site.phone} or request service for Toledo-area underground utility and excavation work.`,
  intro: `${site.name} handles site excavation and utility trenching for residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. Our focus is underground utility work—opening the ground carefully for sewer, water, drainage, and related buried infrastructure—not general landscaping or indoor plumbing.`,
  scopeDescription: `${site.name} provides site excavation and utility trenching tied to underground sewer, water, drainage, and related utility projects across ${site.serviceArea}.`,
  scope: [
    "Site excavation for underground utility and related field work",
    "Utility trenching for sewer, water, drainage, and related buried lines",
    "Residential excavation and trenching on private property",
    "Commercial excavation and trenching for businesses and property teams",
    "Support for contractors and municipalities when excavation or trenching is part of a larger underground job",
  ],
  signsTitle: "Signs you may need excavation or utility trenching",
  signsDescription:
    "These are common reasons property owners and project partners reach out for excavation or utility trenching support.",
  signs: [
    "A sewer, water, or drainage job that requires opening the ground to reach the line",
    "New or replacement underground utilities that need a properly planned trench",
    "A site upgrade, addition, or rebuild that depends on utility excavation",
    "Contractor or municipal work that needs an underground utility excavation partner",
    "Ground conditions or buried infrastructure that call for careful, utility-focused digging—not a general dirt job",
  ],
  processTitle: "Our excavation and trenching process",
  processDescription:
    "A clear path from the underground need to a practical excavation or trenching plan.",
  process: [
    {
      step: "01",
      title: "Describe the underground need",
      body: "Call or request service with the property location, what utility or site work is involved, and whether the job is residential, commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the excavation fit",
      body: "We review whether the work fits our site excavation and utility trenching scope and how it ties into sewer, water, drainage, or related underground work.",
    },
    {
      step: "03",
      title: "Plan the field work",
      body: "You get a clear next step for excavation or trenching—or an honest recommendation when another underground service is the better starting point.",
    },
  ],
  faqTitle: "Excavation and utility trenching questions",
  faqDescription: `Direct answers for common excavation and utility trenching searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What excavation and trenching work does ${site.name} handle?`,
      answer: `${site.name} handles site excavation and utility trenching for homes, businesses, contractors, and municipalities across ${site.serviceArea}. We specialize in underground utility-related digging—not general landscaping or indoor plumbing.`,
    },
    {
      question: "How are site excavation and utility trenching different?",
      answer:
        "Utility trenching is focused on creating the path for buried lines such as sewer, water, or drainage. Site excavation covers the broader ground work needed to reach, support, or prepare for that underground utility work. Many projects need both, which is why they share one service page here.",
    },
    {
      question: `Do you provide excavation and trenching in Toledo and nearby communities?`,
      answer: `Yes. ${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question:
        "Can residential and commercial projects request excavation or trenching?",
      answer: `Yes. Residential customers, commercial property teams, contractors, and municipalities can all request site excavation and utility trenching through a call or the Request Service form.`,
    },
    {
      question: "How do I start an excavation or trenching request?",
      answer: `Call ${site.phone} or use Request Service. Include the city or ZIP, a short description of the underground or site need, and how we should reach you.`,
    },
  ],
  relatedNote: `${site.name} also handles sewer line work, water service lines, stormwater and drainage, and commercial or contractor support when those scopes fit the job.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-repair",
      label: "Sewer line repair",
    },
    {
      href: "/services/water-service-line",
      label: "Water service line",
    },
    {
      href: "/services/stormwater-and-drainage",
      label: "Stormwater and drainage",
    },
    {
      href: "/commercial",
      label: "Commercial services",
    },
  ],
  ctaEyebrow: "Request excavation or trenching",
  ctaTitle: `Need excavation or utility trenching in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us where the property is and what underground utility or site work you need.`,
} as const satisfies ServicePageDefinition;

export const commercialServicesPage = {
  path: "/commercial",
  serviceIds: ["commercial_sewer_water", "contractor_municipal_support"],
  label: "Commercial services",
  photo: workPhotos.commercialPrecastWork,
  title: "Commercial, Contractor & Municipal Underground Utility Work",
  eyebrow: `${site.serviceArea} commercial services`,
  description: `${site.name} supports commercial properties, contractors, and municipalities with underground sewer, water, drainage, excavation, and utility work across ${site.serviceArea}. Call ${site.phone} or request service.`,
  intro: `${site.name} works with commercial property teams, contractors, and municipal partners across ${site.serviceArea} on underground sewer, water, drainage, excavation, and utility trenching. We focus on clear project communication, a well-defined underground scope, and a practical next field step.`,
  scopeDescription: `${site.name} provides commercial sewer and water work plus contractor and municipal support for underground utility projects across ${site.serviceArea}.`,
  scope: [
    "Commercial sewer and water line repair, replacement, and related underground work",
    "Contractor support on underground utility scopes that fit our sewer, water, drainage, excavation, and trenching services",
    "Municipal and public-agency support for sewer, water, drainage, excavation, and utility trenching when the work matches our field capabilities",
    "Stormwater and drainage work tied to commercial or public sites",
    "Site excavation and utility trenching that supports commercial or partner projects",
  ],
  signsTitle: "When commercial and partner teams call us",
  signsDescription:
    "These are common reasons businesses, contractors, and municipalities reach out for underground utility help.",
  signs: [
    "A commercial property with sewer, water, drainage, or underground utility problems",
    "A contractor who needs a specialist partner for buried sewer, water, or utility scopes",
    "A municipal or public-site job that needs practical underground utility field support",
    "Site work that depends on excavation or trenching for buried utilities",
    "A project that needs clear next steps from a Northwest Ohio underground utility crew",
  ],
  processTitle: "How commercial and partner projects start",
  processDescription:
    "A direct path from the project need to a clear underground utility plan.",
  process: [
    {
      step: "01",
      title: "Share the project need",
      body: "Call or request service with the site location, organization name, and whether the work is commercial, contractor, or municipal.",
    },
    {
      step: "02",
      title: "Confirm the underground fit",
      body: "We review whether the scope matches our sewer, water, drainage, excavation, or utility trenching capabilities.",
    },
    {
      step: "03",
      title: "Plan the field response",
      body: "You get a clear next step for the commercial or partner job—or an honest no when the work falls outside our underground utility scope.",
    },
  ],
  faqTitle: "Commercial and partner questions",
  faqDescription: `Direct answers for commercial, contractor, and municipal underground utility searches across Toledo and ${site.serviceArea}.`,
  faqs: [
    {
      question: `What commercial work does ${site.name} handle?`,
      answer: `${site.name} handles commercial sewer and water work, plus related underground drainage, excavation, and utility trenching for businesses and property teams across ${site.serviceArea}.`,
    },
    {
      question: "Do you work with contractors and municipalities?",
      answer: `Yes. ${site.name} supports contractors and municipal or public-agency partners when the underground utility scope fits our sewer, water, drainage, excavation, or utility trenching capabilities. Share the organization, site location, and project need so we can confirm fit and next steps.`,
    },
    {
      question: `Where do you take commercial and partner jobs?`,
      answer: `${site.name} serves Toledo and surrounding communities across ${site.serviceArea}, including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova.`,
    },
    {
      question: "How should a business or partner request service?",
      answer: `Call ${site.phone} or use Request Service. Choose the commercial, contractor, or municipal path, include the organization name, city or ZIP, and a short description of the underground work needed.`,
    },
    {
      question: "Is this the same as residential service?",
      answer: `The underground specialties are the same—sewer, water, drainage, excavation, and utility trenching—but commercial and partner jobs start with organization details and project context so we can plan the right field response.`,
    },
  ],
  relatedNote: `${site.name} also publishes dedicated pages for the core underground services used on commercial and partner jobs.`,
  relatedLinks: [
    {
      href: "/services/sewer-line-repair",
      label: "Sewer line repair",
    },
    {
      href: "/services/sewer-line-replacement",
      label: "Sewer line replacement",
    },
    {
      href: "/services/water-service-line",
      label: "Water service line",
    },
    {
      href: "/services/excavation-and-trenching",
      label: "Site excavation and utility trenching",
    },
  ],
  ctaEyebrow: "Request commercial or partner service",
  ctaTitle: `Need commercial or municipal underground utility help in ${site.serviceArea}?`,
  ctaBody: `Call ${site.name} or send a service request. Tell us the site location, your organization, and the underground work involved.`,
} as const satisfies ServicePageDefinition;

export const publishedServicePages = [
  sewerLineRepairPage,
  sewerLineReplacementPage,
  waterServiceLinePage,
  stormwaterAndDrainagePage,
  excavationAndTrenchingPage,
  commercialServicesPage,
] as const;

export function servicePageByPath(path: string) {
  return publishedServicePages.find((page) => page.path === path);
}
