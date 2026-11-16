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
    title: "Apps",
    description:
      "Web, mobile and desktop apps for creating, planning, money and offline communication.",
  },
  {
    id: "websites",
    title: "Designs",
    description:
      "Studios, products, places and storefronts. Nineteen distinct website concepts.",
  },
  {
    id: "products",
    title: "Products",
    description:
      "AashiNyra, SignalizeAI and Stoccoin. Products spanning shopping, account research and markets.",
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
    id: "editor-tools",
    title: "Editor tools",
    description:
      "Tools that bring useful context directly into the development environment.",
  },
  {
    id: "d-language",
    title: "D Language",
    description: "Web servers, source analysis and compiler fundamentals in D.",
  },
  {
    id: "open-source",
    title: "Open-source contributions & systems",
    description:
      "Shared engineering work across compilers, networking, AI, retrieval, documentation, and developer infrastructure.",
  },
  {
    id: "browser-extensions",
    title: "Browser extensions",
    description:
      "Chrome and Firefox tools for research, reading, accessibility, and everyday browser work.",
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
  if (project.section === "D Language") return "d-language";
  if (project.section === "Products") return "products";
  if (project.section === "Games") return "games";
  if (project.section === "Productivity Apps") return "apps";
  if (project.section === "Solana & Web3") return "web3";
  if (browser.has(project.id)) return "browser-extensions";
  if (project.id === "water") return "editor-tools";
  if (
    /npmjs.com|pypi.org/.test(project.liveUrl) ||
    ["distro-skills", "casebook-mcp"].includes(project.id)
  )
    return "packages";
  if (project.section === "Frontend & Design")
    return project.id === "frontend-showcase" ? "websites" : "experiments";
  return "apps";
}
