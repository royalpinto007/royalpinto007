import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectsScenery } from "@/components/ProjectsScenery";
import "./not-found.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Branded 404 for the static export, in the same coastal world as the site. */
export default function NotFound() {
  return (
    <div className="not-found-stage">
      <ProjectsScenery scene="cinema" priority />
      <div className="portfolio-shell not-found">
        <p className="not-found-code">404</p>
        <h1>
          Lost at <span>sea.</span>
        </h1>
        <p className="not-found-copy">
          This page doesn’t exist, or it moved. The work is still here.
        </p>
        <div className="not-found-actions">
          <Link
            className="go-link go-link-surface"
            data-direction="forward"
            href="/"
            prefetch={false}
          >
            <span className="go-link-label">Back home</span>
            <span className="go-link-icon" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
          <Link
            className="go-link go-link-surface"
            data-direction="forward"
            href="/projects"
            prefetch={false}
          >
            <span className="go-link-label">Browse projects</span>
            <span className="go-link-icon" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
