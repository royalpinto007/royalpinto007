import type { Metadata } from "next";
import { FacetworksCollection } from "@/components/FacetworksCollection";

export const metadata: Metadata = {
  title: "Designs Facetworks",
  description:
    "Explore nineteen independent website designs by Royal Pinto, from creative studios and storefronts to music and architecture.",
  alternates: { canonical: "/facetworks/designs" },
};

export default function DesignsPage() {
  return <FacetworksCollection collection="designs" />;
}
