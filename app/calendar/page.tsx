import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Calendar",
  alternates: { canonical: "/calendar" },
  description: "Royal Simpson Pinto’s calendar. More details coming soon.",
};

export default function CalendarPage() {
  return (
    <div className="portfolio-shell calendar-page">
      <header className="calendar-heading" data-motion-intro>
        <p className="chapter-index">A little space for what’s next</p>
        <h1>
          On the <span>calendar.</span>
        </h1>
        <p>This chapter is taking shape. More details soon.</p>
      </header>
      <section
        className="calendar-preview"
        aria-labelledby="calendar-preview-title"
      >
        <div className="calendar-sculpture" aria-hidden="true">
          <div className="calendar-shadow" />
          <div className="calendar-sheet calendar-sheet-back" />
          <div className="calendar-sheet">
            <div className="calendar-bindings">
              <i />
              <i />
            </div>
            <div className="calendar-sheet-heading">
              <span />
              <i />
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 28 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <div className="calendar-corner" />
        </div>
        <div className="calendar-preview-copy">
          <span className="chapter-index">Coming soon</span>
          <h2 id="calendar-preview-title">
            Good things
            <br />
            take a little planning.
          </h2>
          <p>Nothing scheduled here just yet.</p>
          <Link href="/projects" className="quiet-link" prefetch={false}>
            Explore the work <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
