import type { Metadata } from "next";
import { ProjectsTabs } from "@/components/ProjectsTabs";

export const metadata: Metadata = {
  title: "Projects — Hritik Singh",
  description:
    "A collection of products I've helped build, teams I've worked with, and side projects I've shipped.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <header className="mb-10 anim-1">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-pretty tracking-tight">
          Projects
        </h1>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          A collection of products I've helped build, teams I've worked with,
          and side projects I've shipped.
        </p>
      </header>

      <div className="anim-2">
        <ProjectsTabs />
      </div>
    </div>
  );
}
