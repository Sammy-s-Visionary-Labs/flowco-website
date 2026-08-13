import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/blank",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blank-1",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blank-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/book-online",
        destination: "/request-service",
        permanent: true,
      },
      {
        source: "/general-1",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/post/comprehensive-excavation-services-by-ohio-flowco",
        destination: "/services/excavation-and-trenching",
        permanent: true,
      },
      {
        source:
          "/post/don-t-ignore-the-early-signs-why-you-shouldn-t-delay-sewer-repairs",
        destination: "/services/sewer-line-repair",
        permanent: true,
      },
      {
        source:
          "/post/licensed-plumbing-contractors-in-toledo-why-choose-ohio-flowco",
        destination: "/services",
        permanent: true,
      },
      {
        source:
          "/post/licensed-plumbing-contractors-in-toledo-why-choose-ohio-flowco-1",
        destination: "/services",
        permanent: true,
      },
      {
        source:
          "/post/mastering-excavation-project-planning-for-ohio-plumbing",
        destination: "/services/excavation-and-trenching",
        permanent: true,
      },
      {
        source:
          "/post/mastering-excavation-project-planning-for-ohio-plumbing-1",
        destination: "/services/excavation-and-trenching",
        permanent: true,
      },
      {
        source:
          "/post/when-to-call-a-plumber-for-sewer-issues-and-why-waiting-can-cost-you",
        destination: "/services/sewer-line-repair",
        permanent: true,
      },
      {
        source: "/service-page/plumbing-more",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/service-page/sewer-repair-service",
        destination: "/services/sewer-line-repair",
        permanent: true,
      },
      {
        source: "/service-page/storm-water-management-service",
        destination: "/services/stormwater-and-drainage",
        permanent: true,
      },
      {
        source: "/service-page/water-line-service",
        destination: "/services/water-service-line",
        permanent: true,
      },
      {
        source: "/sewer-repair",
        destination: "/services/sewer-line-repair",
        permanent: true,
      },
      {
        source: "/storm-water-management",
        destination: "/services/stormwater-and-drainage",
        permanent: true,
      },
      {
        source: "/toledo-sewer-line-location-services/sewer-",
        destination: "/service-areas",
        permanent: true,
      },
      {
        source:
          "/toledo-sewer-line-location-services/sewer-line-service-maumee-",
        destination: "/service-areas",
        permanent: true,
      },
      {
        source:
          "/toledo-sewer-line-location-services/sewer-line-service-perrysburg%2C-ohio-",
        destination: "/service-areas",
        permanent: true,
      },
      {
        source:
          "/toledo-sewer-line-location-services/sewer-line-service-toledo%2C-ohio",
        destination: "/service-areas/toledo",
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
