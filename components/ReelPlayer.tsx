"use client";

import {
  Player,
  type PlayerRef,
  type CallbackListener,
} from "@remotion/player";
import { ProjectReelComposition, FILM_DURATION } from "./film/CoastalFilm";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ReelPlayerProps = {
  visible: boolean;
  compact: boolean;
  onFailure: () => void;
};

function ReelFailure({ onFailure }: { onFailure: () => void }) {
  useEffect(onFailure, [onFailure]);
  return null;
}

export function ReelPlayer({ visible, compact, onFailure }: ReelPlayerProps) {
  const player = useRef<PlayerRef>(null);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    const current = player.current;
    const update: CallbackListener<"frameupdate"> = ({ detail: { frame } }) => {
      if (frame > 0) setReady(true);
      setChapter(frame < 150 ? 0 : frame < 390 ? 1 : 2);
    };
    const waiting = () => setReady(false);
    const resume = () => setReady((current?.getCurrentFrame() ?? 0) > 0);
    current?.addEventListener("frameupdate", update);
    current?.addEventListener("waiting", waiting);
    current?.addEventListener("resume", resume);
    current?.addEventListener("error", onFailure);
    return () => {
      current?.removeEventListener("frameupdate", update);
      current?.removeEventListener("waiting", waiting);
      current?.removeEventListener("resume", resume);
      current?.removeEventListener("error", onFailure);
    };
  }, [onFailure]);
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

  const toggle = () => {
    if (!ready) {
      // A fresh play request also recovers a player whose initial clock stalled.
      player.current?.pause();
      player.current?.play();
      setPaused(false);
    } else setPaused(!paused);
  };
  const playing = visible && !paused && !hidden;
  return (
    <div
      className="reel-player"
      data-playing={playing && ready}
      data-ready={ready}
    >
      <div className="reel-canvas" aria-hidden="true">
        <Player
          ref={player}
          component={ProjectReelComposition}
          durationInFrames={FILM_DURATION}
          fps={30}
          compositionWidth={compact ? 760 : 1440}
          compositionHeight={compact ? 900 : 760}
          autoPlay={playing}
          loop
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          numberOfSharedAudioTags={0}
          style={{ width: "100%" }}
          errorFallback={() => <ReelFailure onFailure={onFailure} />}
        />
      </div>
      <div className="reel-controls">
        <div className="film-chapters" role="group" aria-label="Film chapters">
          {[
            ["Code", 32],
            ["Convert", 270],
            ["Ship", 465],
          ].map(([name, frame], index) => (
            <button
              key={name}
              type="button"
              onClick={() => player.current?.seekTo(Number(frame))}
              aria-label={`Watch ${name} chapter`}
              aria-pressed={chapter === index}
            >
              {name}
            </button>
          ))}
        </div>
        <button className="reel-toggle" type="button" onClick={toggle}>
          {paused || !ready ? (
            <Play size={15} aria-hidden="true" />
          ) : (
            <Pause size={15} aria-hidden="true" />
          )}
          <span>{paused || !ready ? "Play reel" : "Pause reel"}</span>
        </button>
      </div>
    </div>
  );
}
