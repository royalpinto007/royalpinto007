import catalogue from "./facetworks.json";

export type FacetworksCollection = "designs" | "graphics";

export const facetworksProjects = catalogue.map((project) => ({
  ...project,
  url: `https://royalpinto007.com/facetworks/${project.collection}/${project.slug}/`,
}));

export const facetworksCollections = {
  designs: {
    title: "Designs Facetworks",
    description:
      "Websites with their own point of view. From studios and storefronts to music, type and places to escape.",
    action: "Explore the designs",
  },
  graphics: {
    title: "Interactive Graphics",
    description:
      "Physics, particles, light and little worlds. Built for the browser, made to play with.",
    action: "Explore the graphics",
  },
} as const;
