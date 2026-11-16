import { facetworksProjects, type FacetworksCollection } from "./facetworks";

const groups = {
  designs: [
    {
      id: "studios",
      title: "Studios & portfolios",
      ids: ["vantage", "fable", "atlas", "quire"],
    },
    {
      id: "products",
      title: "Products & research",
      ids: ["conduit", "nebula", "ledger", "sprout", "fathom"],
    },
    {
      id: "places",
      title: "Places & services",
      ids: ["fieldline", "hollowpine", "lumen", "ironline", "cellar"],
    },
    {
      id: "culture",
      title: "Culture & storefronts",
      ids: ["threadline", "halcyon", "pulse", "frequency", "puffly"],
    },
  ],
  graphics: [
    {
      id: "3d-scenes",
      title: "3D scenes & characters",
      ids: [
        "coin-trick",
        "rat-heist",
        "fly-circuit-lab",
        "fly-forklift",
        "spider-pounce",
        "fly-captcha",
        "rent-my-screen",
      ],
    },
    {
      id: "physics",
      title: "Physics & touch",
      ids: [
        "magnetic-sand",
        "jelly-iphone",
        "jelly-pancake",
        "gummy",
        "jalebi",
      ],
    },
    {
      id: "generative",
      title: "Generative visuals",
      ids: [
        "abyss",
        "auralis",
        "drift",
        "lichen",
        "undertow",
        "mycelia",
        "splat-lab",
      ],
    },
    {
      id: "interactions",
      title: "Windows, sound & play",
      ids: [
        "fogged-glass",
        "lunelle",
        "mochimo",
        "manchester-red",
        "signal-07",
      ],
    },
  ],
};

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
