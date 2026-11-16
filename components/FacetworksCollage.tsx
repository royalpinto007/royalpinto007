import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  facetworksProjects,
  facetworksCollections,
  type FacetworksCollection,
} from "@/data/facetworks";
import "./facetworks.css";

export function FacetworksCollage({
  collection,
}: {
  collection: FacetworksCollection;
}) {
  const projects = facetworksProjects.filter(
    (project) => project.collection === collection,
  );
  return (
    <a
      className={`facetworks-collage collage-${collection}`}
      href={`https://royalpinto007.com/facetworks/${collection}`}
    >
      <div className="collage-screens" aria-hidden="true">
        {projects.map((project) => (
          <div key={project.slug} className="collage-screen">
            <Image
              src={`/designs/${project.slug}.webp`}
              alt=""
              width={960}
              height={640}
              sizes="(max-width: 767px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>
      <div className="collage-caption">
        <span>
          {projects.length}{" "}
          {collection === "designs"
            ? "design websites"
            : "interactive experiments"}
        </span>
        <span>
          {facetworksCollections[collection].action}{" "}
          <ArrowUpRight aria-hidden="true" size={22} />
        </span>
      </div>
    </a>
  );
}
