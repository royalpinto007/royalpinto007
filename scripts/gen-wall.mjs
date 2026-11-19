// Regenerate the GitHub contribution walls (one SVG per year) and their totals
// from live GitHub data. Run by .github/workflows/refresh-contributions.yml.
// Requires GITHUB_TOKEN in the environment (public contribution data only).
import { writeFileSync } from "node:fs";
import { renderContributionWall } from "./contribution-wall.mjs";

const USER = "royalpinto007";
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("GITHUB_TOKEN is required");
  process.exit(1);
}

async function graphql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USER,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors));
    process.exit(1);
  }
  return json.data;
}

const { user } = await graphql(
  `query($user:String!){ user(login:$user){ contributionsCollection{ contributionYears } } }`,
  { user: USER },
);
const years = [...user.contributionsCollection.contributionYears].sort(
  (a, b) => b - a,
);

const calendarQuery = `query($user:String!,$from:DateTime!,$to:DateTime!){
  user(login:$user){
    contributionsCollection(from:$from,to:$to){
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ date weekday contributionLevel contributionCount } }
      }
    }
  }
}`;

const totals = [];
for (const year of years) {
  const data = await graphql(calendarQuery, {
    user: USER,
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  });
  const cal = data.user.contributionsCollection.contributionCalendar;
  writeFileSync(`public/wall${year}.svg`, renderContributionWall(cal, year));
  totals.push({ year, total: cal.totalContributions });
  console.log(`${year}: ${cal.totalContributions} contributions`);
}

writeFileSync(
  "data/contributions.json",
  JSON.stringify({ years: totals }, null, 2) + "\n",
);
