import { existsSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "./site";
import { projectCategories, categoryFor } from "./project-categories";
import { facetworksGroups } from "./facetworks-groups";
import tools from "./agentpostmortem.json";
import projectPreviews from "./project-previews.json";
const previews: Record<string, { image: string; kind: string }> =
  projectPreviews;

export type PreviewProject = {
  id: string;
  name: string;
  kind: string;
  description: string;
  image?: string;
  href?: string;
  source?: string;
  tech: readonly string[];
  previewKind?: "screenshot" | "workflow" | "design";
};
export type PreviewGroup = {
  id: string;
  title: string;
  items: PreviewProject[];
  href: string;
};
export type ProjectCollection = {
  id: string;
  title: string;
  description: string;
  href: string;
  external: boolean;
  groups: PreviewGroup[];
  count: number;
};

const destination = (url: string | undefined) =>
  url && url !== "#" ? url : undefined;
const apGroups = [
  { id: "agents", title: "Apps & integrations" },
  { id: "tooling", title: "CLI tools & libraries" },
  { id: "resources", title: "Directories & skills" },
];

export const projectCollections: ProjectCollection[] =
  projectCategories.flatMap((category) => {
    let groups: PreviewGroup[];
    let external = false;
    let href = `/projects/${category.id}`;
    if (category.id === "websites" || category.id === "experiments") {
      const collection = category.id === "websites" ? "designs" : "graphics";
      href = `https://royalpinto007.com/facetworks/${collection}`;
      external = true;
      groups = facetworksGroups(collection).map((group) => ({
        id: group.id,
        title: group.title,
        href: `${href}#${group.id}`,
        items: group.projects.map((p) => ({
          id: p.slug,
          name: p.name,
          kind: p.genre,
          description: p.note,
          image: `/designs/${p.slug}.webp`,
          href: p.url,
          tech: p.stack,
        })),
      }));
    } else if (category.id === "agentpostmortem") {
      href = "https://www.agentpostmortem.com/tools";
      external = true;
      groups = apGroups.map((group) => ({
        ...group,
        href: `${href}#${group.id}`,
        items: tools
          .filter((p) => p.group === group.id)
          .map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            href: p.href,
            kind: p.output,
            description: p.description,
            tech: [],
            previewKind: p.preview === "screenshot" ? "screenshot" : "workflow",
          })),
      }));
    } else {
      const items: PreviewProject[] = siteConfig.projects
        .filter((p) => categoryFor(p) === category.id)
        .sort((a, b) => {
          if (category.id !== "open-source") return 0;
          const order = [
            "d-errors-docs",
            "dent-docs",
            "text-generation",
            "drupal-chatbot",
          ];
          return order.indexOf(a.id) - order.indexOf(b.id);
        })
        .map((p) => ({
          id: p.id,
          name: p.name,
          kind: p.category,
          description: p.description.replaceAll("—", ","),
          previewKind:
            previews[p.id]?.kind === "workflow"
              ? "workflow"
              : previews[p.id]?.kind === "design"
                ? "design"
                : "screenshot",
          image:
            previews[p.id]?.image ??
            (existsSync(path.join(process.cwd(), "public/work", p.id + ".webp"))
              ? `/work/${p.id}.webp`
              : undefined),
          href: destination(p.liveUrl) ?? destination(p.githubUrl),
          source: destination(p.githubUrl),
          tech: p.tech,
        }));
      if (!items.length) return [];
      const splits =
        category.id === "web3"
          ? [
              {
                id: "token-permissions",
                title: "Token permissions",
                ids: [
                  "delegate-inspector",
                  "hookview",
                  "solana-authority-inspector",
                ],
              },
              {
                id: "payments-transactions",
                title: "Payments & transactions",
                ids: ["ack", "paylint", "settled", "txray", "v1check"],
              },
            ]
          : [
              {
                id: "projects",
                title: category.title,
                ids: items.map((p) => p.id),
              },
            ];
      groups = splits.map((group) => ({
        id: group.id,
        title: group.title,
        href: `${href}#${group.id}`,
        items: group.ids.map((id) => {
          const project = items.find((p) => p.id === id);
          if (!project)
            throw new Error(`Unknown ${category.id} project: ${id}`);
          return project;
        }),
      }));
    }
    const count = groups.reduce(
      (total, group) => total + group.items.length,
      0,
    );
    return [{ ...category, href, external, groups, count }];
  });
