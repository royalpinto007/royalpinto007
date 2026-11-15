"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { ProjectReelComposition, FILM_DURATION } from "./film/CoastalFilm";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ReelPlayerProps = { visible: boolean; compact: boolean };
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
          durationInFrames={FILM_DURATION}
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
      <div className="film-chapters" role="group" aria-label="Film chapters">
        {[
          ["Wonder", 32],
          ["Make", 270],
          ["Beyond", 465],
        ].map(([name, frame]) => (
          <button
            key={name}
            type="button"
            onClick={() => player.current?.seekTo(Number(frame))}
            aria-label={`Watch ${name} chapter`}
          >
            {name}
          </button>
        ))}
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
