import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import {
  facetworksProjects,
  facetworksCollections,
  type FacetworksCollection,
} from "@/data/facetworks";
import { WorldScene } from "./WorldScene";
import "./facetworks.css";

export function FacetworksCollection({
  collection,
}: {
  collection: FacetworksCollection;
}) {
  const details = facetworksCollections[collection];
  const projects = facetworksProjects.filter(
    (project) => project.collection === collection,
  );
  const other = collection === "designs" ? "graphics" : "designs";
  return (
    <div className="portfolio-shell facetworks-page">
      <header className="world-heading facetworks-heading">
        <WorldScene
          kind={collection === "designs" ? "studio" : "arcade"}
          priority
        />
        <a className="collection-back" href="/projects">
          <ArrowLeft size={18} aria-hidden="true" /> All projects
        </a>
        <p className="collection-eyebrow">
          Facetworks / {projects.length}{" "}
          {collection === "designs" ? "websites" : "experiments"}
        </p>
        <h1>
          {collection === "designs" ? (
            <>
              Designs with
              <br />
              <span>character.</span>
            </>
          ) : (
            <>
              A browser.
              <br />
              <span>A playground.</span>
            </>
          )}
        </h1>
        <p>{details.description}</p>
        <nav className="collection-tabs" aria-label="Facetworks collections">
          <a
            href="/facetworks/designs"
            aria-current={collection === "designs" ? "page" : undefined}
          >
            Designs <span>19</span>
          </a>
          <a
            href="/facetworks/graphics"
            aria-current={collection === "graphics" ? "page" : undefined}
          >
            Graphics <span>24</span>
          </a>
        </nav>
      </header>
      <p className="collection-note">
        {collection === "designs"
          ? "Independent design concepts. Open a site and explore the full build."
          : "Open an experiment to interact. Some need a browser with WebGL or WebGPU support."}
      </p>
      <div className="facetworks-grid">
        {projects.map((project) => (
          <a
            className="facetworks-entry"
            href={project.url}
            key={project.slug}
            data-facetworks-project={project.slug}
          >
            <div className="facetworks-preview">
              <Image
                src={`/designs/${project.slug}.webp`}
                alt={`${project.name} preview`}
                width={960}
                height={640}
                sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
              <span className="preview-open" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </div>
            <div className="facetworks-entry-heading">
              <h2>{project.name}</h2>
              <span>{project.genre}</span>
            </div>
            <p>{project.note}</p>
          </a>
        ))}
      </div>
      <a className="collection-next" href={`/facetworks/${other}`}>
        Explore {other === "designs" ? "the designs" : "interactive graphics"}
        <ArrowUpRight size={22} aria-hidden="true" />
      </a>
    </div>
  );
}
