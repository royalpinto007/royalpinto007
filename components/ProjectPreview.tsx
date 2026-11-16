import Image from "next/image";
import { ArrowUpRight, Code2, Gamepad2 } from "lucide-react";
import type { PreviewProject } from "@/data/project-collections";

export function ProjectPreview({
  project,
  detailed = false,
}: {
  project: PreviewProject;
  detailed?: boolean;
}) {
  const Heading = detailed ? "h3" : "h4";
  const isGame = [
    "bumblecrate",
    "megoblin",
    "jollybound",
    "revlap",
    "tablewink",
    "hushmallow",
  ].includes(project.id);
  const target = !project.href
    ? "Preview only"
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
          <ArrowUpRight size={14} />
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
          <Heading>{project.name}</Heading>
          <p>{project.kind}</p>
        </div>
        {project.href ? (
          <ArrowUpRight size={18} aria-hidden="true" />
        ) : (
          <span className="preview-only">Preview only</span>
        )}
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
      {detailed && (
        <div className="project-preview-details">
          <p>{project.description}</p>
          {project.source && project.source !== project.href && (
            <a href={project.source} target="_blank" rel="noopener noreferrer">
              Source <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
