type Faq = {
  answer: string;
  question: string;
};

type FaqListProps = {
  faqs: readonly Faq[];
};

export function FaqList({ faqs }: FaqListProps) {
  return (
    <div className="mt-10 border-y border-line">
      {faqs.map((faq) => (
        <details className="group border-b border-line last:border-b-0" key={faq.question}>
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left marker:content-none sm:min-h-24 sm:py-6">
            <span className="font-display text-xl font-black tracking-[-0.03em] text-brand-deep sm:text-2xl">
              {faq.question}
            </span>
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center border border-brand/30 bg-surface text-xl font-light text-brand transition-colors group-open:border-accent group-open:bg-accent group-open:text-brand-deep"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className="max-w-3xl pb-7 pr-12 text-base leading-7 text-ink-muted sm:pb-8 sm:pr-16 sm:leading-8">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
