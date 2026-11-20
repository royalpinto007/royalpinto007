"use client";

import { useEffect, useRef } from "react";

const TOP = 104; // clears the header
const BOTTOM = 96; // clears the back-to-top button
const EDGE = 7; // distance from the window edge
const WINDOW = 140; // how long (in px of travel) a crossing takes, each side of the gap
const STEP = 4; // route sampling, in px of scroll

type Gap = { center: number; size: number }; // document coordinates
type Layout = { gaps: Gap[]; vh: number; vw: number; room: number; size: number };

/** Top and bottom in the window, covering both where an element is drawn now and where it
 *  rests: reveal animations start shifted (translateY) and only settle once scrolled to. */
function span(element: Element): [number, number] {
  const box = element.getBoundingClientRect();
  if (!(element instanceof HTMLElement)) return [box.top, box.bottom];
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null)
    top += node.offsetTop;
  top -= scrollY;
  return [Math.min(box.top, top), Math.max(box.bottom, top + element.offsetHeight)];
}

/** Vertical extent of an element including any visible descendants that spill outside it. */
function extent(element: Element): [number, number] {
  let [top, bottom] = span(element);
  for (const child of element.querySelectorAll("*")) {
    if (child.closest('[aria-hidden="true"]')) continue;
    const b = child.getBoundingClientRect();
    if (b.height < 1 || b.width < 1) continue;
    const [t, u] = span(child);
    top = Math.min(top, t);
    bottom = Math.max(bottom, u);
  }
  return [top, bottom];
}

/** Empty horizontal bands between top-level sections: from the last content of one section
 *  to the first content of the next. Decorative (aria-hidden) and full-width background
 *  layers are ignored; positioned controls, captions and the portrait count as content. */
function measureGaps(minGap: number): Gap[] {
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
        if (child.getAttribute("aria-hidden") === "true") continue;
        const box = child.getBoundingClientRect();
        if (box.height < 4 || box.width < 4) continue;
        if (style.position === "absolute" && box.width >= width * 0.9) {
          walk(child, depth);
          continue;
        }
        if (depth >= 2 || box.width < width * 0.98 || style.position === "absolute") {
          // Children can overflow their box (negative margins, tall display type).
          const [low, high] = extent(child);
          top = Math.min(top, low);
          bottom = Math.max(bottom, high);
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
    if (Number.isFinite(above) && Number.isFinite(below) && below - above >= minGap)
      gaps.push({ center: (above + below) / 2, size: below - above });
  }
  return gaps;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Where the ball sits in the window (top-left corner) when the page is scrolled to `s`. */
function ballAt(s: number, { gaps, vh, vw, room, size }: Layout) {
  const progress = room > 0 ? clamp01(s / room) : 0;
  const track = TOP + progress * Math.max(0, vh - TOP - BOTTOM - size);
  // Crossings happen below the header and above the back-to-top button.
  const centre = Math.min(
    Math.max(track + size / 2, TOP + size / 2 + WINDOW),
    vh - BOTTOM - size / 2 - WINDOW,
  );
  const right = vw - EDGE - size;
  const sideX = (side: number) => (side % 2 === 0 ? right : EDGE);

  let crossed = 0;
  for (const gap of gaps) {
    const g = gap.center - s; // gap centre in the window
    if (g < centre - WINDOW) {
      crossed++;
      continue;
    }
    if (g <= centre + WINDOW) {
      // Ride the empty band across, slanting from its upper half to its lower half.
      const t = (centre - g + WINDOW) / (2 * WINDOW);
      const lock = Math.min(clamp01(t / 0.12), clamp01((1 - t) / 0.12));
      const across = ease(clamp01((t - 0.15) / 0.7));
      const slant = Math.min(45, Math.max(0, gap.size / 2 - size / 2 - 12));
      return {
        x: sideX(crossed) + (sideX(crossed + 1) - sideX(crossed)) * across,
        y: track + (g - size / 2 + slant * (2 * across - 1) - track) * lock,
      };
    }
    break;
  }
  return { x: sideX(crossed), y: track };
}

/**
 * The chrome ball from the film. It rides a side margin as the page scrolls, crosses
 * diagonally through the empty bands between sections, and draws its route on the page.
 * Scrolling back up retraces the same route and erases the line behind it.
 * It never takes clicks. A mirror ball looks the same from every angle, so it only moves.
 */
export function ScrollBall() {
  const ball = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    const element = ball.current;
    const svg = trail.current;
    const path = line.current;
    if (!element || !svg || !path) return;
    let layout: Layout = { gaps: [], vh: innerHeight, vw: 0, room: 0, size: 40 };
    let lengths: number[] = [];
    let total = 0;
    let lastY = Number.NaN;
    let frame = 0;

    /** The whole route in page coordinates, sampled every few pixels of scroll. */
    const buildRoute = () => {
      const size = element.offsetWidth || 40;
      layout = {
        size,
        vh: innerHeight,
        vw: document.documentElement.clientWidth,
        room: document.documentElement.scrollHeight - innerHeight,
        gaps: measureGaps(size + 24),
      };
      const points: string[] = [];
      lengths = [];
      total = 0;
      let px = 0;
      let py = 0;
      for (let s = 0, i = 0; s <= layout.room + STEP; s += STEP, i++) {
        const at = ballAt(Math.min(s, layout.room), layout);
        const x = at.x + size / 2;
        const y = at.y + Math.min(s, layout.room) + size / 2;
        if (i > 0) total += Math.hypot(x - px, y - py);
        lengths.push(total);
        points.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
        px = x;
        py = y;
      }
      svg.setAttribute("width", String(layout.vw));
      svg.setAttribute("height", String(document.documentElement.scrollHeight));
      path.setAttribute("d", points.join(""));
      path.style.strokeDasharray = `0 ${total + 10}`;
    };

    const draw = () => {
      frame = 0;
      const s = Math.min(Math.max(0, scrollY), layout.room);
      const at = ballAt(s, layout);
      // A little stretch while moving fast, like the ball in the film.
      const speed = Number.isNaN(lastY) ? 0 : Math.abs(at.y + s - lastY);
      lastY = at.y + s;
      const stretch = Math.min(0.12, speed / 900);
      element.style.transform = `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) scale(${(1 - stretch * 0.5).toFixed(3)}, ${(1 + stretch).toFixed(3)})`;
      // Reveal the route up to the ball; going back up erases it.
      const index = s / STEP;
      const low = Math.floor(index);
      const from = lengths[low] ?? total;
      const shown = from + ((lengths[low + 1] ?? total) - from) * (index - low);
      path.style.strokeDasharray = `${shown.toFixed(1)} ${total + 10}`;
      if (stretch > 0.001) frame = requestAnimationFrame(draw); // settle the stretch
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    let measureTimer = 0;
    const rebuild = () => {
      clearTimeout(measureTimer);
      measureTimer = window.setTimeout(() => {
        buildRoute();
        wake();
      }, 150);
    };

    buildRoute();
    draw();
    element.dataset.ready = "true";
    svg.dataset.ready = "true";
    // Layout settles as fonts and images load and a "Show more" opens: rebuild the route.
    const observer = new ResizeObserver(rebuild);
    observer.observe(document.body);
    document.fonts?.ready.then(rebuild);
    addEventListener("load", rebuild);
    const settle = window.setTimeout(rebuild, 1500);
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", rebuild);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(measureTimer);
      clearTimeout(settle);
      observer.disconnect();
      removeEventListener("load", rebuild);
      removeEventListener("scroll", wake);
      removeEventListener("resize", rebuild);
    };
  }, []);

  return (
    <>
      <svg ref={trail} className="scroll-trail" aria-hidden="true" focusable="false">
        <path ref={line} />
      </svg>
      <div ref={ball} className="scroll-ball" aria-hidden="true" />
    </>
  );
}
