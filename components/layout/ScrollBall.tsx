"use client";

import { useEffect, useRef } from "react";

const TOP = 104; // clears the header
const BOTTOM = 96; // clears the back-to-top button
const EDGE = 7; // distance from the window edge
const WINDOW = 140; // how long (in px of travel) a crossing takes, each side of the gap
const MIN_GAP = 100; // only cross where the empty band between sections is this tall

type Gap = { center: number; size: number }; // document coordinates

/** Empty horizontal bands between top-level sections: from the last content of one section
 *  to the first content of the next. Decorative (aria-hidden) and full-width background
 *  layers are ignored; positioned controls and captions count as content. */
function measureGaps(): Gap[] {
  const shell = document.querySelector(".portfolio-shell") ?? document.querySelector("main");
  if (!shell) return [];
  const blocks = [...shell.children, document.querySelector("footer.site-footer")].filter(
    (el): el is Element =>
      !!el && getComputedStyle(el).position !== "fixed" && el.getBoundingClientRect().height > 20,
  );
  const spans = blocks.map((block) => {
    const width = block.getBoundingClientRect().width;
    let top = Infinity;
    let bottom = -Infinity;
    const walk = (node: Element, depth: number) => {
      for (const child of node.children) {
        const style = getComputedStyle(child);
        if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden") continue;
        if (child.getAttribute("aria-hidden") === "true") continue; // decorative art
        const box = child.getBoundingClientRect();
        if (box.height < 4 || box.width < 4) continue;
        // Positioned layers count when they carry content (controls, captions, a portrait);
        // full-width ones are backgrounds, so look inside them instead.
        if (style.position === "absolute" && box.width >= width * 0.9) {
          walk(child, depth);
          continue;
        }
        if (depth >= 2 || box.width < width * 0.98 || style.position === "absolute") {
          top = Math.min(top, box.top);
          bottom = Math.max(bottom, box.bottom);
        } else walk(child, depth + 1);
      }
    };
    walk(block, 0);
    return { top: top + scrollY, bottom: bottom + scrollY };
  });
  const gaps: Gap[] = [];
  for (let i = 1; i < spans.length; i++) {
    const above = spans[i - 1].bottom;
    const below = spans[i].top;
    if (Number.isFinite(above) && Number.isFinite(below) && below - above >= MIN_GAP)
      gaps.push({ center: (above + below) / 2, size: below - above });
  }
  return gaps;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * The chrome ball from the film. It rides a side margin as the page scrolls and, where two
 * sections leave an empty band between them, rolls across that band to the other margin.
 * It never takes clicks. A mirror ball looks the same from every angle, so it only moves.
 */
export function ScrollBall() {
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ball.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gaps: Gap[] = [];
    let x = Number.NaN;
    let y = Number.NaN;
    let frame = 0;

    const goal = () => {
      const size = element.offsetWidth;
      const room = document.documentElement.scrollHeight - innerHeight;
      const progress = room > 0 ? clamp01(scrollY / room) : 0;
      const track = TOP + progress * Math.max(0, innerHeight - TOP - BOTTOM - size);
      // Crossings happen at least one crossing-length below the header, so the ball
      // never rolls underneath it; near the top it drops down its margin to meet the gap.
      // ...and finish above the back-to-top button near the bottom.
      const centre = Math.min(
        Math.max(track + size / 2, TOP + size / 2 + WINDOW),
        innerHeight - BOTTOM - size / 2 - WINDOW,
      );
      const right = document.documentElement.clientWidth - EDGE - size;
      const sideX = (side: number) => (side % 2 === 0 ? right : EDGE);

      let crossed = 0;
      for (const gap of gaps) {
        const g = gap.center - scrollY; // gap centre in the window
        if (g < centre - WINDOW) {
          crossed++;
          continue;
        }
        if (g <= centre + WINDOW) {
          // Crossing: ride the empty band while moving to the other side.
          const t = (centre - g + WINDOW) / (2 * WINDOW);
          const lock = Math.min(clamp01(t / 0.12), clamp01((1 - t) / 0.12));
          const across = ease(clamp01((t - 0.15) / 0.7));
          return {
            x: sideX(crossed) + (sideX(crossed + 1) - sideX(crossed)) * across,
            y: track + (g - size / 2 - track) * lock,
            crossing: true,
          };
        }
        break;
      }
      return { x: sideX(crossed), y: track, crossing: false };
    };

    const place = (stretch: number) => {
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(1 - stretch * 0.5).toFixed(3)}, ${(1 + stretch).toFixed(3)})`;
    };
    const step = () => {
      const target = goal();
      if (Number.isNaN(y) || reduce.matches) {
        x = target.x;
        y = target.y;
        place(0);
        frame = 0;
        return;
      }
      const dx = target.x - x;
      const dy = target.y - y;
      // A jump (End key, a link to a section) can land on the other side without passing
      // through a gap: move straight there instead of sliding across the content.
      if (!target.crossing && Math.abs(dx) > 40) {
        x = target.x;
        y = target.y;
        place(0);
        frame = 0;
        return;
      }
      // While crossing, follow the scroll exactly so the ball stays inside the empty band.
      const follow = target.crossing ? 1 : 0.16;
      x += dx * follow;
      y += dy * follow;
      place(target.crossing ? 0 : Math.min(0.12, Math.abs(dy) / 900));
      frame = Math.abs(dx) + Math.abs(dy) > 0.4 ? requestAnimationFrame(step) : 0;
      if (!frame) {
        x = target.x;
        y = target.y;
        place(0);
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    let measureTimer = 0;
    const remeasure = () => {
      clearTimeout(measureTimer);
      measureTimer = window.setTimeout(() => {
        gaps = measureGaps();
        wake();
      }, 150);
    };

    gaps = measureGaps();
    step();
    element.dataset.ready = "true";
    // Content grows as images load or a "Show more" opens: measure the bands again.
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(measureTimer);
      observer.disconnect();
      removeEventListener("scroll", wake);
      removeEventListener("resize", remeasure);
    };
  }, []);

  return <div ref={ball} className="scroll-ball" aria-hidden="true" />;
}
