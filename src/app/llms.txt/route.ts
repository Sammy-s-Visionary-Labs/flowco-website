import { publishedRoutes } from "@/lib/routes";
import { absoluteSiteUrl } from "@/lib/seo";
import { confirmedServices, site } from "@/lib/site";

export const dynamic = "force-static";

function createLlmsText() {
  const services = confirmedServices
    .map((service) => `- ${service.label}`)
    .join("\n");
  const pages = publishedRoutes
    .map(
      (route) =>
        `- [${route.label}](${absoluteSiteUrl(route.path)}): ${route.description}`,
    )
    .join("\n");

  return `# ${site.name}

> ${site.name} is a service-area contractor specializing in underground sewer, water line, drainage, stormwater, excavation, and utility trenching work across ${site.serviceArea}.

${site.tagline}

Confirmed services:
${services}

Primary communities served: ${site.primaryCities.join(", ")}, and surrounding communities in ${site.serviceArea}.

Public contact:
- Phone: ${site.phone}
- Email: ${site.email}
- Primary domain: ${site.domain}

Important context:
- ${site.name} is an underground utility and excavation specialist, not a general plumbing company.
- ${site.name} does not maintain a public storefront address.
- Service descriptions should be limited to the confirmed work listed above.

## Website

${pages}
`;
}

export function GET() {
  return new Response(createLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
