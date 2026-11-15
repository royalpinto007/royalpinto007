"use client";

import { Player, type PlayerRef } from "@remotion/player";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ReelPlayerProps = { visible: boolean; compact: boolean };
const scenes = [
  {
    title: ["Less ordinary.", "More feeling."],
    category: "Creative development",
    name: "Facetworks / Magnetic sand",
    image: "magnetic-sand",
    color: "#9dc2dc",
    accent: "#173f59",
  },
  {
    title: ["Real problems.", "Useful products."],
    category: "Product engineering",
    name: "SignalizeAI / Research in the browser",
    image: "signalizeai",
    color: "#b8cddd",
    accent: "#3b536e",
  },
  {
    title: ["Small details.", "Big difference."],
    category: "Interaction design",
    name: "Facetworks / Jelly iPhone",
    image: "jelly-iphone",
    color: "#dfb1c2",
    accent: "#70445c",
  },
  {
    title: ["A little play.", "A new perspective."],
    category: "Browser experiments",
    name: "Facetworks / Fogged glass",
    image: "fogged-glass",
    color: "#edc3a6",
    accent: "#734f43",
  },
];
const SCENE_FRAMES = 150;
const DURATION = SCENE_FRAMES * scenes.length;

export function ProjectReelComposition() {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const compact = width < 1000;
  const index = Math.floor(frame / SCENE_FRAMES) % scenes.length;
  const local = frame % SCENE_FRAMES;
  const scene = scenes[index];
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: ease,
  };

  return (
    <AbsoluteFill
      data-reel-scene={index}
      data-reel-frame={frame}
      style={{
        background: scene.color,
        color: "#1e2e4d",
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      <AbsoluteFill
        style={{
          background: `linear-gradient(110deg, ${scene.color}ee 15%, ${scene.color}66), url('/scene/sunset-coast.webp') center / cover`,
          opacity: interpolate(local, [0, 80], [0.4, 1], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: compact ? 46 : 72,
          top: compact ? 44 : 64,
          color: scene.accent,
          fontSize: compact ? 24 : 23,
        }}
      >
        {scene.category}
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 46 : 72,
          top: compact ? 100 : 190,
          zIndex: 2,
          fontFamily: "var(--font-coastal-display), sans-serif",
          textTransform: "uppercase",
          fontSize: compact ? 74 : 86,
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.015em",
        }}
      >
        {scene.title.map((line, n) => (
          <div key={line} style={{ overflow: "hidden", paddingBottom: 8 }}>
            <div
              style={{
                translate: `0 ${interpolate(local, [n * 4, 28 + n * 4], [110, 0], clamp)}%`,
                opacity: interpolate(local, [n * 4, 20 + n * 4], [0, 1], clamp),
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 46 : 700,
          right: compact ? 46 : 60,
          top: compact ? 310 : 140,
          aspectRatio: "1.44",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 24px 50px -26px #1e2e4d55",
          clipPath: `inset(0 ${interpolate(local, [4, 38], [100, 0], clamp)}% 0 0)`,
          translate: `0 ${interpolate(local, [4, 45], [38, 0], clamp)}px`,
        }}
      >
        <Img
          src={`/work/${scene.image}.webp`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            scale: interpolate(local, [0, 149], [1.035, 1], clamp),
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 46 : 72,
          bottom: 55,
          fontSize: compact ? 22 : 20,
        }}
      >
        {scene.name}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          display: "flex",
          gap: 4,
        }}
      >
        {scenes.map((s, n) => (
          <div key={s.name} style={{ flex: 1, background: "#1e2e4d15" }}>
            <div
              style={{
                height: "100%",
                background: scene.accent,
                transformOrigin: "left",
                scale: `${n < index ? 1 : n > index ? 0 : local / (SCENE_FRAMES - 1)} 1`,
              }}
            />
          </div>
        ))}
      </div>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: scenes[(index + 1) % scenes.length].color,
          translate: `${interpolate(local, [134, 149], [100, 0], { ...clamp, easing: Easing.bezier(0.7, 0, 0.3, 1) })}% 0`,
        }}
      />
    </AbsoluteFill>
  );
}

export function ReelPlayer({ visible, compact }: ReelPlayerProps) {
  const player = useRef<PlayerRef>(null);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const current = player.current;
    const fail = () => setFailed(true);
    current?.addEventListener("error", fail);
    return () => current?.removeEventListener("error", fail);
  }, []);
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  useEffect(() => {
    if (visible && !paused && !hidden) player.current?.play();
    else player.current?.pause();
  }, [visible, paused, hidden]);

  if (failed) return null;
  return (
    <div className="reel-player" data-playing={visible && !paused && !hidden}>
      <div aria-hidden="true">
        <Player
          ref={player}
          component={ProjectReelComposition}
          durationInFrames={DURATION}
          fps={30}
          compositionWidth={compact ? 760 : 1440}
          compositionHeight={compact ? 900 : 760}
          autoPlay={visible && !paused && !hidden}
          loop
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          numberOfSharedAudioTags={0}
          style={{ width: "100%" }}
          errorFallback={() => null}
        />
      </div>
      <button
        className="reel-toggle"
        type="button"
        onClick={() => setPaused(!paused)}
      >
        {paused ? (
          <Play size={15} aria-hidden="true" />
        ) : (
          <Pause size={15} aria-hidden="true" />
        )}
        <span>{paused ? "Play reel" : "Pause reel"}</span>
      </button>
    </div>
  );
}
