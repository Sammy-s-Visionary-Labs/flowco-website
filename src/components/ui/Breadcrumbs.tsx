import Link from "next/link";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  className?: string;
  items: readonly BreadcrumbItem[];
};

export function Breadcrumbs({ className = "", items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-y-2 text-sm text-ink-muted" role="list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex min-w-0 items-center" key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span aria-hidden="true" className="mx-2.5 shrink-0 text-line-strong">
                  /
                </span>
              ) : null}
              {isCurrent ? (
                <span aria-current="page" className="font-bold text-brand">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  className="inline-flex min-h-11 items-center font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:text-brand hover:decoration-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
