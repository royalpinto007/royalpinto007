import { CoastalHorizon } from "./CoastalHorizon";

/** Choose a section's own artwork explicitly, rather than repeating a default. */
export function WorldScene({
  kind,
}: {
  kind: "studio" | "engine" | "play" | "arcade" | "telephone" | "horizon";
}) {
  const asset =
    kind === "studio" || kind === "engine" ? `${kind}-island` : kind;
  return (
    <div className={`world-scene world-${kind}`} aria-hidden="true">
      {kind === "horizon" ? (
        <CoastalHorizon />
      ) : kind === "play" ? (
        <div className="chrome-stage">
          <div className="chrome-ring" />
          <div className="chrome-sphere" />
          <div className="chrome-sphere chrome-satellite" />
          <div className="glass-prism" />
          <div className="chrome-floor" />
        </div>
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
            height={800}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </picture>
      )}
      <i className="world-glint" />
      <i className="world-glint" />
      <i className="world-glint" />
    </div>
  );
}
