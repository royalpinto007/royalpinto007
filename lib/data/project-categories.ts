import { siteConfig } from "./site";
import agentpostmortemTools from "@/content/agentpostmortem.json";
import categories from "@/content/categories.json";

// Display order on Projects comes from content/categories.json.
export const projectCategories = categories;
export type ProjectCategory = string;
const browser = new Set([
  "pagefold",
  "stowlane",
  "glasswing",
  "bellrope",
  "cribsheet",
]);
const systems = new Set([
  "dmd-contributions",
  "d-errors-docs",
  "dent-docs",
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
// AgentPostmortem's earlier tools are archived now that it is one product (the benchmark),
// so they belong to no collection.
const archivedAgentPostmortem = new Set([
  "agent-suite",
  ...agentpostmortemTools.map((tool) => tool.id),
]);
const resources = new Set(
  agentpostmortemTools
    .filter((tool) => tool.group === "resources")
    .map((tool) => tool.id),
);
export function categoryFor(
  project: (typeof siteConfig.projects)[number],
): ProjectCategory | null {
  if (resources.has(project.id)) return "resources";
  if (archivedAgentPostmortem.has(project.id)) return null;
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
