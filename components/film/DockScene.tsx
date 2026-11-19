import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { FilmImage } from "./FilmImage";
import { SkillRail } from "../SkillRail";

/** A frame-driven camera follows the original chrome cursor across four tiles. */
export function DockScene({
  frame,
  compact,
}: {
  frame: number;
  compact: boolean;
}) {
  const step = Math.min(3, Math.floor(frame / 36));
  const local = frame - step * 36;
  const message = [
    "an AI agent.",
    "a full-stack app.",
    "an automation.",
    "a Web3 tool.",
  ][step];
  const jump = [
    [29, 39],
    [65, 75],
    [101, 111],
  ].reduce(
    (height, [from, to]) =>
      frame >= from && frame <= to
        ? Math.sin(((frame - from) / (to - from)) * Math.PI) * 66
        : height,
    0,
  );
  const enter = spring({
    frame,
    fps: 30,
    config: { damping: 20, stiffness: 160 },
  });
  return (
    <AbsoluteFill
      style={{ background: "#c9dfed", overflow: "hidden", color: "#12374e" }}
    >
      <FilmImage
        src={compact ? "https://assets.royalpinto007.com/scene/coast-mobile.webp" : "https://assets.royalpinto007.com/scene/sunset-coast.webp"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.04 + frame * 0.0008})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(110deg,#fff2dfed,#fff0df30 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 54 : 70,
          fontFamily: "var(--font-geist),sans-serif",
          fontSize: 25,
        }}
      >
        Royal Simpson Pinto
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 118 : 136,
          fontFamily: "var(--font-coastal-display),sans-serif",
          fontSize: compact ? 100 : 120,
          lineHeight: 1.03,
          textTransform: "uppercase",
          transform: `translateY(${(1 - enter) * 45}px)`,
        }}
      >
        Code it.
        <br />
        <span style={{ color: "#922f60" }}>Ship it.</span>
      </div>
      <div
        data-film-typed
        style={{
          position: "absolute",
          left: compact ? 48 : 74,
          top: compact ? 365 : 430,
          fontFamily: "ui-monospace,monospace",
          fontSize: compact ? 32 : 36,
        }}
      >
        {message.slice(0, Math.max(0, Math.floor(local * 0.8)))}
        <span style={{ opacity: local % 20 < 13 ? 1 : 0, color: "#922f60" }}>
          ▍
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? "7%" : "45%",
          width: compact ? "86%" : "50%",
          top: compact ? "59%" : "48%",
          transform: `translateY(${(1 - enter) * 110}px)`,
        }}
      >
        <SkillRail
          film
          cameraStyle={{
            transform: `perspective(1400px) rotateX(${interpolate(frame, [0, 149], [34, 16])}deg) rotateY(${interpolate(frame, [0, 38, 76, 112, 149], [-16, -7, 12, -5, 8], { easing: Easing.inOut(Easing.cubic) })}deg) rotateZ(-5deg) scale(${interpolate(frame, [0, 50, 95, 149], [0.92, 1.08, 1, 1.07])})`,
          }}
          orbStyle={{
            transform: `translate3d(${interpolate(frame, [0, 29, 39, 65, 75, 101, 111, 149], [0, 0, 25, 25, 50, 50, 75, 75])}%,${-jump}px,0)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
