import { AbsoluteFill, interpolate } from "remotion";
import { BoardArtifact } from "../BoardArtifact";

export function ArtifactScene({
  frame,
  compact,
}: {
  frame: number;
  compact: boolean;
}) {
  const progress = interpolate(frame, [38, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg,#bbdcf2,#e5dbed 48%,#facbba)",
        color: "#12374e",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 780,
          height: 780,
          border: "2px solid #fff9",
          borderRadius: "50%",
          right: -170,
          top: -240,
          transform: `scale(${1 + frame * 0.001})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 68 : 70,
          fontFamily: "var(--font-geist),sans-serif",
          fontSize: 25,
        }}
      >
        BoardEject / an illustrated workflow
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 128 : 130,
          fontFamily: "var(--font-coastal-display),sans-serif",
          fontSize: compact ? 78 : 78,
          lineHeight: 1.03,
          textTransform: "uppercase",
        }}
      >
        Same idea.
        <br />
        <span style={{ color: "#922f60" }}>
          New
          <br />
          possibilities.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          width: compact ? "90%" : "54%",
          left: compact ? "5%" : "42%",
          top: compact ? "43%" : "27%",
          transform: `perspective(1800px) rotateY(${(1 - progress) * -12}deg) rotateZ(${(1 - progress) * -5}deg)`,
          filter: "drop-shadow(0 30px 25px #24475b30)",
        }}
      >
        <BoardArtifact progress={progress} />
      </div>
    </AbsoluteFill>
  );
}
