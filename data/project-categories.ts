import { siteConfig } from "./site";
import agentpostmortemTools from "./agentpostmortem.json";

export const projectCategories = [
  {
    id: "products",
    title: "Products",
    description: "AashiNyra, a fashion deals and cashback platform.",
  },
  {
    id: "apps",
    title: "Apps",
    description:
      "Web and mobile products, from AI workspaces to offline-first tools.",
  },
  {
    id: "productivity-apps",
    title: "Productivity Apps",
    description:
      "Mobile and desktop apps for planning, money, offline messaging and keeping a record of your work.",
  },
  {
    id: "games",
    title: "Games",
    description:
      "Six game projects, from delivery challenges and football to shared-device board games.",
  },
  {
    id: "web3",
    title: "Solana & Web3",
    description:
      "Open-source tools for token permissions, transactions, payments and on-chain receipts.",
  },
  {
    id: "browser-extensions",
    title: "Browser extensions",
    description:
      "Chrome and Firefox tools for research, reading, accessibility, and everyday browser work.",
  },
  {
    id: "websites",
    title: "Designs Facetworks",
    description:
      "Nineteen websites. Different ideas, different identities. One collection.",
  },
  {
    id: "experiments",
    title: "Interactive Graphics",
    description:
      "Twenty-four experiments in physics, 3D, particles, light and sound. Open the collection and play.",
  },
  {
    id: "packages",
    title: "Packages & developer tools",
    description:
      "Installable libraries, command-line utilities, MCP integrations, and reusable skills.",
  },
  {
    id: "agentpostmortem",
    title: "AgentPostmortem",
    description:
      "Agents, context tools, security checks and evaluations. Explore the toolkit through demos and workflow previews.",
  },
  {
    id: "editor-tools",
    title: "Editor tools",
    description:
      "Tools that bring useful context directly into the development environment.",
  },
  {
    id: "drupal",
    title: "Drupal Modules",
    description: "Text generation inside Drupal's content editor.",
  },
  {
    id: "d-language",
    title: "D Language",
    description:
      "Web servers, source analysis, compiler fundamentals and documentation in D.",
  },
  {
    id: "open-source",
    title: "Open-source contributions & systems",
    description:
      "Shared engineering work across compilers, networking, AI, retrieval, documentation, and developer infrastructure.",
  },
] as const;
export type ProjectCategory = (typeof projectCategories)[number]["id"];
const browser = new Set([
  "signalizeai",
  "pagefold",
  "stowlane",
  "glasswing",
  "bellrope",
  "cribsheet",
]);
const systems = new Set(["drupal-chatbot", "dent-docs"]);
const agentpostmortem = new Set([
  "agentpostmortem",
  "agent-suite",
  ...agentpostmortemTools.map((tool) => tool.id),
]);
export function categoryFor(
  project: (typeof siteConfig.projects)[number],
): ProjectCategory {
  if (agentpostmortem.has(project.id)) return "agentpostmortem";
  if (project.section === "Drupal") return "drupal";
  if (project.section === "D Language") return "d-language";
  if (project.section === "Products") return "products";
  if (project.section === "Games") return "games";
  if (project.section === "Productivity Apps") return "productivity-apps";
  if (project.section === "Solana & Web3") return "web3";
  if (browser.has(project.id)) return "browser-extensions";
  if (project.id === "water") return "editor-tools";
  if (systems.has(project.id)) return "open-source";
  if (
    /npmjs.com|pypi.org/.test(project.liveUrl) ||
    ["distro-skills", "casebook-mcp"].includes(project.id)
  )
    return "packages";
  if (project.section === "Frontend & Design")
    return project.id === "frontend-showcase" ? "websites" : "experiments";
  return "apps";
}
