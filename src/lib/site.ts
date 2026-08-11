export const contactDataStatus = {
  mode: "testing",
  productionReady: false,
  replacementRequirement:
    "Replace the test phone, phone link, public email, and lead recipient with owner-confirmed contact data before production launch.",
} as const;

export const site = {
  name: "Ohio Flow Co",
  legalName: "Ohio Flow Co",
  tagline: "Keeping Northwest Ohio Flowing.",
  domain: "https://www.toledosewerandwater.com",
  // TEST ONLY: replace these three contact values before production launch.
  phone: "(419) 486-9657",
  phoneHref: "tel:+14194869657",
  email: "needytrooper04@gmail.com",
  serviceArea: "Northwest Ohio",
  primaryCities: [
    "Toledo",
    "Holland",
    "Maumee",
    "Perrysburg",
    "Whitehouse",
    "Sylvania",
    "Waterville",
    "Monclova",
  ],
};

export const navigation = {
  main: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Commercial", href: "/commercial" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Request Service", href: "/request-service#request-form" },
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export const leadDelivery = {
  provider: "resend",
  recipientEmail: site.email,
  senderEmail: "requests@notifications.ohioflowco.com",
  senderName: site.name,
} as const;

export const confirmedServices = [
  { id: "sewer_line_repair", label: "Sewer line repair" },
  { id: "sewer_line_replacement", label: "Sewer line replacement" },
  { id: "water_service_line_repair", label: "Water service line repair" },
  {
    id: "water_service_line_replacement_installation",
    label: "Water service line replacement and installation",
  },
  { id: "stormwater_management", label: "Stormwater management" },
  { id: "drainage_solutions", label: "Drainage solutions" },
  { id: "site_excavation", label: "Site excavation" },
  { id: "utility_trenching", label: "Utility trenching" },
  { id: "commercial_sewer_water", label: "Commercial sewer and water" },
  {
    id: "contractor_municipal_support",
    label: "Contractor and municipal support",
  },
] as const;
