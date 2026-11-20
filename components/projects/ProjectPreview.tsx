import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Gamepad2 } from "lucide-react";
import { caseStudyFor } from "@/lib/data/case-studies";
import type { PreviewProject } from "@/lib/data/project-collections";

export function ProjectPreview({
  project,
  detailed = false,
}: {
  project: PreviewProject;
  detailed?: boolean;
}) {
  const Heading = detailed ? "h3" : "h4";
  const hasSource = !!project.source && project.source !== project.href;
  const isGame = [
    "bumblecrate",
    "megoblin",
    "jollybound",
    "revlap",
    "tablewink",
    "hushmallow",
  ].includes(project.id);
  // The caption already says "Preview only"; the window bar names what is shown.
  const target = !project.href
    ? isGame
      ? "Game preview"
      : "Preview"
    : /npmjs.com|pypi.org/.test(project.href)
      ? "Package"
      : project.href.includes("github.com")
        ? "Source"
        : "Website";
  const content = (
    <>
      <div className="project-window">
        <div className="project-window-bar" aria-hidden="true">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            {project.image
              ? project.previewKind === "design"
                ? "Design reference"
                : project.previewKind === "workflow"
                  ? "Workflow preview"
                  : target
              : "Project overview"}
          </span>
          {project.href && <ArrowUpRight size={14} />}
        </div>
        <div
          className={`project-window-image ${project.previewKind === "workflow" ? "is-workflow" : ""}`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt=""
              width={960}
              height={640}
              sizes="(max-width: 560px) 45vw, (max-width: 1100px) 40vw, 24vw"
            />
          ) : (
            <div className="project-overview" aria-label="Project illustration">
              {isGame ? (
                <Gamepad2 size={44} strokeWidth={1.3} />
              ) : (
                <Code2 size={44} strokeWidth={1.3} />
              )}
              <span className="overview-monogram" aria-hidden="true">
                {project.name.replace(/[^a-zA-Z]/g, "").slice(0, 2)}
              </span>
              <span className="overview-stack">
                {project.tech.slice(0, 3).join(" / ")}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="project-preview-caption">
        <div>
          <Heading>
            {project.name}
            {project.href && (
              <ArrowUpRight className="caption-arrow" size={17} aria-hidden="true" />
            )}
          </Heading>
          <p>{project.kind}</p>
        </div>
        {!project.href && <span className="preview-only">Preview only</span>}
      </div>
    </>
  );
  return (
    <article
      className="project-preview"
      data-project-id={project.id}
      id={`project-${project.id}`}
    >
      {project.href ? (
        <a
          className="project-preview-link"
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <div className="project-preview-static">{content}</div>
      )}
      {(caseStudyFor(project.id) || (detailed && hasSource)) && (
        <div className={`project-card-actions ${detailed ? "is-row" : ""}`}>
          {caseStudyFor(project.id) && (
            <Link
              className="project-case-study"
              href={`/case-studies/${project.id}`}
              target="_blank"
              rel="noopener"
            >
              Read the case study <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
          {detailed && hasSource && (
            <a
              className="project-card-source"
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
      {detailed && (
        <div className="project-preview-details">
          <p>{project.description}</p>
        </div>
      )}
    </article>
  );
}
