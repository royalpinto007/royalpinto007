import { WorldScene } from "@/components/WorldScene";
import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/data/site";
import { projectCategories, categoryFor } from "@/data/project-categories";
import { ProjectCard } from "@/components/ProjectCard";
import { DesignGallery } from "@/components/DesignGallery";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
  description:
    "Browse apps, browser extensions, websites, interactive experiments, packages, and open-source contributions by Royal Pinto.",
};
export default function ProjectsPage() {
  return (
    <div className="portfolio-shell projects-page">
      <header className="projects-heading world-heading" data-motion-intro>
        <WorldScene />
        <h1>
          Many ideas.
          <br />
          <span>Made real.</span>
        </h1>
        <p>
          Apps that solve a problem. Tools that save a step. Websites that make
          you look twice. Explore what I build, and how I build it.
        </p>
      </header>
      <nav className="project-jumps" aria-label="Project categories">
        {projectCategories.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.title}
          </a>
        ))}
      </nav>
      {projectCategories.map((category) => {
        const hasPreview = (id: string) =>
          existsSync(path.join(process.cwd(), "public/work", id + ".webp"));
        const items = siteConfig.projects
          .filter((project) => categoryFor(project) === category.id)
          .sort((a, b) => Number(hasPreview(b.id)) - Number(hasPreview(a.id)));
        return (
          <section
            key={category.id}
            id={category.id}
            data-project-category={category.id}
          >
            <div className="section-intro">
              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </div>
            {category.id === "websites" ? (
              <DesignGallery kind="websites" />
            ) : category.id === "experiments" ? (
              <DesignGallery kind="experiments" />
            ) : (
              <div className="category-projects">
                {items.map((project) => {
                  const screenshot = existsSync(
                    path.join(
                      process.cwd(),
                      "public/work",
                      project.id + ".webp",
                    ),
                  )
                    ? `/work/${project.id}.webp`
                    : null;
                  return (
                    <div
                      key={project.id}
                      className="category-project"
                      data-project-id={project.id}
                    >
                      {screenshot && (
                        <a
                          href={
                            project.liveUrl !== "#"
                              ? project.liveUrl
                              : project.githubUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={screenshot}
                            alt={`${project.name} preview`}
                            width={1008}
                            height={700}
                          />
                        </a>
                      )}
                      <ProjectCard {...project} compact />
                    </div>
                  );
                })}
              </div>
            )}
            {category.id === "websites" && (
              <a
                className="quiet-link"
                href="https://royalpinto007.com/facetworks/"
              >
                Explore Facetworks ↗
              </a>
            )}
          </section>
        );
      })}
    </div>
  );
}
