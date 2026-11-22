"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { posthog } from "posthog-js";
import type { ReactNode } from "react";
import { socialLinks } from "~/config/site";
import { FooterClock } from "./footer-clock";
import { Meadow } from "./meadow";
import { useWeather, WeatherFx, weatherAttributes } from "./weather";

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  x: <XIcon />,
  github: <Github className="size-3.5" aria-hidden="true" />,
  linkedin: <Linkedin className="size-3.5" aria-hidden="true" />,
};

// Icon colour on hover. X and GitHub are black brands, so they just take ink
// from the link's own hover state.
const hoverColors: Record<string, string> = {
  linkedin: "group-hover:text-[#0A66C2]",
};

const footerLinks = [
  ...socialLinks.map((l) => ({
    ...l,
    icon: icons[l.name],
    hoverColor: hoverColors[l.name] ?? "",
  })),
  {
    name: "hi@hritik.io",
    href: "mailto:hi@hritik.io",
    icon: <Mail className="size-3.5" aria-hidden="true" />,
    hoverColor: "group-hover:text-accent",
  },
];

export function Footer() {
  const weather = useWeather();

  return (
    <footer
      className="site-footer relative mt-2"
      {...weatherAttributes(weather)}
    >
      {weather && <WeatherFx weather={weather} />}
      <div className="relative z-10 mx-auto max-w-2xl px-6 flex items-center justify-between gap-6">
        <nav
          aria-label="Social links"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted"
        >
          {footerLinks.map((link) => {
            const isEmailContact = link.href.startsWith("mailto:");

            return (
              <a
                key={link.name}
                href={link.href}
                target={isEmailContact ? undefined : "_blank"}
                rel={isEmailContact ? undefined : "me noopener noreferrer"}
                onClick={() => {
                  if (isEmailContact) {
                    posthog.capture("contact_link_clicked", {
                      contact_method: "email",
                    });
                    return;
                  }

                  posthog.capture("social_profile_clicked");
                }}
                className="group inline-flex items-center gap-1.5 underline decoration-transparent decoration-1 underline-offset-[5px] hover:text-ink hover:decoration-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
              >
                <span
                  className={`inline-flex transition-colors ${link.hoverColor}`}
                >
                  {link.icon}
                </span>
                {link.name}
              </a>
            );
          })}
        </nav>
        <FooterClock />
      </div>
      <Meadow className="-mt-7" />
    </footer>
  );
}
