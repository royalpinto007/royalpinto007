export const drupalProjects = [
  {
    id: "text-generation",
    name: "Text Generation",
    category: "Drupal module",
    status: "Open source",
    description:
      "Drupal 10 module, published on Drupal.org, that adds a CKEditor 5 toolbar button for prompt-based text generation. Runs GPT-2 on the server through TransformersPHP, so no API key is needed.",
    features: [],
    tech: ["Drupal", "CKEditor 5", "TransformersPHP"],
    featured: false,
    section: "Drupal",
    liveUrl: "#",
    githubUrl: "https://github.com/royalpinto007/text_generation",
  },
];

export const dLanguageProjects = [
  {
    id: "d-simple-server",
    name: "dSimpleServer",
    category: "Web server",
    status: "Open source",
    description:
      "Minimal D web server on vibe.d with two routes and a 404 handler, kept small so the whole request flow is easy to read.",
    features: [],
    tech: ["D", "vibe.d", "Dub"],
    featured: false,
    section: "D Language",
    liveUrl: "#",
    githubUrl: "https://github.com/royalpinto007/dSimpleServer",
  },
  {
    id: "phobos-nogc-checker",
    name: "Phobos NOGC Checker",
    category: "Source analysis",
    status: "Prototype",
    description:
      "Prototype that scans D source trees and prints a Markdown table of which functions carry @nogc, a first step toward measuring how much of Phobos works without the garbage collector.",
    features: [],
    tech: ["D", "Dub", "Static analysis"],
    featured: false,
    section: "D Language",
    liveUrl: "#",
    githubUrl: "https://github.com/royalpinto007/phobos-nogc-checker",
  },
  {
    id: "d-errors-docs",
    name: "D Error Docs",
    category: "Documentation site",
    status: "Open source",
    description:
      "Unofficial guide to D compiler errors: 44 pages covering 20 common errors with causes and fixes, plus diagnostics, SARIF and debugging guides, with instant search.",
    features: [],
    tech: ["Astro", "MDX", "Svelte"],
    featured: false,
    section: "D Language",
    liveUrl: "https://d-errors-docs.vercel.app",
    githubUrl: "https://github.com/royalpinto007/d-errors-docs",
  },
];
