import { siteConfig } from "./site";

export const projectCategories = [
  {
    id: "apps",
    title: "Apps",
    description:
      "Web and mobile products, from AI workspaces to offline-first tools.",
  },
  {
    id: "browser-extensions",
    title: "Browser extensions",
    description:
      "Chrome and Firefox tools for research, reading, accessibility, and everyday browser work.",
  },
  {
    id: "websites",
    title: "Websites",
    description:
      "Eighteen independent website concepts, each with its own visual direction.",
  },
  {
    id: "experiments",
    title: "Interactive experiments",
    description:
      "Twelve tactile browser experiences exploring physics, shaders, motion, and sound.",
  },
  {
    id: "packages",
    title: "Packages & developer tools",
    description:
      "Installable libraries, command-line utilities, MCP integrations, and reusable skills.",
  },
  {
    id: "editor-tools",
    title: "Editor tools",
    description:
      "Tools that bring useful context directly into the development environment.",
  },
  {
    id: "open-source",
    title: "Open-source contributions & systems",
    description:
      "Compiler and networking contributions, retrieval systems, and engineering infrastructure.",
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
const systems = new Set(["drupal-chatbot", "dent-docs", "tenantq", "vaultrag"]);
export function categoryFor(
  project: (typeof siteConfig.projects)[number],
): ProjectCategory {
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
