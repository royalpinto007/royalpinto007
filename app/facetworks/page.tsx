import type { Metadata } from "next";
import { ProjectCollage } from "@/components/projects/ProjectCollage";
import { projectCollections } from "@/lib/data/project-collections";
import { ArrowUpRight } from "lucide-react";
import { WorldScene } from "@/components/scenery/WorldScene";
import "@/components/projects/facetworks.css";

export const metadata: Metadata = {
  title: "Facetworks",
  description:
    "Nineteen design websites and twenty interactive graphics experiments by Royal Pinto. Pick a collection and explore.",
  alternates: { canonical: "/facetworks" },
};

export default function FacetworksPage() {
  return (
    <div className="portfolio-shell facetworks-page">
      <header className="world-heading facetworks-heading">
        <WorldScene kind="studio" priority />
        <p className="collection-eyebrow">Design & creative development</p>
        <h1>Facetworks</h1>
        <p>
          Different visual worlds. One browser. Pick a collection and explore.
        </p>
      </header>
      {projectCollections
        .filter(
          (category) =>
            category.id === "websites" || category.id === "experiments",
        )
        .map((category) => (
          <section
            className="facetworks-index-section"
            id={category.id === "websites" ? "sites" : "experiments"}
            key={category.id}
          >
            <div className="collection-section-heading">
              <h2>{category.title}</h2>
              <a
                className="collection-view-all collection-all"
                href={category.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View all {category.count}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="collection-boards">
              {category.groups.map((group) => (
                <ProjectCollage key={group.id} group={group} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
