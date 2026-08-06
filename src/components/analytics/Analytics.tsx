import Script from "next/script";

import { AnalyticsEventBridge } from "@/components/analytics/AnalyticsEventBridge";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { getAnalyticsConfig } from "@/lib/analytics-config";

function googleTagManagerBootstrap(gtmId: string) {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
}

export function Analytics() {
  const config = getAnalyticsConfig();

  return (
    <>
      <PageViewTracker />
      <AnalyticsEventBridge />
      {config.enabled ? (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {googleTagManagerBootstrap(config.gtmId)}
        </Script>
      ) : null}
    </>
  );
}
