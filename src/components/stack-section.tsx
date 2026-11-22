import { stack } from "~/config/stack";
import { SectionHeading } from "./section-heading";
import { StackIcon } from "./stack-icon";

/** Home-page "Stack" list. Currently hidden — see src/app/page.tsx. */
export function StackSection({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <SectionHeading title="Stack" />
      <dl className="divide-y divide-line">
        {stack.map((group) => (
          <div
            key={group.label}
            className="grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
          >
            <dt className="text-sm text-muted">{group.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="inline-flex items-center gap-1.5 text-[15px] text-ink"
                  >
                    <StackIcon icon={item.icon} />
                    {item.name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
