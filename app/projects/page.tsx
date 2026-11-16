import "./projects.css";
import { WorldScene } from "@/components/WorldScene";
import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/data/site";
import { projectCategories, categoryFor } from "@/data/project-categories";
import { ProjectCard } from "@/components/ProjectCard";
import { FacetworksCollage } from "@/components/FacetworksCollage";
import { CategoryMenu } from "@/components/CategoryMenu";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
  description:
    "Explore apps, Solana and Web3 tools, browser extensions, websites, interactive experiments and open-source work by Royal Pinto.",
};
export default function ProjectsPage() {
  return (
    <div className="portfolio-shell projects-page">
      <header className="projects-heading world-heading" data-motion-intro>
        <WorldScene kind="arcade" priority />
        <h1>Projects.</h1>
        <p>
          Apps, agents, APIs, extensions and experiments. Code I build, deploy
          and maintain.
        </p>
      </header>
      <div className="project-directory-bar">
        <p>
          <span aria-hidden="true">↘</span> Browse by category.
        </p>
        <CategoryMenu
          items={projectCategories.map(({ id, title }) => ({ id, title }))}
        />
      </div>
      <nav className="project-jumps" aria-label="Project categories">
        {projectCategories.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.title}
          </a>
        ))}
      </nav>
      {projectCategories.map((category, index) => {
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
              <span className="chapter-index">
                Collection / {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </div>
            {category.id === "websites" ? (
              <FacetworksCollage collection="designs" />
            ) : category.id === "experiments" ? (
              <FacetworksCollage collection="graphics" />
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
                      id={`project-${project.id}`}
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
          </section>
        );
      })}
    </div>
  );
}
