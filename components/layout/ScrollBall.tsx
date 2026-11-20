"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TOP = 96; // the sticky header's height, plus a little
const BOTTOM = 84; // clears the back-to-top button
const EDGE = 7; // ball distance from the window edge (4 on phones)
const edge = (vw: number) => (vw < 600 ? 4 : EDGE);
const LEAD = 0.62; // the ink tip sits this far down the window
const STEP = 5; // spacing of the sampled route, in px of path

type Point = { x: number; y: number };
type Rect = { left: number; top: number; right: number; bottom: number };

/** What each page's line annotates, top to bottom. */
type Note = {
  selector: string;
  mark: "loop" | "underline";
  text?: string; // only the match containing this text
  pad?: [number, number];
  every?: boolean; // mark every match, not just the first
};
const NOTES: Record<string, Note[]> = {
  "/": [
    { selector: ".hero-plain", mark: "loop" },
    { selector: ".contribution-total strong", mark: "underline" },
    { selector: "#work-title", mark: "loop", pad: [20, 10] },
    { selector: "#systems-title", mark: "loop", pad: [20, 10] },
    { selector: ".home-discovery h2", mark: "loop", pad: [20, 10] },
    { selector: ".footer-copy h2 span", mark: "underline" },
  ],
  "/projects": [
    { selector: ".projects-heading h1", mark: "underline" },
    { selector: ".collection-section-heading h2", mark: "loop", pad: [20, 10], every: true },
  ],
  "/contact": [{ selector: ".contact-heading h1", mark: "underline" }],
};

/** Where an element rests in the page (ignores transforms such as reveal animations). */
function restRect(element: Element): Rect {
  if (!(element instanceof HTMLElement)) return docRect(element);
  let top = 0;
  let left = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
    left += node.offsetLeft;
  }
  return { left, top, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
}

/** The box of an element's text (not its block), at its resting position. */
function textRect(element: Element): Rect {
  const range = document.createRange();
  range.selectNodeContents(element);
  const text = range.getBoundingClientRect();
  const drawn = element.getBoundingClientRect();
  if (text.width < 2) return restRect(element);
  const shift = restRect(element).top - (drawn.top + scrollY); // undo reveal offsets
  return {
    left: text.left,
    right: text.right,
    top: text.top + scrollY + shift,
    bottom: text.bottom + scrollY + shift,
  };
}

const docRect = (element: Element): Rect => {
  const box = element.getBoundingClientRect();
  return { left: box.left, right: box.right, top: box.top + scrollY, bottom: box.bottom + scrollY };
};

/** Things the ball must not cover: text, media, controls, and anything drawn as a box
 *  (a card, panel or button with a background, border or shadow). Both where each one is
 *  drawn now and where it rests count, so reveal animations cannot hide it. */
function contentRects(vw: number): Rect[] {
  const rects: Rect[] = [];
  const always = /^(H1|H2|H3|H4|P|A|BUTTON|IMG|PICTURE|VIDEO|CANVAS|LI|FIGURE|LABEL|INPUT|SELECT|TEXTAREA|BLOCKQUOTE|PRE|TABLE|SVG)$/;
  for (const element of document.body.querySelectorAll("*")) {
    if (element.closest('[aria-hidden="true"], .scroll-trail, .site-header, .scroll-ball, .scroll-nib')) continue;
    const box = element.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const style = getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none" || style.position === "fixed") continue;
    if (!always.test(element.tagName.toUpperCase())) {
      // Plain boxes count only when drawn, and full-width ones are page backgrounds.
      const drawn =
        (style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent") ||
        style.backgroundImage !== "none" ||
        parseFloat(style.borderTopWidth) + parseFloat(style.borderLeftWidth) > 0 ||
        style.boxShadow !== "none";
      if (!drawn || box.width > vw * 0.95) continue;
    }
    const seen = docRect(element);
    const rest = restRect(element);
    rects.push({
      left: Math.min(seen.left, rest.left),
      right: Math.max(seen.right, rest.right),
      top: Math.min(seen.top, rest.top),
      bottom: Math.max(seen.bottom, rest.bottom),
    });
  }
  return rects;
}

/** Top and bottom (window coordinates) covering where an element is drawn now and where it
 *  rests: reveal animations start shifted and only settle once scrolled to. */
function span(element: Element): [number, number] {
  const box = element.getBoundingClientRect();
  if (!(element instanceof HTMLElement)) return [box.top, box.bottom];
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null)
    top += node.offsetTop;
  top -= scrollY;
  return [Math.min(box.top, top), Math.max(box.bottom, top + element.offsetHeight)];
}

type Section = { top: number; bottom: number; contentTop: number; contentBottom: number };

/** Top-level blocks (sections, the footer) with the extent of their actual content, in page
 *  coordinates. Decorative (aria-hidden) and full-width background layers do not count. */
function sections(): Section[] {
  const shell = document.querySelector(".portfolio-shell") ?? document.querySelector("main");
  if (!shell) return [];
  const list = [...shell.children, document.querySelector("footer.site-footer")].filter(
    (el): el is Element =>
      !!el && getComputedStyle(el).position !== "fixed" && el.getBoundingClientRect().height > 4,
  );
  return list.map((block) => {
    const box = block.getBoundingClientRect();
    let top = Infinity;
    let bottom = -Infinity;
    const take = (element: Element) => {
      for (const node of [element, ...element.querySelectorAll("*")]) {
        if (node.closest('[aria-hidden="true"]')) continue;
        const b = node.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) continue;
        const [t, u] = span(node);
        top = Math.min(top, t);
        bottom = Math.max(bottom, u);
      }
    };
    const walk = (node: Element, depth: number) => {
      for (const child of node.children) {
        const style = getComputedStyle(child);
        if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden") continue;
        if (child.getAttribute("aria-hidden") === "true") continue;
        const b = child.getBoundingClientRect();
        if (b.height < 4 || b.width < 4) continue;
        if (style.position === "absolute" && b.width >= box.width * 0.9) walk(child, depth);
        else if (depth >= 2 || b.width < box.width * 0.98 || style.position === "absolute") take(child);
        else walk(child, depth + 1);
      }
    };
    walk(block, 0);
    const y = (v: number, fallback: number) => (Number.isFinite(v) ? v + scrollY : fallback);
    return {
      top: box.top + scrollY,
      bottom: box.bottom + scrollY,
      contentTop: y(top, box.top + scrollY),
      contentBottom: y(bottom, box.bottom + scrollY),
    };
  });
}

/** A hand-drawn loop around a box: a slightly wobbly ellipse that overshoots its start.
 *  It starts on the side the ink arrives from. */
function loop(r: Rect, fromLeft: boolean, [padX, padY]: [number, number] = [22, 14]): Point[] {
  const cx = (r.left + r.right) / 2;
  const cy = (r.top + r.bottom) / 2;
  const rx = (r.right - r.left) / 2 + padX;
  const ry = (r.bottom - r.top) / 2 + padY;
  const points: Point[] = [];
  const turns = 1.12;
  for (let a = 0; a <= Math.PI * 2 * turns; a += 0.06) {
    const angle = fromLeft ? Math.PI + a : -a; // start on the near side, go over the top
    const wobble = 1 + 0.035 * Math.sin(a * 3 + 0.8) - 0.04 * (a / (Math.PI * 2));
    points.push({
      x: cx + rx * wobble * Math.cos(angle),
      y: cy + ry * wobble * Math.sin(-angle) - 3 * Math.sin(a / 2),
    });
  }
  return points;
}

/** A quick underline that starts short of the text and hooks up at the end.
 *  It is drawn from the side the ink arrives from. */
function underline(r: Rect, fromLeft: boolean): Point[] {
  const points: Point[] = [];
  // Just under the letters: a text box runs well below the glyphs of large display type.
  const y = r.top + (r.bottom - r.top) * 0.8 + 4;
  const from = r.left - 10;
  const to = r.right + 14;
  for (let t = 0; t <= 1; t += 0.04) {
    const u = fromLeft ? t : 1 - t;
    points.push({ x: from + (to - from) * u, y: y + 4 * Math.sin(Math.PI * t) - (t > 0.9 ? (t - 0.9) * 90 : 0) });
  }
  return points;
}

/** Smooth curve through anchor points (Catmull-Rom), sampled densely. */
function spline(anchors: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    const p0 = anchors[Math.max(0, i - 1)];
    const p1 = anchors[i];
    const p2 = anchors[i + 1];
    const p3 = anchors[Math.min(anchors.length - 1, i + 2)];
    const steps = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 8));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(anchors[anchors.length - 1]);
  return out;
}

/** Resample a polyline to even spacing, so length maps cleanly to scroll. */
function resample(points: Point[]): Point[] {
  const out: Point[] = [points[0]];
  let carry = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (length === 0) continue;
    let at = STEP - carry;
    while (at <= length) {
      out.push({ x: a.x + ((b.x - a.x) * at) / length, y: a.y + ((b.y - a.y) * at) / length });
      at += STEP;
    }
    carry = length - (at - STEP);
  }
  return out;
}

/** The whole ink route for this page, in page coordinates. The ink runs down a side margin,
 *  comes in level with whatever it annotates and goes back out, and sweeps through the empty
 *  band between sections to the next section's margin. Corners are smoothed into pen curves. */
function route(vw: number, size: number, startLeft: boolean, notes: Note[]): Point[] {
  const parts = sections();
  if (!parts.length) return [];
  const lane = (left: boolean) => (left ? edge(vw) + size / 2 : vw - edge(vw) - size / 2);
  const marks = notes
    .flatMap((note) => {
      const found = [...document.querySelectorAll(note.selector)].filter(
        (el) => !note.text || el.textContent?.includes(note.text),
      );
      return (note.every ? found : found.slice(0, 1)).map((element) => {
        const r = textRect(element);
        return r.right - r.left < 2 ? null : { r, mark: note.mark, pad: note.pad };
      });
    })
    .filter((m): m is { r: Rect; mark: Note["mark"]; pad: Note["pad"] } => !!m)
    .sort((a, b) => a.r.top - b.r.top);

  // Each section uses the margin nearest to what it annotates; otherwise sides alternate.
  let previous = !startLeft;
  const sides = parts.map((part, i) => {
    const first = marks.find((m) => m.r.top >= part.top && m.r.top < part.bottom);
    const side = first ? (first.r.left + first.r.right) / 2 < vw / 2 : i === 0 ? startLeft : !previous;
    previous = side;
    return side;
  });

  const dense: Point[] = [];
  let run: Point[] = [];
  const end = () => {
    if (run.length > 1) dense.push(...spline(run));
    run = run.slice(-1);
  };
  run.push({ x: lane(sides[0]), y: parts[0].top + TOP + 20 });

  parts.forEach((part, i) => {
    const left = sides[i];
    const x = lane(left);
    const here = marks.filter((n) => n.r.top >= part.top && n.r.top < part.bottom);
    for (const [k, m] of here.entries()) {
      const drawn = m.mark === "loop" ? loop(m.r, left, m.pad) : underline(m.r, left);
      const first = drawn[0];
      const last = drawn[drawn.length - 1];
      run.push({ x, y: Math.max(run[run.length - 1].y + 10, first.y - 70) });
      run.push({ x: (x + first.x) / 2, y: first.y });
      run.push(first);
      end();
      dense.push(...drawn);
      // The very last mark on the page ends the line.
      if (!parts[i + 1] && k === here.length - 1) {
        run = [];
        return;
      }
      // Head back to the margin. After an underline, return just beneath it (above the
      // text that follows) instead of cutting diagonally through that text.
      run =
        m.mark === "underline"
          ? [
              last,
              { x: last.x + (left ? -14 : 14), y: last.y + 12 },
              { x: x + (left ? 20 : -20), y: last.y + 14 },
              { x, y: last.y + 70 },
            ]
          : [last, { x: (x + last.x) / 2, y: last.y + 24 }, { x, y: last.y + 80 }];
    }
    const next = parts[i + 1];
    if (!next) {
      run.push({ x, y: part.contentBottom });
      return;
    }
    // Sweep through the empty band to the next section's margin.
    const band = Math.max(0, next.contentTop - part.contentBottom);
    const mid = part.contentBottom + band / 2;
    const swing = Math.min(36, Math.max(0, band / 2 - 8));
    const toX = lane(sides[i + 1]);
    const top = part.contentBottom + 4;
    const bottom = next.contentTop - 4;
    run.push({ x, y: Math.max(run[run.length - 1].y + 10, top) });
    // When the next section opens with an annotation, lead straight into it instead.
    const opensWithMark = marks.some((m) => m.r.top >= next.top && m.r.top < next.contentTop + 260);
    if (toX === x && !opensWithMark) {
      // Staying on this side: swing out into the band and back, like a pen loop.
      run.push({ x: x + (x < vw / 2 ? 1 : -1) * vw * 0.22, y: mid });
    } else if (toX !== x) {
      run.push({ x: x + (toX - x) * 0.25, y: mid - swing * 0.6 });
      run.push({ x: x + (toX - x) * 0.75, y: mid + swing * 0.6 });
    }
    run.push({ x: toX, y: Math.min(bottom, mid + swing + 20) });
  });
  end();
  return dense.length > 1 ? resample(dense) : [];
}

const overlaps = (a: Rect, b: Rect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * An ink line drawn down the page as you scroll, in the spirit of a pen annotating the
 * page: it swings through the margins and the gaps between sections, and circles or
 * underlines a few key things. Scrolling back up erases it. The chrome ball from the film
 * rides the tip in step with the scroll; over content it shrinks to a nib so it never
 * covers text, and grows back in free space.
 */
export function ScrollBall() {
  const ball = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const rebuildRef = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    const element = ball.current;
    const svg = trail.current;
    const path = line.current;
    if (!element || !svg || !path) return;
    let points: Point[] = [];
    let reach: number[] = []; // furthest page y reached up to each point
    let clear: boolean[] = []; // the ball fits there without covering content
    let lengths: number[] = []; // ink length up to each point, in px
    let total = 0;
    let frame = 0;

    const build = () => {
      // Phones get no ink line: skip the measuring work entirely.
      if (matchMedia("(max-width: 767px)").matches) {
        points = [];
        svg.setAttribute("height", "0");
        return;
      }
      // Collapse the drawing area first: it is absolutely positioned and would otherwise keep
      // the previous page's height, stretching a shorter page.
      svg.setAttribute("height", "0");
      const vw = document.documentElement.clientWidth;
      const size = element.offsetWidth || 40;
      points = route(vw, size, location.pathname === "/", NOTES[location.pathname] ?? []);
      const blocked = contentRects(vw);
      let furthest = -Infinity;
      reach = points.map((p) => (furthest = Math.max(furthest, p.y)));
      clear = points.map((p) => {
        const pad = size / 2 + (vw < 600 ? 1 : 6);
        const box = { left: p.x - pad, right: p.x + pad, top: p.y - pad, bottom: p.y + pad };
        return box.left > 0 && box.right < vw && !blocked.some((r) => overlaps(box, r));
      });
      svg.setAttribute("width", String(vw));
      svg.setAttribute("height", String(document.documentElement.scrollHeight));
      const d = points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
      path.setAttribute("d", d);
      // Reveal in real pixel lengths (from the same rounded points the path uses), so the end
      // of the ink and the ball are always at the same point.
      lengths = [0];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        lengths.push(
          lengths[i - 1] +
            Math.hypot(+b.x.toFixed(1) - +a.x.toFixed(1), +b.y.toFixed(1) - +a.y.toFixed(1)),
        );
      }
      total = lengths[lengths.length - 1] ?? 0;
    };

    const draw = () => {
      frame = 0;
      if (!points.length) return;
      // Reveal the ink until it reaches LEAD of the way down the window.
      const room = document.documentElement.scrollHeight - innerHeight;
      const limit = scrollY >= room - 2 ? Infinity : scrollY + innerHeight * LEAD;
      let low = 0;
      let high = reach.length - 1;
      while (low < high) {
        const mid = (low + high + 1) >> 1;
        if (reach[mid] <= limit) low = mid;
        else high = mid - 1;
      }
      const index = reach[0] <= limit ? low : 0;
      path.style.strokeDasharray = `${(lengths[index] ?? 0).toFixed(2)} ${(total + 10).toFixed(0)}`;
      const p = points[index];
      const y = p.y - scrollY;
      const size = element.offsetWidth || 40;
      const free = clear[index] && y > TOP + size / 2 && y < innerHeight - BOTTOM - size / 2;
      element.style.transform = `translate3d(${(p.x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px, 0)`;
      element.dataset.free = String(free);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    let timer = 0;
    const rebuild = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        build();
        wake();
      }, 150);
    };

    rebuildRef.current = rebuild;
    build();
    draw();
    element.dataset.ready = "true";
    svg.dataset.ready = "true";
    // Layout settles as fonts and images load and a "Show more" opens: redraw the route.
    const observer = new ResizeObserver(rebuild);
    observer.observe(document.body);
    document.fonts?.ready.then(rebuild);
    addEventListener("load", rebuild);
    const settle = window.setTimeout(rebuild, 1500);
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", rebuild);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearTimeout(settle);
      observer.disconnect();
      removeEventListener("load", rebuild);
      removeEventListener("scroll", wake);
      removeEventListener("resize", rebuild);
    };
  }, []);

  // The ball stays mounted across page changes: redraw the route for the new page.
  useEffect(() => {
    trail.current?.setAttribute("height", "0");
    rebuildRef.current();
  }, [pathname]);

  return (
    <>
      <svg ref={trail} className="scroll-trail" aria-hidden="true" focusable="false">
        <path ref={line} />
      </svg>
      {/* The outer box is positioned exactly on the ink tip; only the inner picture scales,
          so shrinking never shifts where the ball is drawn. */}
      <div ref={ball} className="scroll-ball" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
