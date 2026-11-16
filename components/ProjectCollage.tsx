import { ArrowUpRight } from "lucide-react";
import type { PreviewGroup } from "@/data/project-collections";
import { ProjectPreview } from "./ProjectPreview";
import "./project-collections.css";

export function ProjectCollage({
  group,
  full = false,
  single = false,
}: {
  group: PreviewGroup;
  full?: boolean;
  single?: boolean;
}) {
  const items = full ? group.items : group.items.slice(0, 4);
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
          <a className="collection-view-all" href={group.href}>
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
      {!full && group.items.length > items.length && (
        <p className="collage-more">
          +{group.items.length - items.length} more in this group
        </p>
      )}
    </div>
  );
}
