// GitHub levels remain untouched; only their presentation changes.
export const contributionColors = [
  "#ebedf0",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];
const levels = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export function renderContributionWall(
  calendar,
  year,
  through = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
) {
  const weeks = calendar.weeks
    .map((week) => ({
      contributionDays: week.contributionDays.filter(
        (day) => day.date <= through,
      ),
    }))
    .filter((week) => week.contributionDays.length);
  const months = new Set();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let cells = "",
    labels = "";
  weeks.forEach((week, i) => {
    const month = Number(week.contributionDays[0].date.slice(5, 7)) - 1;
    if (!months.has(month)) {
      labels += `<text x="${4 + i * 14}" y="12">${monthNames[month]}</text>`;
      months.add(month);
    }
    let column = "";
    week.contributionDays.forEach((day) => {
      const level = levels[day.contributionLevel];
      const count = day.contributionCount;
      const title = `${count} contribution${count === 1 ? "" : "s"} on ${day.date}`;
      column += `<rect x="${4 + i * 14}" y="${24 + day.weekday * 14}" width="11" height="11" rx="2" class="l${level}" fill="${contributionColors[level]}" data-date="${day.date}" data-count="${count}" data-level="${level}"><title>${title}</title></rect>`;
    });
    cells += `<g class="contribution-week" style="--week:${i}">${column}</g>`;
  });
  const width = 4 + weeks.length * 14;
  return `<svg viewBox="0 0 ${width} 119" width="100%" role="img" aria-label="Royal Simpson Pinto's GitHub contributions in ${year}, through ${through}" xmlns="http://www.w3.org/2000/svg" class="wall-svg"><g fill="#57606a" font-family="system-ui,sans-serif" font-size="10">${labels}</g>${cells}</svg>`;
}
