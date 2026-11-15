/** Original scene illustrations; decorative, separate from real architecture. */
export function WorldScene({
  kind = "studio",
}: {
  kind?: "studio" | "engine" | "play";
}) {
  return (
    <div className={`world-scene world-${kind}`} aria-hidden="true">
      {kind === "play" ? (
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
            srcSet={`/scene/${kind}-island-mobile.webp`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/scene/${kind}-island.webp`}
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
