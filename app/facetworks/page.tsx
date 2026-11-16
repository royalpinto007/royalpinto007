import type { Metadata } from "next";
import { FacetworksCollage } from "@/components/FacetworksCollage";
import { WorldScene } from "@/components/WorldScene";
import { facetworksCollections } from "@/data/facetworks";
import "@/components/facetworks.css";

export const metadata: Metadata = {
  title: "Facetworks",
  description:
    "Nineteen design websites and twenty-four interactive graphics experiments by Royal Pinto. Pick a collection and explore.",
  alternates: { canonical: "/facetworks" },
};

export default function FacetworksPage() {
  return (
    <div className="portfolio-shell facetworks-page">
      <header className="world-heading facetworks-heading">
        <WorldScene kind="studio" priority />
        <p className="collection-eyebrow">Design & creative development</p>
        <h1>
          Facetworks<span>.</span>
        </h1>
        <p>
          Different visual worlds. One browser. Pick a collection and explore.
        </p>
      </header>
      {(["designs", "graphics"] as const).map((collection) => (
        <section
          className="facetworks-index-section"
          id={collection === "designs" ? "sites" : "experiments"}
          key={collection}
        >
          <h2>{facetworksCollections[collection].title}</h2>
          <FacetworksCollage collection={collection} />
        </section>
      ))}
    </div>
  );
}
