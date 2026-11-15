"use client";

import { WorldScene } from "./WorldScene";
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
    <section className="motion-reel" aria-labelledby="reel-title">
      <p className="section-marker">
        <span>03 / In motion</span>
        <span>Press play. Get the feeling.</span>
      </p>
      <div className="reel-heading">
        <h2 id="reel-title">
          Built to <span>move.</span>
        </h2>
        <p>A 20-second look at my work.</p>
      </div>
      <div className="reel-stage" ref={host}>
        <div className="reel-poster" aria-hidden="true">
          <WorldScene />
          <div>
            <span>Creative development</span>
            <strong>
              Less ordinary.
              <br />
              More feeling.
            </strong>
            <span>Facetworks / Browser experiments</span>
          </div>
          <Image
            src="/work/magnetic-sand.webp"
            alt=""
            width={960}
            height={640}
          />
        </div>
        {Player && !reduced && <Player visible={visible} compact={compact} />}
      </div>
      <div className="reel-caption">
        <span>Products, interfaces & experiments by Royal</span>
        <a href="/facetworks/">
          Explore the experiments <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
