import "./calendar.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectsScenery } from "@/components/ProjectsScenery";

export const metadata: Metadata = {
  title: "Calendar",
  alternates: { canonical: "/calendar" },
  description: "Royal Simpson Pinto’s calendar. More details coming soon.",
};

export default function CalendarPage() {
  return (
    <div className="calendar-stage">
      <ProjectsScenery scene="observatory" priority />
      <div className="portfolio-shell calendar-page">
        <header className="calendar-heading" data-motion-intro>
          <p className="chapter-index">Coming soon</p>
          <h1>Calendar.</h1>
          <p>Availability and scheduling details will be added here.</p>
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
            <h2 id="calendar-preview-title">
              Scheduling
              <br />
              details soon.
            </h2>
            <p>No events are published yet.</p>
            <Link href="/projects" className="quiet-link" prefetch={false}>
              Explore the work <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
