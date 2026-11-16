import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CoastalOpening } from "./CoastalOpening";
import { ArtifactScene } from "./ArtifactScene";
import { DockScene } from "./DockScene";

export const FILM_DURATION = 600;
export function ProjectReelComposition() {
  const frame = useCurrentFrame();
  const compact = useVideoConfig().width < 1000;
  const index = frame < 150 ? 0 : frame < 390 ? 1 : 2;
  const local = frame < 150 ? frame : frame < 390 ? frame - 150 : frame - 390;
  const sweep = interpolate(local, [0, 12], [-120, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      data-reel-scene={index}
      data-reel-frame={frame}
      style={{ overflow: "hidden", background: "#bbdcf2" }}
    >
      <Sequence from={0} durationInFrames={150}>
        <DockScene frame={local} compact={compact} />
      </Sequence>
      <Sequence from={150} durationInFrames={240}>
        <ArtifactScene frame={local} compact={compact} />
      </Sequence>
      <Sequence from={390} durationInFrames={210}>
        <CoastalOpening frame={local} compact={compact} closing />
      </Sequence>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "28%",
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, transparent, #fff1dd90, transparent)",
          transform: `translateX(${sweep}%) skewX(-12deg)`,
          opacity: local < 12 ? 0.45 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 5,
          background: "#17344d20",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#922f60",
            transformOrigin: "left",
            transform: `scaleX(${frame / (FILM_DURATION - 1)})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
