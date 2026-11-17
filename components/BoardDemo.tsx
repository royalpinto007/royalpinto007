"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Circle,
  Diamond,
  Download,
  Eraser,
  MousePointer2,
  RotateCcw,
  Square,
  Type,
} from "lucide-react";
import { RoughGenerator } from "roughjs/bin/generator";

/*
 * A small working canvas. Before conversion it behaves like a Freeform board;
 * after conversion it is drawn the way Excalidraw draws (rough.js, Excalifont),
 * with working tools, bound arrows, inline text editing and a download that
 * opens in Excalidraw. It demonstrates BoardEject's output; it does not parse
 * Freeform files.
 */

type Kind = "rectangle" | "diamond" | "ellipse" | "text";
type Tool =
  | "select"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "text"
  | "eraser";
type Shape = {
  id: string;
  kind: Kind;
  label: string;
  x: number;
  y: number;
  fill: string;
  seed: number;
};
type Link = { id: string; from: string; to: string; seed: number };
type LayoutKey = "wide" | "compact";
type Scene = { shapes: Shape[]; links: Link[] };

const W = 200;
const H = 104;
const TEXT_H = 56;
const MAX_SHAPES = 12;
const stroke = "#1e1e1e";
const fills = ["#a5d8ff", "#ffc9c9", "#ffec99", "#b2f2bb"];
const freeformColor: Record<string, string> = {
  "#a5d8ff": "#cee4f5",
  "#ffc9c9": "#f3c9d7",
  "#ffec99": "#f6ddbd",
  "#b2f2bb": "#cdeccf",
};

/* Phones get a taller board so shapes and labels stay large enough to drag. */
const layouts: Record<
  LayoutKey,
  {
    view: { w: number; h: number };
    canvas: { top: number; bottom: number; left: number; right: number };
    at: Record<string, { x: number; y: number }>;
  }
> = {
  wide: {
    view: { w: 860, h: 460 },
    canvas: { top: 84, bottom: 444, left: 16, right: 844 },
    at: {
      idea: { x: 70, y: 210 },
      plan: { x: 330, y: 104 },
      real: { x: 590, y: 250 },
    },
  },
  compact: {
    view: { w: 520, h: 640 },
    canvas: { top: 84, bottom: 624, left: 16, right: 504 },
    at: {
      idea: { x: 44, y: 120 },
      plan: { x: 276, y: 280 },
      real: { x: 44, y: 450 },
    },
  },
};

function initialScene(key: LayoutKey): Scene & { key: LayoutKey } {
  const at = layouts[key].at;
  return {
    key,
    shapes: [
      {
        id: "idea",
        kind: "rectangle",
        label: "An idea",
        fill: fills[0],
        seed: 1931,
        ...at.idea,
      },
      {
        id: "plan",
        kind: "rectangle",
        label: "A plan",
        fill: fills[1],
        seed: 4127,
        ...at.plan,
      },
      {
        id: "real",
        kind: "rectangle",
        label: "Something real",
        fill: fills[2],
        seed: 7703,
        ...at.real,
      },
    ],
    links: [
      { id: "a1", from: "idea", to: "plan", seed: 2281 },
      { id: "a2", from: "plan", to: "real", seed: 5519 },
    ],
  };
}

const generator = new RoughGenerator();
const sketchCache = new Map<string, ReturnType<typeof generator.toPaths>>();

function roundedRect(w: number, h: number, r: number) {
  return `M${r} 0L${w - r} 0Q${w} 0 ${w} ${r}L${w} ${h - r}Q${w} ${h} ${w - r} ${h}L${r} ${h}Q0 ${h} 0 ${h - r}L0 ${r}Q0 0 ${r} 0Z`;
}

/** Hand-drawn outline and hachure fill for a shape, cached per kind and seed. */
function sketch(s: Shape) {
  const cacheKey = `${s.kind}-${s.seed}-${s.fill}`;
  const hit = sketchCache.get(cacheKey);
  if (hit) return hit;
  const o = {
    seed: s.seed,
    stroke,
    strokeWidth: 2,
    roughness: 1,
    fill: s.fill,
    fillStyle: "hachure",
    hachureGap: 8,
    fillWeight: 1.6,
  };
  const drawable =
    s.kind === "ellipse"
      ? generator.ellipse(W / 2, H / 2, W, H, o)
      : s.kind === "diamond"
        ? generator.polygon(
            [
              [W / 2, 0],
              [W, H / 2],
              [W / 2, H],
              [0, H / 2],
            ],
            o,
          )
        : generator.path(roundedRect(W, H, 18), o);
  const paths = generator.toPaths(drawable);
  sketchCache.set(cacheKey, paths);
  return paths;
}

const heightOf = (s: Shape) => (s.kind === "text" ? TEXT_H : H);
const tiltOf = (s: Shape) => ((s.seed % 11) - 5) * 1.2;

/** Where the line from a shape's centre towards a point leaves its outline. */
function edgePoint(s: Shape, toward: { x: number; y: number }, gap: number) {
  const h = heightOf(s);
  const cx = s.x + W / 2;
  const cy = s.y + h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  const boxy = s.kind === "rectangle" || s.kind === "text";
  const rx = boxy ? W / 2 : W / 2.4;
  const ry = boxy ? h / 2 : h / 2.4;
  const scale = 1 / Math.max(Math.abs(dx) / rx, Math.abs(dy) / ry, 1e-6);
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: cx + dx * scale + (dx / len) * gap,
    y: cy + dy * scale + (dy / len) * gap,
  };
}

function arrowGeometry(a: Shape, b: Shape) {
  const ca = { x: a.x + W / 2, y: a.y + heightOf(a) / 2 };
  const cb = { x: b.x + W / 2, y: b.y + heightOf(b) / 2 };
  const start = edgePoint(a, cb, 8);
  const end = edgePoint(b, ca, 8);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = (side: number) => ({
    x: end.x - 18 * Math.cos(angle + side * 0.45),
    y: end.y - 18 * Math.sin(angle + side * 0.45),
  });
  return { start, end, left: head(1), right: head(-1) };
}

const compactQuery = "(max-width: 640px)";
const subscribeCompact = (onChange: () => void) => {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const tools: {
  id: Tool;
  label: string;
  shortcut: string;
  Icon: typeof Square;
}[] = [
  { id: "select", label: "Select", shortcut: "V", Icon: MousePointer2 },
  { id: "rectangle", label: "Rectangle", shortcut: "R", Icon: Square },
  { id: "diamond", label: "Diamond", shortcut: "D", Icon: Diamond },
  { id: "ellipse", label: "Ellipse", shortcut: "O", Icon: Circle },
  { id: "arrow", label: "Arrow", shortcut: "A", Icon: ArrowRight },
  { id: "text", label: "Text", shortcut: "T", Icon: Type },
  { id: "eraser", label: "Eraser", shortcut: "E", Icon: Eraser },
];
const placesShape = (t: Tool): t is Kind =>
  t === "rectangle" || t === "diamond" || t === "ellipse" || t === "text";

export function BoardDemo({ name, href }: { name: string; href: string }) {
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const key: LayoutKey = compact ? "compact" : "wide";
  const L = layouts[key];
  const [stored, setStored] = useState(() => initialScene("wide"));
  // Crossing the phone breakpoint starts the sample board again in that layout.
  const scene = stored.key === key ? stored : initialScene(key);
  const { shapes, links } = scene;
  const setScene = useCallback(
    (update: (s: Scene) => Scene) =>
      setStored((cur) => ({
        key,
        ...update(cur.key === key ? cur : initialScene(key)),
      })),
    [key],
  );

  const [converted, setConverted] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [arrowFrom, setArrowFrom] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const counter = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{
    id: string;
    dx: number;
    dy: number;
    startX: number;
    startY: number;
    moved: boolean;
    wasSelected: boolean;
  } | null>(null);

  const byId = Object.fromEntries(shapes.map((s) => [s.id, s]));

  const toCanvas = (clientX: number, clientY: number) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    return { x: p.x, y: p.y };
  };
  const clampTo = (s: Shape, x: number, y: number) => ({
    x: Math.min(Math.max(x, L.canvas.left), L.canvas.right - W),
    y: Math.min(Math.max(y, L.canvas.top), L.canvas.bottom - heightOf(s)),
  });
  const moveTo = (id: string, x: number, y: number) =>
    setScene((s) => ({
      ...s,
      shapes: s.shapes.map((sh) =>
        sh.id === id ? { ...sh, ...clampTo(sh, x, y) } : sh,
      ),
    }));
  const remove = (id: string) => {
    setScene((s) => ({
      shapes: s.shapes.filter((sh) => sh.id !== id),
      links: s.links.filter((l) => l.from !== id && l.to !== id),
    }));
    setSelected(null);
    setEditing(null);
  };

  const startEdit = (id: string, label = byId[id]?.label ?? "") => {
    setSelected(id);
    setEditing(id);
    setDraft(label);
  };
  const commitEdit = () => {
    if (!editing) return;
    const shape = byId[editing];
    const text = draft.trim().slice(0, 24);
    setEditing(null);
    if (!shape) return;
    if (!text && shape.kind === "text") return remove(shape.id);
    setScene((s) => ({
      ...s,
      shapes: s.shapes.map((sh) =>
        sh.id === shape.id ? { ...sh, label: text } : sh,
      ),
    }));
  };
  const cancelEdit = () => {
    const shape = editing ? byId[editing] : null;
    setEditing(null);
    if (shape && shape.kind === "text" && !shape.label) remove(shape.id);
  };

  const addShape = (kind: Kind, at: { x: number; y: number }) => {
    if (shapes.length >= MAX_SHAPES) return;
    counter.current += 1;
    const n = counter.current;
    const fresh: Shape = {
      id: `new-${n}`,
      kind,
      label: "",
      x: 0,
      y: 0,
      fill: kind === "text" ? "transparent" : fills[(n + 2) % fills.length],
      seed: 1009 + n * 7919,
    };
    const shape = {
      ...fresh,
      ...clampTo(fresh, at.x - W / 2, at.y - heightOf(fresh) / 2),
    };
    setScene((s) => ({ ...s, shapes: [...s.shapes, shape] }));
    setTool("select");
    startEdit(shape.id, "");
  };
  const connect = (from: string, to: string) => {
    if (from === to) return;
    counter.current += 1;
    const n = counter.current;
    setScene((s) =>
      s.links.some(
        (l) =>
          (l.from === from && l.to === to) || (l.from === to && l.to === from),
      )
        ? s
        : {
            ...s,
            links: [
              ...s.links,
              { id: `link-${n}`, from, to, seed: 3001 + n * 613 },
            ],
          },
    );
  };

  const chooseTool = (next: Tool) => {
    setTool(next);
    setArrowFrom(null);
    if (next !== "select") setSelected(null);
  };

  // Pointer handlers cancel the browser's default mousedown so it cannot move
  // focus away from a text editor that this same press has just opened.
  const onCanvasPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest(".board-shape")) return;
    event.preventDefault();
    if (editing) commitEdit();
    setSelected(null);
    setArrowFrom(null);
    if (converted && placesShape(tool))
      addShape(tool, toCanvas(event.clientX, event.clientY));
  };
  const onCanvasDoubleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!converted || tool !== "select") return;
    if ((event.target as Element).closest(".board-shape")) return;
    addShape("text", toCanvas(event.clientX, event.clientY));
  };

  const onShapePointerDown = (event: PointerEvent<SVGGElement>, s: Shape) => {
    event.stopPropagation();
    if (editing === s.id) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    if (editing) commitEdit();
    if (converted && tool === "eraser") return remove(s.id);
    // As in Excalidraw, an active shape tool draws even on top of a shape.
    if (converted && placesShape(tool))
      return addShape(tool, toCanvas(event.clientX, event.clientY));
    if (converted && tool === "arrow") {
      if (!arrowFrom) setArrowFrom(s.id);
      else {
        connect(arrowFrom, s.id);
        setArrowFrom(null);
        setTool("select");
        setSelected(s.id);
      }
      return;
    }
    if (converted && tool !== "select") setTool("select");
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = toCanvas(event.clientX, event.clientY);
    drag.current = {
      id: s.id,
      dx: p.x - s.x,
      dy: p.y - s.y,
      startX: p.x,
      startY: p.y,
      moved: false,
      wasSelected: selected === s.id,
    };
    setSelected(s.id);
  };
  const onShapePointerMove = (event: PointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = toCanvas(event.clientX, event.clientY);
    if (!d.moved && Math.hypot(p.x - d.startX, p.y - d.startY) < 4) return;
    d.moved = true;
    moveTo(d.id, p.x - d.dx, p.y - d.dy);
  };
  const onShapePointerUp = () => {
    const d = drag.current;
    drag.current = null;
    // A second tap on an already selected shape edits it, as on touch screens.
    if (d && !d.moved && d.wasSelected) startEdit(d.id);
  };

  const onBoardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (editing || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "A") return;
    if (converted && !event.shiftKey) {
      const t = tools.find((x) => x.shortcut === event.key.toUpperCase());
      if (t) {
        event.preventDefault();
        return chooseTool(t.id);
      }
    }
    if (selected && (event.key === "Delete" || event.key === "Backspace")) {
      event.preventDefault();
      remove(selected);
    }
  };
  const onShapeKey = (event: KeyboardEvent<SVGGElement>, s: Shape) => {
    const step = event.shiftKey ? 40 : 10;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[event.key]) {
      event.preventDefault();
      setSelected(s.id);
      moveTo(s.id, s.x + moves[event.key][0], s.y + moves[event.key][1]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      startEdit(s.id);
    } else if (event.key === "Escape") {
      setSelected(null);
    }
  };

  const clearInteraction = () => {
    setTool("select");
    setSelected(null);
    setEditing(null);
    setArrowFrom(null);
  };
  const toggle = () => {
    setConverted(!converted);
    clearInteraction();
  };
  const reset = () => {
    setStored(initialScene(key));
    clearInteraction();
  };

  const arrows = links
    .filter((l) => byId[l.from] && byId[l.to])
    .map((l) => {
      const g = arrowGeometry(byId[l.from], byId[l.to]);
      const o = { seed: l.seed, stroke, strokeWidth: 2, roughness: 1 };
      const line = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        generator.toPaths(generator.line(a.x, a.y, b.x, b.y, o));
      return {
        link: l,
        ...g,
        paths: [
          ...line(g.start, g.end),
          ...line(g.left, g.end),
          ...line(g.right, g.end),
        ],
      };
    });

  const download = () => {
    const base = {
      angle: 0,
      strokeColor: stroke,
      fillStyle: "hachure",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      frameId: null,
      version: 1,
      versionNonce: 1,
      isDeleted: false,
      updated: 1,
      link: null,
      locked: false,
    };
    const arrowRefs = (id: string) =>
      arrows
        .filter((a) => a.link.from === id || a.link.to === id)
        .map((a) => ({ type: "arrow", id: a.link.id }));
    const textElement = (s: Shape, containerId: string | null) => ({
      ...base,
      id: containerId ? `${s.id}-text` : s.id,
      type: "text",
      x: s.x + 10,
      y: s.y + heightOf(s) / 2 - 12.5,
      width: W - 20,
      height: 25,
      backgroundColor: "transparent",
      roundness: null,
      seed: s.seed + 1,
      boundElements: containerId ? null : arrowRefs(s.id),
      text: s.label,
      originalText: s.label,
      fontSize: 20,
      fontFamily: 5,
      textAlign: "center",
      verticalAlign: "middle",
      containerId,
      autoResize: true,
      lineHeight: 1.25,
    });
    const elements = [
      ...shapes.flatMap((s) =>
        s.kind === "text"
          ? [textElement(s, null)]
          : [
              {
                ...base,
                id: s.id,
                type: s.kind,
                x: s.x,
                y: s.y,
                width: W,
                height: H,
                backgroundColor: s.fill,
                roundness:
                  s.kind === "ellipse"
                    ? null
                    : { type: s.kind === "rectangle" ? 3 : 2 },
                seed: s.seed,
                boundElements: [
                  ...(s.label ? [{ type: "text", id: `${s.id}-text` }] : []),
                  ...arrowRefs(s.id),
                ],
              },
              ...(s.label ? [textElement(s, s.id)] : []),
            ],
      ),
      ...arrows.map((a) => ({
        ...base,
        id: a.link.id,
        type: "arrow",
        x: a.start.x,
        y: a.start.y,
        width: Math.abs(a.end.x - a.start.x),
        height: Math.abs(a.end.y - a.start.y),
        backgroundColor: "transparent",
        roundness: { type: 2 },
        seed: a.link.seed,
        boundElements: null,
        points: [
          [0, 0],
          [a.end.x - a.start.x, a.end.y - a.start.y],
        ],
        lastCommittedPoint: null,
        startBinding: { elementId: a.link.from, focus: 0, gap: 8 },
        endBinding: { elementId: a.link.to, focus: 0, gap: 8 },
        startArrowhead: null,
        endArrowhead: "arrow",
        elbowed: false,
      })),
    ];
    const file = {
      type: "excalidraw",
      version: 2,
      source: "https://royalpinto007.com",
      elements,
      appState: { viewBackgroundColor: "#ffffff", gridSize: 20 },
      files: {},
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(file, null, 2)], {
        type: "application/vnd.excalidraw+json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "boardeject-sample.excalidraw";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const editingShape = editing ? byId[editing] : null;
  const shapeCount = shapes.filter((s) => s.kind !== "text").length;
  const hint = !converted
    ? "Move the shapes, then convert. Positions carry over."
    : tool === "arrow"
      ? arrowFrom
        ? "Now tap the shape to connect to."
        : "Tap the shape the arrow starts from."
      : tool === "eraser"
        ? "Tap a shape to remove it."
        : tool === "text"
          ? "Tap the canvas to add text."
          : tool !== "select"
            ? `Tap the canvas to place a ${tool}.`
            : "Drag a shape, tap it twice to edit, or pick a tool.";

  return (
    <div
      className="board-demo product-art product-art-boardeject"
      data-converted={converted}
      data-tool={tool}
      onKeyDown={onBoardKey}
    >
      <div className="board-canvas-wrap">
        <svg
          ref={svgRef}
          className="board-canvas"
          viewBox={`0 0 ${L.view.w} ${L.view.h}`}
          role="group"
          aria-label={
            converted
              ? "Excalidraw canvas. Drag shapes; focus one and use arrow keys to move it, Enter to edit, Delete to remove. Tool shortcuts V, R, D, O, A, T, E."
              : "Freeform board. Drag shapes; focus one and use arrow keys to move it and Enter to edit."
          }
          onPointerDown={onCanvasPointerDown}
          onDoubleClick={onCanvasDoubleClick}
        >
          <defs>
            <pattern
              id="board-dots"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="#829ca7" opacity=".35" />
            </pattern>
            <pattern
              id="board-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path d="M20 0H0V20" fill="none" stroke="#e9ecef" />
            </pattern>
          </defs>
          <rect
            x="1"
            y="1"
            width={L.view.w - 2}
            height={L.view.h - 2}
            rx="22"
            fill={converted ? "#ffffff" : "#fffaf0"}
            stroke={converted ? "#d0d4da" : "#718b9b"}
          />
          <rect
            x={L.canvas.left}
            y={L.canvas.top - 8}
            width={L.canvas.right - L.canvas.left}
            height={L.canvas.bottom - L.canvas.top + 8}
            rx="12"
            fill={converted ? "url(#board-grid)" : "url(#board-dots)"}
          />
          {(!converted || !compact) && (
            <text x="30" y="43" className="board-title" aria-hidden="true">
              {converted ? "Excalidraw" : "Freeform"}
            </text>
          )}

          {converted &&
            arrows.map((a) => (
              <g key={a.link.id} aria-hidden="true" pointerEvents="none">
                {a.paths.map((p, i) => (
                  <path
                    key={i}
                    d={p.d}
                    stroke={p.stroke}
                    strokeWidth={p.strokeWidth}
                    fill="none"
                  />
                ))}
              </g>
            ))}

          {shapes.map((s) => {
            const h = heightOf(s);
            const tilt = converted ? 0 : tiltOf(s);
            const isSelected = selected === s.id || arrowFrom === s.id;
            const color = freeformColor[s.fill] ?? "#f3ece0";
            return (
              <g
                key={s.id}
                className="board-shape"
                data-kind={s.kind}
                transform={`translate(${s.x},${s.y}) rotate(${tilt},${W / 2},${h / 2})`}
                tabIndex={0}
                role="button"
                aria-label={`${s.label || `Empty ${s.kind}`}. Arrow keys move it, Enter edits the text.`}
                aria-pressed={isSelected}
                onPointerDown={(e) => onShapePointerDown(e, s)}
                onPointerMove={onShapePointerMove}
                onPointerUp={onShapePointerUp}
                onPointerCancel={() => (drag.current = null)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (tool === "select") startEdit(s.id);
                }}
                onKeyDown={(e) => onShapeKey(e, s)}
                onFocus={() => {
                  if (!drag.current) setSelected(s.id);
                }}
              >
                <rect width={W} height={h} fill="transparent" />
                {s.kind === "text" ? null : converted ? (
                  sketch(s).map((p, i) => (
                    <path
                      key={i}
                      d={p.d}
                      stroke={p.stroke}
                      strokeWidth={p.strokeWidth}
                      fill={p.fill ?? "none"}
                    />
                  ))
                ) : s.kind === "ellipse" ? (
                  <ellipse
                    cx={W / 2}
                    cy={H / 2}
                    rx={W / 2}
                    ry={H / 2}
                    fill={color}
                    stroke="#21465d"
                    strokeWidth="2"
                  />
                ) : s.kind === "diamond" ? (
                  <polygon
                    points={`${W / 2},0 ${W},${H / 2} ${W / 2},${H} 0,${H / 2}`}
                    fill={color}
                    stroke="#21465d"
                    strokeWidth="2"
                  />
                ) : (
                  <rect
                    width={W}
                    height={H}
                    rx="18"
                    fill={color}
                    stroke="#21465d"
                    strokeWidth="2"
                  />
                )}
                {editing !== s.id && s.label && (
                  <text
                    x={W / 2}
                    y={h / 2 + 8}
                    textAnchor="middle"
                    className={converted ? "board-label-sketch" : "board-label"}
                  >
                    {s.label}
                  </text>
                )}
                {isSelected && (
                  <g
                    className="board-selection"
                    fill="#fff"
                    stroke="#6965db"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect
                      x="-8"
                      y="-8"
                      width={W + 16}
                      height={h + 16}
                      fill="none"
                    />
                    {[
                      [-8, -8],
                      [W + 8, -8],
                      [-8, h + 8],
                      [W + 8, h + 8],
                    ].map(([cx, cy]) => (
                      <rect
                        key={`${cx}-${cy}`}
                        x={cx - 5}
                        y={cy - 5}
                        width="10"
                        height="10"
                        rx="2"
                      />
                    ))}
                    {converted && <circle cx={W / 2} cy="-26" r="5" />}
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {converted && (
          <div
            className="board-toolbar"
            role="toolbar"
            aria-label="Excalidraw tools"
          >
            {tools.map(({ id, label, shortcut, Icon }) => (
              <button
                key={id}
                type="button"
                aria-label={`${label} (${shortcut})`}
                title={`${label}  ${shortcut}`}
                aria-pressed={tool === id}
                onClick={() => chooseTool(id)}
              >
                <Icon aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {editingShape && (
          <input
            className="board-edit"
            autoFocus
            value={draft}
            maxLength={24}
            placeholder={editingShape.kind === "text" ? "Type text" : "Label"}
            aria-label={`Edit text for ${editingShape.label || editingShape.kind}`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            style={{
              left: `${((editingShape.x + 12) / L.view.w) * 100}%`,
              top: `${((editingShape.y + heightOf(editingShape) / 2 - 20) / L.view.h) * 100}%`,
              width: `${((W - 24) / L.view.w) * 100}%`,
            }}
          />
        )}
      </div>

      <div className="board-demo-bar">
        <button type="button" onClick={toggle} className="board-demo-action">
          {converted ? <RotateCcw size={17} /> : <ArrowRight size={17} />}
          {converted ? "Back to Freeform" : "Convert to Excalidraw"}
        </button>
        {converted && (
          <button
            type="button"
            className="board-demo-secondary"
            onClick={download}
          >
            <Download size={16} aria-hidden="true" /> Download .excalidraw
          </button>
        )}
        <button type="button" className="board-demo-secondary" onClick={reset}>
          Reset
        </button>
        <a
          className="board-demo-explore"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore {name} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="board-demo-note">
        <p role="status">
          {converted
            ? `${shapeCount} shapes · ${arrows.length} bound arrows · 0 unsupported. ${hint}`
            : `A Freeform board. ${hint}`}
        </p>
        <small>Sample board. The download opens in Excalidraw.</small>
      </div>
    </div>
  );
}
