import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import {
  facetworksCollections,
  type FacetworksCollection,
} from "@/lib/data/facetworks";
import { facetworksGroups } from "@/lib/data/facetworks-groups";
import { WorldScene } from "@/components/scenery/WorldScene";
import { CardClip } from "@/components/projects/CardClip";
import { clipFor } from "@/lib/data/project-clips";
import "./facetworks.css";

export function FacetworksCollection({
  collection,
}: {
  collection: FacetworksCollection;
}) {
  const details = facetworksCollections[collection];
  const groups = facetworksGroups(collection);
  const count = groups.reduce(
    (total, group) => total + group.projects.length,
    0,
  );
  const other = collection === "designs" ? "graphics" : "designs";
  const tabCount = (c: FacetworksCollection) =>
    facetworksGroups(c).reduce((total, group) => total + group.projects.length, 0);
  return (
    <div className="portfolio-shell facetworks-page">
      <header className="world-heading facetworks-heading">
        <WorldScene
          kind={collection === "designs" ? "studio" : "arcade"}
          priority
        />
        <Link className="collection-back" href="/projects">
          <ArrowLeft size={18} aria-hidden="true" /> All projects
        </Link>
        <p className="collection-eyebrow">
          Facetworks / {count}{" "}
          {collection === "designs" ? "websites" : "experiments"}
        </p>
        <h1>
          {collection === "designs" ? (
            <>
              Designs with
              <br />
              <span>character</span>
            </>
          ) : (
            <>
              A browser.
              <br />
              <span>A sandbox</span>
            </>
          )}
        </h1>
        <p>{details.description}</p>
        <nav className="collection-tabs" aria-label="Facetworks collections">
          <a
            href="/facetworks/designs"
            aria-current={collection === "designs" ? "page" : undefined}
          >
            Designs <span>{tabCount("designs")}</span>
          </a>
          <a
            href="/facetworks/graphics"
            aria-current={collection === "graphics" ? "page" : undefined}
          >
            Graphics <span>{tabCount("graphics")}</span>
          </a>
        </nav>
      </header>
      <p className="collection-note">
        {collection === "designs"
          ? "Independent design concepts. Open a site and explore the full build."
          : "Open an experiment to interact. Some need a browser with WebGL or WebGPU support."}
      </p>
      <nav className="facetworks-group-jumps" aria-label="Browse groups">
        {groups.map((group) => (
          <a key={group.id} href={`#${group.id}`}>
            {group.title}
            <span>{group.projects.length}</span>
          </a>
        ))}
      </nav>
      {groups.map((group) => (
        <section
          className="facetworks-group"
          key={group.id}
          id={group.id}
          data-facetworks-group={group.id}
        >
          <header className="facetworks-group-heading">
            <h2>{group.title}</h2>
            <span>{group.projects.length} projects</span>
          </header>
          <div className="facetworks-grid">
            {group.projects.map((project) => (
              <a
                className="facetworks-entry"
                href={project.url}
                key={project.slug}
                data-facetworks-project={project.slug}
              >
                <div className="facetworks-preview">
                  <Image
                    src={`https://assets.royalpinto007.com/designs/${project.slug}.webp`}
                    alt={`${project.name} preview`}
                    width={960}
                    height={640}
                    sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  {clipFor(project.slug) && <CardClip src={clipFor(project.slug)!} />}
                  <span className="preview-open" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="facetworks-entry-heading">
                  <h3>{project.name}</h3>
                  <span>{project.genre}</span>
                </div>
                <p>{project.note}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
      <a className="collection-next" href={`/facetworks/${other}`}>
        Explore {other === "designs" ? "the designs" : "interactive graphics"}
        <ArrowUpRight size={22} aria-hidden="true" />
      </a>
    </div>
  );
}
