import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
// next/image only ships a default export.
import Image from "next/image";
import { WavyRule } from "~/components/wavy-rule";
import { gear, software, type UsesItem } from "~/config/uses";

export const metadata: Metadata = {
  title: "Uses — Hritik Singh",
  description: "The hardware, apps and dev tools I use every day.",
  alternates: { canonical: "/uses" },
};

function Icon({ src }: { src?: string }) {
  // Empty slot keeps names aligned with iconed rows in the same section
  if (!src) return <span className="block size-5" aria-hidden="true" />;
  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      className="block size-5 rounded-[5px]"
    />
  );
}

function Row({ item, withIcon }: { item: UsesItem; withIcon: boolean }) {
  const body = (
    <>
      <div className="flex items-start gap-3 min-w-0 pr-4">
        {withIcon && (
          <span className="mt-0.5 shrink-0">
            <Icon src={item.image} />
          </span>
        )}
        <div className="min-w-0">
          <span className="text-[15px] font-medium text-ink group-hover:text-primary transition-colors">
            {item.name}
          </span>
          {item.note && (
            <p className="text-sm text-muted leading-snug mt-0.5 max-w-[60ch]">
              {item.note}
            </p>
          )}
        </div>
      </div>
      {item.href && (
        <ArrowUpRight className="w-4 h-4 text-muted/50 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
      )}
    </>
  );

  const base = "flex items-start justify-between py-3.5 -mx-3 px-3 rounded-lg";

  if (!item.href) return <div className={base}>{body}</div>;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${base} hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
    >
      {body}
    </a>
  );
}

export default function UsesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14 anim-page">
      <div className="mb-12">
        <h1 className="font-display text-3xl text-ink mb-2">Uses</h1>
        <p className="text-[15px] text-muted">
          What's on my desk and on my machine, kept up to date.
        </p>
      </div>

      {/* Gear: the one place on the page where images lead */}
      <section aria-labelledby="gear">
        <h2 id="gear" className="font-display text-xl text-ink mb-5">
          Desk
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
          {gear.map((item) => (
            <li key={item.name}>
              <div className="aspect-[4/3] rounded-lg bg-white ring-1 ring-inset ring-line overflow-hidden flex items-center justify-center p-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    sizes="(min-width: 640px) 200px, 45vw"
                    className="max-h-full w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <span className="text-sm text-black/40">{item.name}</span>
                )}
              </div>
              <p className="text-[15px] font-medium text-ink mt-2.5">
                {item.name}
              </p>
              {item.note && (
                <p className="text-sm text-muted leading-snug mt-0.5">
                  {item.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <WavyRule />

      <div className="space-y-12">
        {software.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="font-display text-xl text-ink mb-2">
              {section.title}
            </h2>
            <div>
              {section.items.map((item) => (
                <Row
                  key={item.name}
                  item={item}
                  withIcon={section.items.some((i) => i.image)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
