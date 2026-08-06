export const site = {
  name: "Ohio Flow Co",
  legalName: "Ohio Flow Co",
  tagline: "Keeping Northwest Ohio Flowing.",
  domain: "https://www.toledosewerandwater.com",
  phone: "(567) 358-1055",
  phoneHref: "tel:+15673581055",
  email: "Ohioflowcollc@gmail.com",
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
    { label: "Residential", href: "/residential" },
    { label: "Commercial", href: "/commercial" },
    { label: "Projects", href: "/projects" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
  ],
  cta: { label: "Request Service", href: "/request-service#request-form" },
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export const leadDelivery = {
  recipientEmail: site.email,
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
