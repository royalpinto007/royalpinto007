import facetworkGroups from "@/content/facetworks-groups.json";
import { facetworksProjects, type FacetworksCollection } from "./facetworks";

const groups: Record<
  FacetworksCollection,
  { id: string; title: string; ids: string[] }[]
> = facetworkGroups;

export function facetworksGroups(collection: FacetworksCollection) {
  const projects = facetworksProjects.filter(
    (p) => p.collection === collection,
  );
  const result = groups[collection].map((group) => ({
    id: group.id,
    title: group.title,
    projects: group.ids.map((id) => {
      const project = projects.find((p) => p.slug === id);
      if (!project) throw new Error(`Unknown ${collection} project: ${id}`);
      return project;
    }),
  }));
  const ids = result.flatMap((group) => group.projects.map((p) => p.slug));
  if (ids.length !== projects.length || new Set(ids).size !== ids.length)
    throw new Error(`Incomplete or duplicate ${collection} grouping`);
  return result;
}
