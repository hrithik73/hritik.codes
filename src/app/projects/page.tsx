import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Hritik Singh",
  description: "Places I've worked and things I've built.",
};

const work = [
  {
    company: "BharatPe",
    href: "https://bharatpe.com",
    domain: "bharatpe.com",
    role: "SDE-2",
    location: "Gurugram",
    period: "Sep 2025 – Jan 2026",
    note: "Consumer mobile app. Revamped the Credit Card onboarding journey and tightened up payment flows.",
  },
  {
    company: "Baazi Games",
    href: "https://baazigames.com",
    domain: "baazigames.com",
    role: "SDE-2",
    location: "Delhi",
    period: "Mar 2025 – Sep 2025",
    note: "PokerBaazi game table — real-time interactive UI, Reanimated-heavy, lots of complex game state to wrangle.",
  },
  {
    company: "CARS24",
    href: "https://cars24.com",
    domain: "cars24.com",
    role: "SDE-2",
    location: "Gurugram",
    period: "Apr 2024 – Mar 2025",
    note: "Channel Partner B2B app for dealers. Built the design system, shipped iOS Live Activities, and cut load times.",
  },
  {
    company: "IndiaNIC Infotech",
    href: "https://indianic.com",
    domain: "indianic.com",
    role: "Software Engineer",
    location: "Ahmedabad",
    period: "Jun 2022 – Feb 2024",
    note: "Client apps across e-commerce, fitness, social, and enterprise HRMS. Full feature cycles, start to ship.",
  },
  {
    company: "Big Oh Tech",
    href: "https://bigohtech.com",
    domain: "bigohtech.com",
    role: "Intern",
    location: "Noida",
    period: "Jan 2022 – Jun 2022",
    note: "Drag-and-drop microsite builder in React and Next.js. My first real job.",
  },
  {
    company: "Blump Tech",
    href: "https://blumptech.com",
    domain: "blumptech.com",
    role: "Intern",
    period: "Aug 2021 – Dec 2021",
    note: "React Native class-to-hooks migration, version bump, and bug fixes.",
  },
];

const side = [
  {
    title: "RN Starter",
    href: "https://github.com/hrithik73/rn-starter",
    note: "Opinionated React Native template — TypeScript, navigation, Redux, and theming all pre-wired.",
  },
  {
    title: "SpaceX Dashboard",
    href: "https://github.com/hrithik73/spacex-dashboard",
    note: "Launch history, rockets, Starlink satellites — pulled from the public SpaceX API.",
  },
  {
    title: "YouTube Clone",
    href: "https://github.com/hrithik73/youtube-clone",
    note: "Search, playback, channel pages. Built with Expo and the YouTube Data API.",
  },
  {
    title: "Dukaan Clone",
    href: "https://github.com/hrithik73/dukaan-app-clone",
    note: "Pixel-perfect mobile commerce clone. Focused on list perf and smooth Reanimated transitions.",
  },
  {
    title: "Bucketlist",
    href: "https://github.com/hrithik73/react-native-bucketlist",
    note: "Goals tracker with category tags, push reminders, and offline storage.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      {/* Header */}
      <div className="mb-12 anim-1">
        <h1 className="font-display text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight mb-1">
          Work
        </h1>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
          Places I've been, things I've built.
        </p>
      </div>

      {/* Work timeline */}
      <section className="anim-2">
        {work.map((item, i) => (
          <div
            key={item.company}
            className={`py-5 ${i < work.length - 1 ? "border-b border-zinc-200/60 dark:border-zinc-800/40" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                  alt=""
                  width={15}
                  height={15}
                  className="rounded-sm bg-white shrink-0 opacity-90"
                />
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0"
                >
                  {item.company}
                </a>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                  {item.role}
                  {item.location ? ` · ${item.location}` : ""}
                </span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">
                {item.period}
              </span>
            </div>
            <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed pl-[23px]">
              {item.note}
            </p>
          </div>
        ))}
      </section>

      {/* Side projects */}
      <section className="mt-14 anim-3">
        <p className="text-[10px] tracking-[0.18em] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-1">
          Side projects
        </p>
        <div className="h-px bg-zinc-200/80 dark:bg-zinc-800/80 mb-5" />

        <div>
          {side.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between py-3.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
            >
              <div className="min-w-0 pr-4">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {p.title}
                </span>
                <p className="text-[13px] text-zinc-400 dark:text-zinc-500 leading-snug mt-0.5">
                  {p.note}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
