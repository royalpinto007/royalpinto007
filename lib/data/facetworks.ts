import catalogue from "@/content/facetworks.json";
import collections from "@/content/facetworks-collections.json";

export type FacetworksCollection = "designs" | "graphics";

export const facetworksProjects = catalogue.map((project) => ({
  ...project,
  url: `https://royalpinto007.com/facetworks/${project.collection}/${project.slug}/`,
}));

export const facetworksCollections: Record<
  FacetworksCollection,
  { title: string; description: string; action: string }
> = collections;
