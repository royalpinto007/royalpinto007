import type { Metadata } from "next";
import { FacetworksCollection } from "@/components/projects/FacetworksCollection";

export const metadata: Metadata = {
  title: "Interactive Graphics | Facetworks",
  description:
    "Twenty browser experiments in physics, particles, 3D, light and sound by Royal Pinto. Open a world and play.",
  alternates: { canonical: "/facetworks/graphics" },
};

export default function GraphicsPage() {
  return <FacetworksCollection collection="graphics" />;
}
