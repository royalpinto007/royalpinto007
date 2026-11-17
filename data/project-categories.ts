import { siteConfig } from "./site";
import agentpostmortemTools from "./agentpostmortem.json";

export const projectCategories = [
  {
    id: "experiments",
    title: "Interactive Graphics",
    description:
      "3D scenes, physics, generative visuals and playful interactions. Open an experiment and play.",
  },
  {
    id: "games",
    title: "Games",
    description:
      "Six game projects, from delivery challenges and football to shared-device board games.",
  },
  {
    id: "apps",
    title: "Apps & products",
    description:
      "Software for real workflows. AI research, offline messaging, creative tools and everyday apps.",
  },
  {
    id: "websites",
    title: "Designs",
    description:
      "Studios, products, places and storefronts. Nineteen distinct website concepts.",
  },
  {
    id: "web3",
    title: "Solana & Web3",
    description:
      "Open-source tools for token permissions, transactions, payments and on-chain receipts.",
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
    id: "open-source",
    title: "Open source and systems",
    description:
      "Documentation, networking, modules and compilers. Code and knowledge built in the open.",
  },
] as const;
export type ProjectCategory = (typeof projectCategories)[number]["id"];
const browser = new Set([
  "pagefold",
  "stowlane",
  "glasswing",
  "bellrope",
  "cribsheet",
]);
const systems = new Set([
  "d-errors-docs",
  "dent-docs",
  "text-generation",
  "drupal-chatbot",
]);
export const collectionAliases: Record<string, ProjectCategory> = {
  "productivity-apps": "apps",
  products: "apps",
  "editor-tools": "apps",
  "browser-extensions": "apps",
  "d-language": "open-source",
  drupal: "open-source",
};
const agentpostmortem = new Set([
  "agentpostmortem",
  "agent-suite",
  ...agentpostmortemTools.map((tool) => tool.id),
]);
export function categoryFor(
  project: (typeof siteConfig.projects)[number],
): ProjectCategory {
  if (agentpostmortem.has(project.id)) return "agentpostmortem";
  if (systems.has(project.id)) return "open-source";
  if (project.section === "D Language") return "open-source";
  if (project.section === "Products") return "apps";
  if (project.section === "Games") return "games";
  if (project.section === "Productivity Apps") return "apps";
  if (project.section === "Solana & Web3") return "web3";
  if (browser.has(project.id)) return "apps";
  if (project.id === "water") return "apps";
  if (
    /npmjs.com|pypi.org/.test(project.liveUrl) ||
    ["distro-skills", "casebook-mcp"].includes(project.id)
  )
    return "packages";
  if (project.section === "Frontend & Design")
    return project.id === "frontend-showcase" ? "websites" : "experiments";
  return "apps";
}
