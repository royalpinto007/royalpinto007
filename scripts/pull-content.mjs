// Downloads the site's content (profile, projects, categories, previews) from R2 into content/.
// Runs before `npm run dev` and `npm run build`. Set CONTENT_BASE to use your own bucket.
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.CONTENT_BASE ?? "https://assets.royalpinto007.com/content";
const files = [
  "profile",
  "site",
  "categories",
  "agentpostmortem",
  "project-previews",
  "work-images",
  "facetworks",
  "facetworks-collections",
  "facetworks-groups",
  "contributions",
  "case-studies",
];

await mkdir("content", { recursive: true });
await Promise.all(
  files.map(async (name) => {
    const response = await fetch(`${base}/${name}.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`${name}.json: HTTP ${response.status}`);
    const data = await response.json();
    await writeFile(`content/${name}.json`, JSON.stringify(data, null, 2) + "\n");
  }),
);
console.log(`Pulled ${files.length} content files from ${base}`);
