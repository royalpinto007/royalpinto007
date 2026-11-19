"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContributionWall } from "./ContributionWall";

type YearTotal = { year: number; total: number };

/** The GitHub calendar with a year picker; opens on the latest year and months. */
export function ContributionCalendar({
  years,
  profile,
}: {
  years: YearTotal[];
  profile: string;
}) {
  const [year, setYear] = useState(years[0].year);
  const total = years.find((y) => y.year === year)?.total ?? 0;
  return (
    <div className="contribution-block">
      <div className="contribution-head">
        <p className="contribution-total">
          <strong>{total.toLocaleString("en-US")}</strong>
          <span>contributions in {year}</span>
        </p>
        <a
          className="go-link"
          href={profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="go-link-label">View GitHub profile</span>
          <span className="go-link-icon" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </a>
      </div>
      <div className="contribution-years" role="group" aria-label="Choose a year">
        {years.map((y) => (
          <button
            key={y.year}
            type="button"
            aria-pressed={y.year === year}
            onClick={() => setYear(y.year)}
          >
            {y.year}
          </button>
        ))}
      </div>
      <div className="contribution-calendar">
        <ContributionWall key={year} year={year} />
        <div className="contribution-legend">
          <span>
            Every square is a day on GitHub.
            <small className="calendar-scroll-hint">
              Latest first. Swipe left for earlier months.
            </small>
          </span>
          <div aria-label="Contribution intensity from fewer to more">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} data-level={level} aria-hidden="true" />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
