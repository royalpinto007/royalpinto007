"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { CoastalAtmosphere } from "./CoastalAtmosphere";

export type Environment =
  | "marina"
  | "observatory"
  | "conservatory"
  | "pavilion"
  | "atrium"
  | "cinema"
  | "tidal";

/** Real section-wide scenery, requested only when its chapter reaches view. */
export function SceneEnvironment({ scene }: { scene: Environment }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let inView = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(!preference.matches);
      setActive(inView && !document.hidden && !preference.matches && !paused);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) setVisible(true);
      sync();
    });
    observer.observe(element);
    sync();
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, [paused]);
  const kind =
    scene === "conservatory" || scene === "pavilion"
      ? "petals"
      : scene === "atrium" || scene === "cinema"
        ? "glass"
        : scene === "tidal"
          ? "tidal"
          : "water";
  const artwork = (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={`/scene/environments/${scene}-mobile.webp`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/scene/environments/${scene}.webp`}
        width={1800}
        height={1000}
        alt=""
        decoding="async"
        fetchPriority="low"
        onError={() => setFailed(true)}
      />
    </picture>
  );
  return (
    <>
      <div
        ref={host}
        className={`chapter-environment environment-${scene}`}
        aria-hidden="true"
        data-active={active}
      >
        <div className="environment-camera">
          {visible && !failed && artwork}
          <noscript>{artwork}</noscript>
        </div>
        <div className="environment-light" />
        <div className="environment-reflections" />
        <CoastalAtmosphere kind={kind} />
        <i className="environment-glint" />
        <i className="environment-glint" />
        <i className="environment-glint" />
      </div>
      {enabled && (
        <button
          className="scene-ambient-toggle"
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={`${paused ? "Play" : "Pause"} scenery: ${scene}`}
          title={`${paused ? "Play" : "Pause"} scenery`}
        >
          {paused ? (
            <Play size={15} aria-hidden="true" />
          ) : (
            <Pause size={15} aria-hidden="true" />
          )}
          <span>{paused ? "Play scenery" : "Pause scenery"}</span>
        </button>
      )}
    </>
  );
}
