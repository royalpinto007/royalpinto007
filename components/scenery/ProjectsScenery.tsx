import "./projects-scenery.css";

/** Shared coastal plates use native image loading without a 3D runtime. */
export function ProjectsScenery({
  scene,
  priority = false,
}: {
  scene:
    | "tidal"
    | "observatory"
    | "marina"
    | "conservatory"
    | "atrium"
    | "cinema"
    | "pavilion";
  priority?: boolean;
}) {
  return (
    <div className="projects-scenery" aria-hidden="true">
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={`https://assets.royalpinto007.com/scene/environments/${scene}-mobile.webp`}
        />
        <img
          src={`https://assets.royalpinto007.com/scene/environments/${scene}.webp`}
          alt=""
          width={1800}
          height={1000}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
        />
      </picture>
      <div className="projects-scene-light" />
    </div>
  );
}
