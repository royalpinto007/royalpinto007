import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of products, systems, experiments, and tools I've shipped or worked on.",
};

const sections = ["AI Products", "Open Source & Tools", "Earlier Work"];

export default function ProjectsPage() {
  return (
    <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-20">
      <SectionHeader
        eyebrow="Portfolio"
        title="Things I've"
        titleEm="built"
        subtitle="Live products, open source contributions, and tools — most with real users today."
      />
      {sections.map((section) => {
        const projects = siteConfig.projects.filter((p) => p.section === section);
        if (!projects.length) return null;
        return (
          <div key={section} className="mb-16">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint mb-8 pb-4 border-b border-line">
              {section}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
