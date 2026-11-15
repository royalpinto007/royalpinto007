"use client";

import { SceneEnvironment } from "./SceneEnvironment";
import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type { ReelPlayerProps } from "./ReelPlayer";

/** The static composition is also the no-JS and reduced-motion experience. */
export function MotionReel() {
  const host = useRef<HTMLDivElement>(null);
  const [Player, setPlayer] = useState<ComponentType<ReelPlayerProps> | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const sync = () => {
      setReduced(preference.matches);
      setCompact(mobile.matches);
    };
    sync();
    preference.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!visible || reduced || Player) return;
    let active = true;
    import("./ReelPlayer")
      .then((module) => {
        if (active) setPlayer(() => module.ReelPlayer);
      })
      .catch(() => {
        /* The server-rendered composition remains usable. */
      });
    return () => {
      active = false;
    };
  }, [visible, reduced, Player]);

  return (
    <section
      className="motion-reel immersive-chapter"
      aria-labelledby="reel-title"
    >
      <SceneEnvironment scene="cinema" />
      <header className="reel-heading chapter-heading">
        <h2 id="reel-title">
          Built to <span>move.</span>
        </h2>
        <p>20 seconds. In my element.</p>
      </header>
      <div className="reel-stage" ref={host}>
        <div className="reel-poster" aria-hidden="true">
          <div className="reel-poster-copy">
            <span>A film by Royal Simpson Pinto</span>
            <strong>
              A little wonder.
              <br />
              Built into something real.
            </strong>
            <span>Code. Craft. A new perspective.</span>
          </div>
          <Image
            src="/scene/sunset-coast.webp"
            alt=""
            width={960}
            height={640}
          />
          <picture className="film-poster-sculpture">
            <Image
              src="/scene/film-sculpture.webp"
              alt=""
              width={1200}
              height={1000}
            />
          </picture>
        </div>
        {Player && !reduced && <Player visible={visible} compact={compact} />}
      </div>
      <div className="reel-caption">
        <span>A coastal short, with an illustrated BoardEject workflow</span>
        <a href="/facetworks/">
          Explore the experiments <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
