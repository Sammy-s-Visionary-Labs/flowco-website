import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";

export function MobileCallBar() {
  return (
    <aside
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-call-bar backdrop-blur-sm lg:hidden"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2.5">
        <CallLink
          className="w-full"
          label="Call Now"
          size="lg"
          variant="brand"
        />
        <RequestServiceLink className="w-full" size="lg" />
      </div>
    </aside>
  );
}
