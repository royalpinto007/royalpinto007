// Regenerate the GitHub contributions wall SVG + the count in app/page.tsx
// from live GitHub data. Run by .github/workflows/refresh-contributions.yml.
// Requires GITHUB_TOKEN in the environment (public contribution data only).
import { readFileSync, writeFileSync } from "node:fs";

const YEAR = 2026;
const USER = "royalpinto007";
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("GITHUB_TOKEN is required");
  process.exit(1);
}

const query = `query($user:String!,$from:DateTime!,$to:DateTime!){
  user(login:$user){
    contributionsCollection(from:$from,to:$to){
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ weekday contributionLevel } }
      }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": USER,
  },
  body: JSON.stringify({
    query,
    variables: {
      user: USER,
      from: `${YEAR}-01-01T00:00:00Z`,
      to: `${YEAR}-12-31T23:59:59Z`,
    },
  }),
});

const json = await res.json();
if (json.errors) {
  console.error(JSON.stringify(json.errors));
  process.exit(1);
}

const cal = json.data.user.contributionsCollection.contributionCalendar;
const color = {
  NONE: "#1e1c19",
  FIRST_QUARTILE: "#0e4429",
  SECOND_QUARTILE: "#006d32",
  THIRD_QUARTILE: "#26a641",
  FOURTH_QUARTILE: "#39d353",
};

let rects = "";
cal.weeks.forEach((w, i) => {
  w.contributionDays.forEach((d) => {
    rects += `<rect x="${i * 14}" y="${d.weekday * 14}" width="11" height="11" rx="2" fill="${color[d.contributionLevel]}"/>`;
  });
});

const svg = `<svg viewBox="0 0 739 95" width="100%" role="img" aria-label="Royal Pinto GitHub contributions in ${YEAR}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${rects}</svg>`;
writeFileSync(`public/wall${YEAR}.svg`, svg);

const total = cal.totalContributions.toLocaleString("en-US");
const page = "app/page.tsx";
let src = readFileSync(page, "utf8");
src = src.replace(
  new RegExp(`[\\d,]+ contributions in ${YEAR}`),
  `${total} contributions in ${YEAR}`,
);
writeFileSync(page, src);

console.log(`wall${YEAR}.svg updated, total=${total}`);
