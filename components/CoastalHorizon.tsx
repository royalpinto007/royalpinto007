/** An open closing scene with separate boat, water and reflected-light layers. */
export function CoastalHorizon() {
  return (
    <div className="horizon-stage">
      <div className="horizon-sun" />
      <div className="horizon-water" />
      <div className="horizon-reflection" />
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/scene/sailboat-mobile.webp"
        />
        <img
          className="horizon-boat"
          src="/scene/sailboat.webp"
          width={1200}
          height={800}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </picture>
      <div className="horizon-shore" />
    </div>
  );
}
