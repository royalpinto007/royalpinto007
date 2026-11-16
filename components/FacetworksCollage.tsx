import {
  facetworksProjects,
  facetworksCollections,
  type FacetworksCollection,
} from "@/data/facetworks";
import { ProjectCollage } from "./ProjectCollage";

export function FacetworksCollage({
  collection,
}: {
  collection: FacetworksCollection;
}) {
  const projects = facetworksProjects.filter(
    (project) => project.collection === collection,
  );
  return (
    <ProjectCollage
      items={projects.map((project) => ({
        id: project.slug,
        image: `/designs/${project.slug}.webp`,
      }))}
      href={`https://royalpinto007.com/facetworks/${collection}`}
      caption={`${projects.length} ${collection === "designs" ? "design websites" : "interactive experiments"}`}
      action={facetworksCollections[collection].action}
      className={`facetworks-collage collage-${collection}`}
    />
  );
}
