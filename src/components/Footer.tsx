import { socialLinks } from "~/config/site";
import { FooterClock } from "./FooterClock";
import { Meadow } from "./Meadow";

const footerLinks = [
  ...socialLinks,
  { name: "email", href: "mailto:shrithik404@gmail.com" },
];

export function Footer() {
  return (
    <footer className="site-footer mt-2">
      <div className="relative z-10 mx-auto max-w-2xl px-6 flex items-center justify-between gap-6">
        <nav
          aria-label="Social links"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted"
        >
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:")
                  ? undefined
                  : "me noopener noreferrer"
              }
              className="underline decoration-transparent decoration-1 underline-offset-[5px] hover:text-ink hover:decoration-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <FooterClock />
      </div>
      <Meadow className="-mt-7" />
    </footer>
  );
}
