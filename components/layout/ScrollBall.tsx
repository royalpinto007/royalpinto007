"use client";

import { useEffect, useRef } from "react";

const TOP = 104; // clears the header
const BOTTOM = 96; // clears the back-to-top button

/**
 * The chrome ball from the film, riding down the right margin as the page scrolls.
 * It marks how far down the reader is, eases into place, and never takes clicks.
 * A mirror ball looks the same from every angle, so it only needs to move.
 */
export function ScrollBall() {
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ball.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = Number.NaN;
    let frame = 0;

    const target = () => {
      const room = document.documentElement.scrollHeight - innerHeight;
      const progress = room > 0 ? Math.min(1, Math.max(0, scrollY / room)) : 0;
      return TOP + progress * Math.max(0, innerHeight - TOP - BOTTOM - element.offsetHeight);
    };
    const place = (y: number, stretch: number) => {
      element.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${(1 - stretch * 0.5).toFixed(3)}, ${(1 + stretch).toFixed(3)})`;
    };
    const step = () => {
      const goal = target();
      if (Number.isNaN(current) || reduce.matches) {
        current = goal;
        place(current, 0);
        frame = 0;
        return;
      }
      const delta = goal - current;
      current += delta * 0.16;
      // A little stretch while it travels fast, like the ball in the film.
      place(current, Math.min(0.12, Math.abs(delta) / 900));
      frame = Math.abs(delta) > 0.4 ? requestAnimationFrame(step) : 0;
      if (!frame) place(goal, 0);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    step();
    element.dataset.ready = "true";
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", wake);
      removeEventListener("resize", wake);
    };
  }, []);

  return <div ref={ball} className="scroll-ball" aria-hidden="true" />;
}
