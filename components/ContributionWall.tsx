"use client";

import { useEffect, useRef, useState } from "react";

/** Keep the calendar out of the initial HTML and load its unchanged SVG near view. */
export function ContributionWall({ year }: { year: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [moreLeft, setMoreLeft] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let visible = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      setActive(visible && !document.hidden && !preference.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const abort = new AbortController();
    let started = false;
    const load = async () => {
      if (started) return;
      started = true;
      setFailed(false);
      try {
        const response = await fetch(`/wall${year}.svg`, { signal: abort.signal });
        if (!response.ok) throw new Error("Calendar unavailable");
        const body = await response.text();
        if (!body.startsWith("<svg") || !body.includes('class="wall-svg"'))
          throw new Error("Unexpected calendar response");
        if (!abort.signal.aborted) setSvg(body);
      } catch {
        if (!abort.signal.aborted) setFailed(true);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      abort.abort();
    };
  }, [attempt, year]);
  // open on the latest months; earlier ones are a swipe to the left
  useEffect(() => {
    const element = host.current;
    if (!element || !svg) return;
    element.scrollLeft = element.scrollWidth;
    const update = () => setMoreLeft(element.scrollLeft > 8);
    update();
    element.addEventListener("scroll", update, { passive: true });
    return () => element.removeEventListener("scroll", update);
  }, [svg]);
  return (
    <div
      ref={host}
      className="contribution-wall"
      data-active={active}
      data-more-left={moreLeft}
      role="region"
      aria-label={`GitHub contribution calendar for ${year}, scroll horizontally to explore the year`}
      tabIndex={0}
    >
      {svg ? (
        <div
          className="calendar-art"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="calendar-art calendar-pending" aria-busy={!failed}>
          <p className="calendar-status" role="status">
            {failed
              ? "The calendar could not load."
              : "Loading contribution calendar…"}
          </p>
          {failed && (
            <button type="button" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          )}
          <a className="calendar-status" href={`/wall${year}.svg`}>
            View the contribution calendar ↗
          </a>
        </div>
      )}
      <noscript>
        <a
          href={`/wall${year}.svg`}
          aria-label="Open the contribution calendar with daily dates and counts"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="calendar-static"
            src={`/wall${year}.svg`}
            alt={`Royal Simpson Pinto’s ${year} GitHub contribution calendar. Open the linked SVG for dates and daily counts.`}
            width="662"
            height="119"
            loading="lazy"
          />
        </a>
      </noscript>
    </div>
  );
}
