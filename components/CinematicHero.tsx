"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownRight, Pause, Play, Sun } from "lucide-react";

import { CoastalAtmosphere } from "./CoastalAtmosphere";

const lights = ["Golden hour", "Sky blue", "Rose glow"];
const glints = Array.from({ length: 24 }, (_, i) => ({
  x: 54 + ((i * 73) % 44),
  y: 47 + ((i * 47) % 48),
  size: 1 + (i % 3),
  delay: -((i * 1.37) % 7),
}));

/** One layered scene, with no runtime or transformation applied to the portrait. */
export function CinematicHero({ children }: { children: ReactNode }) {
  const host = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [light, setLight] = useState(0);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let visible = false;
    let frame = 0;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(!preference.matches);
      setActive(visible && !document.hidden && !preference.matches && !paused);
    };
    const pointer = (event: PointerEvent) => {
      if (
        preference.matches ||
        paused ||
        !visible ||
        event.pointerType !== "mouse"
      )
        return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty(
          "--scene-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 14}px`,
        );
        element.style.setProperty(
          "--scene-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 9}px`,
        );
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.removeProperty("--scene-x");
      element.style.removeProperty("--scene-y");
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    sync();
    element.addEventListener("pointermove", pointer);
    element.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      reset();
      observer.disconnect();
      element.removeEventListener("pointermove", pointer);
      element.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, [paused]);
  return (
    <section
      className="portfolio-hero hero-cinema"
      ref={host}
      data-active={active}
      data-effects-enabled={enabled}
      data-light={light}
    >
      <div className="hero-landscape" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/scene/coast-mobile.webp"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/scene/sunset-coast.webp"
            width="1672"
            height="941"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <CoastalAtmosphere />
      <div className="hero-sunset" aria-hidden="true" />
      <div className="hero-lightbeam" aria-hidden="true" />
      <div className="hero-glitter" aria-hidden="true">
        {glints.map((glint, i) => (
          <span
            className="hero-glint"
            key={i}
            style={{
              left: `${glint.x}%`,
              top: `${glint.y}%`,
              width: glint.size,
              height: glint.size,
              animationDelay: `${glint.delay}s`,
            }}
          />
        ))}
      </div>
      {children}
      <div className="hero-bottom">
        <a className="hero-work-link hero-actions" href="#work">
          <span>Discover my work</span>
          <ArrowDownRight size={24} />
        </a>
        <div
          className="scene-controls"
          role="group"
          aria-label="Scene controls"
        >
          <button
            type="button"
            className="scene-light"
            onClick={() => setLight((light + 1) % lights.length)}
            aria-label={`Change scene lighting, currently ${lights[light]}`}
          >
            <Sun size={15} />
            <span aria-live="polite">{lights[light]}</span>
          </button>
          {enabled && (
            <button
              className="hero-effects-toggle"
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Play hero effects" : "Pause hero effects"}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
