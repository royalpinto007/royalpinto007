"use client";

import { SceneEnvironment } from "./SceneEnvironment";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
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
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);

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
    if (!visible || reduced || Player || failed) return;
    let active = true;
    import("./ReelPlayer")
      .then((module) => {
        if (active) setPlayer(() => module.ReelPlayer);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [visible, reduced, Player, failed]);

  return (
    <section
      className="motion-reel immersive-chapter"
      aria-labelledby="reel-title"
    >
      <SceneEnvironment scene="cinema" />
      <header className="reel-heading chapter-heading">
        <h2 id="reel-title">
          Code in <span>motion</span>
        </h2>
        <p>From first commit to working software.</p>
      </header>
      <div
        className="reel-shell"
        ref={host}
        data-player={Boolean(Player && !reduced && !failed)}
      >
        <div className="reel-stage">
          <div className="reel-poster" aria-hidden="true">
            <div className="reel-poster-copy">
              <span>Royal Simpson Pinto</span>
              <strong>Code. Test. Ship</strong>
              <span>AI agents. Apps. Automation. Web3.</span>
            </div>
            <picture className="reel-poster-backdrop">
              <source
                media="(max-width: 767px)"
                srcSet="/scene/sunset-coast-mobile.webp"
              />
              <img
                src="/scene/sunset-coast.webp"
                alt=""
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <picture className="film-poster-sculpture">
              <Image
                src="/scene/film-sculpture.webp"
                alt=""
                width={1200}
                height={1000}
              />
            </picture>
          </div>
        </div>
        <span className="reel-static-note">Code. Convert. Ship</span>
        {Player && !reduced && !failed && (
          <Player visible={visible} compact={compact} onFailure={onFailure} />
        )}
      </div>
    </section>
  );
}
