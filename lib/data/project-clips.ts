/** Facetworks pieces with a short motion clip in R2 (clips/<slug>.mp4), recorded from the live build. */
export const clipSlugs = new Set<string>(["abyss", "atlas", "auralis", "cellar", "conduit", "drape", "drift", "fable", "fathom", "fieldline", "fly-forklift", "fogged-glass", "frequency", "halcyon", "hollowpine", "ironline", "ledger", "lichen", "lumen", "magnetic-sand", "manchester-red", "mochimo", "mycelia", "nebula", "puffly", "pulse", "quire", "rat-heist", "rent-my-screen", "splat-lab", "sprout", "threadline", "vantage"]);

export const clipFor = (slug: string) =>
  clipSlugs.has(slug) ? `https://assets.royalpinto007.com/clips/${slug}.mp4` : undefined;
