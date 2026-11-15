"use client";

import { useEffect, useRef, useState } from "react";

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
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
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
    <div
      ref={host}
      className={`chapter-environment environment-${scene}`}
      aria-hidden="true"
    >
      <div className="environment-camera">
        {visible && !failed && artwork}
        <noscript>{artwork}</noscript>
      </div>
      <div className="environment-light" />
      <div className="environment-reflections" />
      <i className="environment-glint" />
      <i className="environment-glint" />
      <i className="environment-glint" />
    </div>
  );
}
