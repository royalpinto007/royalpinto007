import { CoastalHorizon } from "./CoastalHorizon";

/** Choose a section's own artwork explicitly, rather than repeating a default. */
export function WorldScene({
  kind,
  priority = false,
}: {
  kind: "studio" | "engine" | "play" | "arcade" | "telephone" | "horizon";
  priority?: boolean;
}) {
  const asset =
    kind === "studio" || kind === "engine"
      ? `${kind}-island`
      : kind === "play"
        ? "liquid-chrome"
        : kind;
  return (
    <div className={`world-scene world-${kind}`} aria-hidden="true">
      {kind === "horizon" ? (
        <CoastalHorizon />
      ) : (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={`/scene/${asset}-mobile.webp`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/scene/${asset}.webp`}
            width={1200}
            height={kind === "play" ? 960 : 800}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
          />
        </picture>
      )}
      <i className="world-glint" />
      <i className="world-glint" />
      <i className="world-glint" />
    </div>
  );
}
