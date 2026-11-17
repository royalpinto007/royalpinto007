import "./projects.css";
import { WorldScene } from "@/components/WorldScene";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { projectCollections } from "@/data/project-collections";
import { ProjectCollage } from "@/components/ProjectCollage";
import { CategoryMenu } from "@/components/CategoryMenu";
import { collectionAliases } from "@/data/project-categories";
import { ProjectsScenery } from "@/components/ProjectsScenery";

const scenery = {
  experiments: "tidal",
  games: "observatory",
  apps: "marina",
  websites: "conservatory",
  web3: "observatory",
  packages: "atrium",
  agentpostmortem: "cinema",
  "open-source": "pavilion",
} as const;

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
        <ProjectsScenery scene="tidal" priority />
        <WorldScene kind="arcade" priority />
        <h1>Projects.</h1>
        <p>Products, tools and experiments. Pick a preview. Open the build.</p>
      </header>
      <div className="project-directory-bar">
        <p>
          <span aria-hidden="true">↘</span> Browse by category.
        </p>
        <CategoryMenu
          items={projectCollections.map(({ id, title }) => ({ id, title }))}
        />
      </div>
      <nav className="project-jumps" aria-label="Project categories">
        {projectCollections.map((category) => (
          <a key={category.id} href={`#${category.id}`}>
            {category.title}
          </a>
        ))}
      </nav>
      {projectCollections.map((category) => {
        const groups = category.overviewGroups ?? category.groups;
        return (
          <section
            className={`project-chapter chapter-${category.id}`}
            key={category.id}
            id={category.id}
            data-project-category={category.id}
          >
            <ProjectsScenery scene={scenery[category.id]} />
            {Object.entries(collectionAliases)
              .filter(([, target]) => target === category.id)
              .map(([alias]) => (
                <span
                  id={alias}
                  className="collection-alias"
                  aria-hidden="true"
                  key={alias}
                />
              ))}
            <div className="collection-section-heading">
              <div className="section-intro">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
              <a
                className="collection-view-all collection-all"
                href={category.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View all {category.count}
                <span className="sr-only"> {category.title}</span>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </div>
            <div
              className={`collection-boards ${groups.length === 1 ? "collection-boards-single" : ""}`}
            >
              {groups.map((group) => (
                <ProjectCollage
                  key={group.id}
                  group={group}
                  single={groups.length === 1}
                  previewLimit={category.id === "games" ? 6 : 4}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
