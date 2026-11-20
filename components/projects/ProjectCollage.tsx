import { ArrowUpRight } from "lucide-react";
import { ShowMore } from "@/components/projects/ShowMore";
import type { PreviewGroup } from "@/lib/data/project-collections";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import "./project-collections.css";

export function ProjectCollage({
  group,
  full = false,
  single = false,
  previewLimit = 4,
  expandable = false,
}: {
  group: PreviewGroup;
  full?: boolean;
  single?: boolean;
  previewLimit?: number;
  /** Show the rest below a "Show more" toggle instead of a "+N more" note. */
  expandable?: boolean;
}) {
  const items = full ? group.items : group.items.slice(0, previewLimit);
  const Heading = full ? "h2" : "h3";
  return (
    <div
      className={`project-collage ${single ? "collage-single" : ""} ${full ? "collage-full" : ""}`}
      data-project-group={group.id}
      id={full ? group.id : undefined}
    >
      <header className="collage-group-heading">
        <div>
          <Heading>{group.title}</Heading>
          <span>
            {group.items.length}{" "}
            {group.items.length === 1 ? "project" : "projects"}
          </span>
        </div>
        {!full && !single && (
          <a
            className="collection-view-all"
            href={group.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            View all <span className="sr-only">{group.title}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        )}
      </header>
      <div className="collage-screens">
        {items.map((project) => (
          <ProjectPreview key={project.id} project={project} detailed={full} />
        ))}
      </div>
      {!full && expandable && group.items.length > items.length && (
        <ShowMore count={group.items.length - items.length}>
          <div className="collage-screens">
            {group.items.slice(items.length).map((project) => (
              <ProjectPreview key={project.id} project={project} />
            ))}
          </div>
        </ShowMore>
      )}
      {!full && !expandable && group.items.length > items.length && (
        <p className="collage-more">
          +{group.items.length - items.length} more in this group
        </p>
      )}
    </div>
  );
}
