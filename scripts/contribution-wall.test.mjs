import test from "node:test";
import assert from "node:assert/strict";
import { renderContributionWall } from "./contribution-wall.mjs";

test("calendar retains recorded counts and levels and excludes future days", () => {
  const calendar = {
    weeks: [
      {
        contributionDays: [
          {
            date: "2026-01-01",
            weekday: 4,
            contributionCount: 1,
            contributionLevel: "FIRST_QUARTILE",
          },
          {
            date: "2026-01-02",
            weekday: 5,
            contributionCount: 43,
            contributionLevel: "FOURTH_QUARTILE",
          },
          {
            date: "2026-01-03",
            weekday: 6,
            contributionCount: 0,
            contributionLevel: "NONE",
          },
        ],
      },
    ],
  };
  const svg = renderContributionWall(calendar, 2026, "2026-01-02");
  assert.match(svg, /1 contribution on 2026-01-01/);
  assert.match(svg, /43 contributions on 2026-01-02/);
  assert.match(svg, /class="l1" fill="#9be9a8"/);
  assert.match(svg, /class="l4" fill="#216e39"/);
  assert.doesNotMatch(svg, /data-date="2026-01-03"/);
  assert.match(svg, />Jan<\/text>/);
});
