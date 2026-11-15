import { AbsoluteFill, Img, interpolate } from "remotion";

export function CoastalOpening({
  frame,
  compact,
  closing = false,
}: {
  frame: number;
  compact: boolean;
  closing?: boolean;
}) {
  const enter = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#a8cee8" }}>
      <Img
        src={compact ? "/scene/coast-mobile.webp" : "/scene/sunset-coast.webp"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.1 - Math.min(frame, 210) * 0.00025}) translateX(${Math.sin(frame / 120) * 1.2}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg,#fff5dfdf,transparent 82%)",
        }}
      />
      {closing ? (
        <Img
          src="/portrait-original.webp"
          style={{
            position: "absolute",
            width: compact ? "92%" : "56%",
            right: compact ? "-24%" : "-9%",
            bottom: "-6%",
            mask: "url(/scene/portrait-outline.svg) center / 100% 100% no-repeat",
            transform: `translateY(${(1 - enter) * 40}px)`,
          }}
        />
      ) : (
        <Img
          src="/scene/film-sculpture.webp"
          style={{
            position: "absolute",
            width: compact ? "92%" : "64%",
            right: compact ? "-9%" : "-3%",
            bottom: compact ? "8%" : "-12%",
            transform: `translateY(${(1 - enter) * 55}px) rotate(${interpolate(frame, [0, 150], [-9, 4])}deg)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 72 : 96,
          zIndex: 2,
          color: "#12374e",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 28}px)`,
        }}
      >
        <p
          style={{
            fontSize: compact ? 25 : 25,
            marginBottom: compact ? 28 : 36,
            fontFamily: "var(--font-geist),sans-serif",
          }}
        >
          {closing ? "Royal Simpson Pinto" : "From a curious mind."}
        </p>
        <div
          style={{
            fontFamily: "var(--font-coastal-display),sans-serif",
            textTransform: "uppercase",
            fontSize: compact ? 94 : 112,
            lineHeight: 1.03,
            letterSpacing: "-.015em",
          }}
        >
          {closing ? (
            <>
              Build
              <br />
              <span style={{ color: "#922f60" }}>beyond.</span>
            </>
          ) : (
            <>
              A little
              <br />
              <span style={{ color: "#922f60" }}>wonder.</span>
            </>
          )}
        </div>
      </div>
      {closing && (
        <p
          style={{
            position: "absolute",
            left: compact ? 48 : 74,
            bottom: compact ? 170 : 100,
            color: "#12374e",
            fontSize: compact ? 25 : 24,
            fontFamily: "var(--font-geist),sans-serif",
          }}
        >
          royalpinto007.com
        </p>
      )}
    </AbsoluteFill>
  );
}
