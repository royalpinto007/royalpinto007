import "./projects.css";
import { WorldScene } from "@/components/WorldScene";
import type { Metadata } from "next";
import { jsonLdScript, pageMetadata, siteUrl } from "@/lib/seo";
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
  web3: "atrium",
  packages: "atrium",
  resources: "atrium",
  "open-source": "pavilion",
} as const;

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  path: "/projects",
  description:
    "Apps, AI agent tooling, Solana and Web3 developer tools, open-source work, website designs, games and interactive graphics by Royal Simpson Pinto.",
});
export default function ProjectsPage() {
  return (
    <div className="portfolio-shell projects-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects",
          url: `${siteUrl}/projects`,
          author: { "@id": `${siteUrl}/#person` },
          hasPart: projectCollections.map((category) => ({
            "@type": "CollectionPage",
            name: category.title,
            description: category.description,
            url: category.href.startsWith("http")
              ? category.href
              : `${siteUrl}${category.href}`,
          })),
        })}
      />
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
                  previewLimit={
                    ["games", "web3", "resources"].includes(category.id) ? 6 : 4
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
