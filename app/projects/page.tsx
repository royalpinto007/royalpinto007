import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of products, systems, experiments, and tools I've shipped or worked on.",
};

const sections = [
  "AI Products",
  "Frontend & Design",
  "Open Source & Tools",
  "Earlier Work",
];

export default function ProjectsPage() {
  const visible = sections
    .map((section) => ({
      section,
      projects: siteConfig.projects.filter((p) => p.section === section),
    }))
    .filter((s) => s.projects.length);

  return (
    <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 py-20">
      <div className="glow" aria-hidden />
      <SectionHeader
        eyebrow="Portfolio"
        title="Things I've"
        titleEm="built"
        subtitle="Live products, open source contributions, and tools — most with real users today."
      />
      <div className="mt-14 space-y-16">
        {visible.map(({ section, projects }, si) => (
          <div key={section} className="reveal">
            <div className="flex items-baseline gap-3 mb-8 pb-4 border-b border-line">
              <span className="mono text-xs text-faint">
                {String(si + 1).padStart(2, "0")}
              </span>
              <h2 className="display text-2xl text-ink">{section}</h2>
              <span className="mono text-xs text-faint ml-auto">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <div key={project.id} data-d={String((i % 3) + 1)} className="reveal">
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
