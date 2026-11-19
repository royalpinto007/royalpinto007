"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { ContributionWall } from "./ContributionWall";

type YearTotal = { year: number; total: number };

/**
 * The year inside "contributions in 2026": a button that opens a styled listbox
 * (the native select's menu cannot be styled). Keyboard: arrows, Home/End,
 * Enter/Space to choose, Escape or Tab to close.
 */
function YearPicker({
  years,
  value,
  onChange,
}: {
  years: YearTotal[];
  value: number;
  onChange: (year: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = Math.max(
    0,
    years.findIndex((y) => y.year === value),
  );
  const [active, setActive] = useState(selected);
  const root = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const show = () => {
    setActive(selected);
    setOpen(true);
  };
  const choose = (index: number) => {
    onChange(years[index].year);
    setOpen(false);
    button.current?.focus();
  };
  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = years.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => {
        setOpen(false);
        button.current?.focus();
      },
    };
    if (event.key === "Tab") setOpen(false);
    else if (keys[event.key]) {
      event.preventDefault();
      keys[event.key]();
    }
  };

  return (
    <span className="year-picker" ref={root} data-open={open}>
      <button
        ref={button}
        type="button"
        className="year-picker-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`Year ${value}, choose another year`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show();
          }
        }}
      >
        {value}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          className="year-picker-list"
          role="listbox"
          tabIndex={-1}
          aria-label="Choose a year"
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKey}
        >
          {years.map((y, index) => (
            <li
              key={y.year}
              id={`${id}-${index}`}
              role="option"
              aria-selected={y.year === value}
              data-active={index === active}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span className="year-picker-year">{y.year}</span>
              <Check size={15} aria-hidden="true" />
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

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
          <span>
            contributions in{" "}
            <YearPicker years={years} value={year} onChange={setYear} />
          </span>
        </p>
        <a
          className="go-link"
          href={profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="go-link-label">
            <span className="link-long">View </span>GitHub
            <span className="link-long"> profile</span>
          </span>
          <span className="go-link-icon" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </a>
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
