/** Decorative movement stays separate from portrait pixels and readable content. */
export function CoastalAtmosphere({
  kind = "water",
}: {
  kind?: "water" | "petals" | "glass" | "tidal";
}) {
  return (
    <div className={`coastal-atmosphere atmosphere-${kind}`} aria-hidden="true">
      {kind === "water" && (
        <>
          <svg className="coast-flight" viewBox="0 0 140 50" fill="none">
            <g stroke="#244e6a" strokeWidth="2" strokeLinecap="round">
              <path d="M6 20Q15 9 24 20Q33 9 42 20" />
              <path d="M68 32Q74 24 81 32Q88 24 95 32" />
              <path d="M110 12Q115 6 121 12Q127 6 133 12" />
            </g>
          </svg>
          <span className="coast-caustic" />
          <span className="coast-caustic" />
          <span className="coast-caustic" />
        </>
      )}
      {kind === "petals" &&
        Array.from({ length: 6 }, (_, i) => (
          <i className="coast-petal" key={i} />
        ))}
      {kind === "glass" && (
        <>
          <span className="coast-prism" />
          <span className="coast-prism" />
        </>
      )}
      {kind === "tidal" && (
        <>
          <span className="coast-tide" />
          <span className="coast-tide" />
          <span className="coast-tide" />
        </>
      )}
    </div>
  );
}
