"use client";

import { useState } from "react";
import { ArrowUpRight, Briefcase, Code } from "lucide-react";

/* ────────────────────────── Types ────────────────────────── */

interface SideProject {
  title: string;
  description: string;
  tech: string[];
  github: string;
  featured?: boolean;
}

interface ProfessionalProject {
  company: string;
  role: string;
  period: string;
  location?: string;
  domain: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

/* ────────────────────────── Data ─────────────────────────── */

const sideProjects: SideProject[] = [
  {
    title: "RN Starter",
    description:
      "An opinionated React Native starter template with TypeScript, clean architecture, navigation, state management, and theming — all pre-configured to bootstrap production-ready mobile apps.",
    tech: ["React Native", "TypeScript", "Redux Toolkit", "React Navigation"],
    github: "https://github.com/hrithik73/rn-starter",
    featured: true,
  },
  {
    title: "SpaceX Dashboard",
    description:
      "A SpaceX history tracker fetching launch data, rockets, capsules, and Starlink satellite info from public APIs.",
    tech: ["React Native", "Redux", "REST APIs"],
    github: "https://github.com/hrithik73/spacex-dashboard",
  },
  {
    title: "YouTube Clone",
    description:
      "A YouTube clone with Expo — search, video playback, channel pages, and infinite-scroll feeds via the YouTube Data API.",
    tech: ["React Native", "Expo", "YouTube API"],
    github: "https://github.com/hrithik73/youtube-clone",
  },
  {
    title: "Dukaan App Clone",
    description:
      "Pixel-perfect mobile commerce clone focused on high-performance item lists, quick cart actions, and dashboard analytics.",
    tech: ["React Native", "Redux", "Reanimated"],
    github: "https://github.com/hrithik73/dukaan-app-clone",
  },
  {
    title: "React Native Bucketlist",
    description:
      "A goals management app with category tags, tracking metrics, offline storage, and push-notification reminders.",
    tech: ["React Native", "Expo", "AsyncStorage"],
    github: "https://github.com/hrithik73/react-native-bucketlist",
  },
];

const professionalProjects: ProfessionalProject[] = [
  {
    company: "BharatPe",
    role: "SDE-2 (Mobile)",
    period: "Sep 2025 – Jan 2026",
    location: "Gurugram",
    domain: "bharatpe.com",
    summary:
      "Worked on the consumer-facing mobile application using React Native.",
    highlights: [
      "Revamped the Credit Card user journey to improve onboarding and user experience",
      "Collaborated closely with product and design teams to deliver smoother and more intuitive payment flows",
      "Focused on performance optimization and improving overall app usability",
    ],
    tech: ["React Native", "TypeScript", "Redux", "REST APIs"],
  },
  {
    company: "Baazi Games",
    role: "SDE-2",
    period: "Mar 2025 – Sep 2025",
    location: "Delhi",
    domain: "baazigames.com",
    summary:
      "Worked on the PokerBaazi game team, primarily focusing on the poker game table experience.",
    highlights: [
      "Built and optimized real-time interactive UI components for gameplay",
      "Improved rendering performance and responsiveness for complex game states",
      "Collaborated with backend and product teams to enhance gameplay experience and stability",
    ],
    tech: ["React Native", "TypeScript", "Reanimated", "WebSocket"],
  },
  {
    company: "CARS24",
    role: "SDE-2",
    period: "Apr 2024 – Mar 2025",
    location: "Gurugram",
    domain: "cars24.com",
    summary:
      "Developed and maintained the Channel Partner (B2B) app using React Native for automobile dealers.",
    highlights: [
      "Built scalable and reusable UI components as part of the Design Language System (DLS)",
      "Led multiple proof-of-concepts focused on improving UX and app performance",
      "Implemented iOS Live Activities and Dynamic Island integrations for real-time updates",
      "Worked on app architecture improvements, performance optimization, and reducing load times",
      "Collaborated cross-functionally with product, design, and backend teams",
    ],
    tech: ["React Native", "TypeScript", "Reanimated", "Redux"],
  },
  {
    company: "IndiaNIC Infotech",
    role: "Software Engineer L1",
    period: "Jun 2022 – Feb 2024",
    location: "Ahmedabad",
    domain: "indianic.com",
    summary:
      "Worked on multiple client-based React Native applications across e-commerce, fitness, HRMS, and social networking domains.",
    highlights: [
      "Developed scalable mobile features and reusable components for cross-platform applications",
      "Contributed to app architecture, API integrations, state management, and performance optimization",
      "Worked on a social media platform for clubs and communities along with enterprise HRMS solutions",
    ],
    tech: ["React Native", "TypeScript", "Redux", "REST APIs"],
  },
  {
    company: "Big Oh Tech",
    role: "Graduate Technical Intern",
    period: "Jan 2022 – Jun 2022",
    location: "Noida",
    domain: "bigohtech.com",
    summary:
      "Worked on client projects and internal proof-of-concepts using React and Next.js.",
    highlights: [
      "Contributed to the development of a drag-and-drop microsite builder platform",
      "Built reusable UI modules and implemented Redux-based state management",
      "Collaborated with senior developers on frontend architecture and feature implementation",
    ],
    tech: ["React", "Next.js", "Redux", "TypeScript"],
  },
  {
    company: "Blump Tech",
    role: "Software Engineer Intern",
    period: "Aug 2021 – Dec 2021",
    domain: "blumptech.com",
    summary:
      "Refactored a React Native application from class components to functional components with hooks.",
    highlights: [
      "Upgraded the application to a newer React Native version to improve performance and maintainability",
      "Optimized application responsiveness and improved overall user experience",
      "Assisted in bug fixing, code cleanup, and feature enhancements",
    ],
    tech: ["React Native", "JavaScript", "Redux"],
  },
];

/* ───────────────────── Component: Tabs ──────────────────── */

type Tab = "side" | "professional";

export function ProjectsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("professional");

  return (
    <>
      {/* ── Segmented control ─────────────────────────────── */}
      <div className="relative flex p-1 mb-10 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/40">
        {/* sliding indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-[10px] bg-white dark:bg-zinc-800 shadow-sm shadow-zinc-900/5 dark:shadow-black/20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: "calc(50% - 4px)",
            left: activeTab === "side" ? "4px" : "calc(50%)",
          }}
        />

        <button
          type="button"
          onClick={() => setActiveTab("side")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-medium rounded-[10px] transition-colors duration-200 ${
            activeTab === "side"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Open Source
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("professional")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-medium rounded-[10px] transition-colors duration-200 ${
            activeTab === "professional"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Professional
        </button>
      </div>

      {/* ── Tab content (key swap triggers fade-in) ────────── */}
      <div key={activeTab} className="anim-tab-content">
        {activeTab === "side" ? <SideProjectsView /> : <ProfessionalView />}
      </div>
    </>
  );
}

/* ─────────────── View: Side / Open-source projects ──────── */

function SideProjectsView() {
  const featured = sideProjects.find((p) => p.featured);
  const others = sideProjects.filter((p) => !p.featured);

  return (
    <div className="space-y-3">
      {/* ── Featured hero card ──────────────────────────────── */}
      {featured && (
        <a
          href={featured.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-6 rounded-2xl border border-amber-200/50 dark:border-amber-900/20 bg-gradient-to-br from-amber-50/40 via-transparent to-transparent dark:from-amber-950/10 dark:via-transparent hover:border-amber-300/70 dark:hover:border-amber-700/40 hover:shadow-lg hover:shadow-amber-500/[0.04] transition-all duration-500"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                <Code className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {featured.title}
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold tracking-wider uppercase">
                  Featured
                </span>
              </h3>
            </div>
            <ArrowUpRight className="w-4 h-4 text-amber-400/60 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 mt-0.5" />
          </div>

          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 pl-[42px]">
            {featured.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pl-[42px]">
            {featured.tech.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-0.5 rounded-full text-amber-700/70 dark:text-amber-400/70 bg-amber-50/80 dark:bg-amber-950/30 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
      )}

      {/* ── Other project cards ─────────────────────────────── */}
      {others.map((project) => (
        <a
          key={project.title}
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/40 hover:border-zinc-300/80 dark:hover:border-zinc-700/50 hover:bg-stone-50/50 dark:hover:bg-white/[0.02] transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-[15px] text-zinc-900 dark:text-zinc-100">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 mt-0.5" />
          </div>

          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3.5">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-500 bg-zinc-100/80 dark:bg-zinc-800/50 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─────────────── View: Professional work ────────────────── */

function ProfessionalView() {
  return (
    <div>
      {professionalProjects.map((project, idx) => (
        <div key={project.company}>
          <div className="py-6 first:pt-0">
            {/* Company header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded bg-white shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 shrink-0"
                />
                <div>
                  <h3 className="font-medium text-[15px] text-zinc-900 dark:text-zinc-100">
                    {project.company}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {project.role}
                    {project.location && (
                      <span className="text-zinc-300 dark:text-zinc-600">
                        {" · "}
                        {project.location}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums font-medium shrink-0 ml-4">
                {project.period}
              </span>
            </div>

            {/* Summary */}
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 ml-9">
              {project.summary}
            </p>

            {/* Highlights */}
            <ul className="space-y-2 mb-4 ml-9">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-500/60 mt-[7px] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Tech */}
            <div className="flex flex-wrap gap-1.5 ml-9">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-500 bg-zinc-100/80 dark:bg-zinc-800/50 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider between entries */}
          {idx < professionalProjects.length - 1 && (
            <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/40" />
          )}
        </div>
      ))}
    </div>
  );
}
