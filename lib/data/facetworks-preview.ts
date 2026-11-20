import type { FacetworksCollection } from "./facetworks";

const assets = "https://assets.royalpinto007.com/designs";

export function facetworksPreview(collection: FacetworksCollection, slug: string) {
  if (collection === "designs" && slug !== "puffly") {
    const scene = `${assets}/motion/${slug}-scene`;
    return { image: `${scene}.webp`, film: `${scene}.mp4` };
  }
  return { image: `${assets}/${slug}.webp` };
}
