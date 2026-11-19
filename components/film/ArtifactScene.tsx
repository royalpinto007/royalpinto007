import { AbsoluteFill, interpolate, spring } from "remotion";
import { BoardArtifact } from "@/components/film/BoardArtifact";

export function ArtifactScene({
  frame,
  compact,
}: {
  frame: number;
  compact: boolean;
}) {
  const progress = interpolate(frame, [18, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const second = frame >= 112;
  const title = second
    ? spring({
        frame: frame - 112,
        fps: 30,
        config: { damping: 20, stiffness: 160 },
      })
    : 1;
  const zoom = interpolate(frame, [0, 95, 130, 200, 239], [1, 1, 1.1, 1.1, 1]);
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
          opacity: title,
          transform: `translateY(${(1 - title) * 22}px)`,
        }}
      >
        {second ? "Still yours." : "Same idea."}
        <br />
        <span style={{ color: "#922f60" }}>
          {second ? "Now" : "New"}
          <br />
          {second ? "editable." : "possibilities."}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          width: compact ? "90%" : "54%",
          left: compact ? "5%" : "42%",
          top: compact ? "43%" : "27%",
          transform: `perspective(1800px) rotateY(${(1 - progress) * -12}deg) rotateZ(${(1 - progress) * -5}deg) scale(${zoom})`,
          filter: "drop-shadow(0 30px 25px #24475b30)",
        }}
      >
        <BoardArtifact progress={progress} />
      </div>
    </AbsoluteFill>
  );
}
