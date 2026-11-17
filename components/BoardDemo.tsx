"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowRight,
  Circle,
  Diamond,
  Download,
  Hand,
  Minus,
  MousePointer2,
  Pencil,
  RotateCcw,
  Square,
  Type,
} from "lucide-react";
import { RoughGenerator } from "roughjs/bin/generator";

/*
 * A small, real Excalidraw-style canvas. The shapes are drawn with rough.js
 * (the library Excalidraw uses) and labelled in Excalifont. After conversion
 * they can be dragged, their bound arrows follow, labels can be edited, and the
 * scene downloads as a genuine .excalidraw file. It demonstrates the output;
 * it does not parse Freeform files.
 */

type Shape = {
  id: string;
  label: string;
  x: number;
  y: number;
  fill: string;
  freeform: { x: number; y: number; tilt: number; color: string };
  seed: number;
};

const W = 200;
const H = 104;

type LayoutKey = "wide" | "compact";
type Spot = { x: number; y: number; fx: number; fy: number; tilt: number };
/* Phones get a taller zig-zag board so shapes and labels stay large enough to
   drag and read; wide cards keep the left-to-right flow. */
const layouts: Record<
  LayoutKey,
  {
    view: { w: number; h: number };
    canvas: { top: number; bottom: number; left: number; right: number };
    toolbarX: number;
    zoomY: number;
    at: Record<string, Spot>;
  }
> = {
  wide: {
    view: { w: 860, h: 460 },
    canvas: { top: 76, bottom: 444, left: 16, right: 844 },
    toolbarX: 238,
    zoomY: 404,
    at: {
      idea: { x: 52, y: 236, fx: 90, fy: 150, tilt: -6 },
      plan: { x: 330, y: 120, fx: 340, fy: 90, tilt: 7 },
      real: { x: 608, y: 236, fx: 560, fy: 236, tilt: -5 },
    },
  },
  compact: {
    view: { w: 520, h: 640 },
    canvas: { top: 76, bottom: 572, left: 16, right: 504 },
    toolbarX: 68,
    zoomY: 588,
    at: {
      idea: { x: 40, y: 112, fx: 50, fy: 120, tilt: -6 },
      plan: { x: 280, y: 270, fx: 268, fy: 262, tilt: 7 },
      real: { x: 40, y: 440, fx: 64, fy: 420, tilt: -5 },
    },
  },
};

const baseShapes = [
  {
    id: "idea",
    label: "An idea",
    fill: "#a5d8ff",
    color: "#cee4f5",
    seed: 1931,
  },
  {
    id: "plan",
    label: "A plan",
    fill: "#ffc9c9",
    color: "#f3c9d7",
    seed: 4127,
  },
  {
    id: "real",
    label: "Something real",
    fill: "#ffec99",
    color: "#f6ddbd",
    seed: 7703,
  },
];

/** Shapes at a layout's starting spots, keeping any labels already edited. */
function place(
  list: { id: string; label: string; fill: string; seed: number }[],
  key: LayoutKey,
): Shape[] {
  return list.map((s) => {
    const spot = layouts[key].at[s.id];
    const color = baseShapes.find((b) => b.id === s.id)!.color;
    return {
      id: s.id,
      label: s.label,
      fill: s.fill,
      seed: s.seed,
      x: spot.x,
      y: spot.y,
      freeform: { x: spot.fx, y: spot.fy, tilt: spot.tilt, color },
    };
  });
}

const compactQuery = "(max-width: 640px)";
const subscribeCompact = (onChange: () => void) => {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const links = [
  { id: "a1", from: "idea", to: "plan", seed: 2281 },
  { id: "a2", from: "plan", to: "real", seed: 5519 },
];

const generator = new RoughGenerator();
const stroke = "#1e1e1e";

/** Rounded rectangle path, as Excalidraw draws "adaptive" rectangle corners. */
function roundedRect(w: number, h: number, r: number) {
  return `M${r} 0L${w - r} 0Q${w} 0 ${w} ${r}L${w} ${h - r}Q${w} ${h} ${w - r} ${h}L${r} ${h}Q0 ${h} 0 ${h - r}L0 ${r}Q0 0 ${r} 0Z`;
}

/** Where the line from a box's centre towards a point leaves the box. */
function edgePoint(s: Shape, toward: { x: number; y: number }, gap: number) {
  const cx = s.x + W / 2;
  const cy = s.y + H / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  const scale = 1 / Math.max(Math.abs(dx) / (W / 2), Math.abs(dy) / (H / 2));
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: cx + dx * scale + (dx / len) * gap,
    y: cy + dy * scale + (dy / len) * gap,
  };
}

function arrowGeometry(a: Shape, b: Shape) {
  const ca = { x: a.x + W / 2, y: a.y + H / 2 };
  const cb = { x: b.x + W / 2, y: b.y + H / 2 };
  const start = edgePoint(a, cb, 8);
  const end = edgePoint(b, ca, 8);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = (side: number) => ({
    x: end.x - 18 * Math.cos(angle + side * 0.45),
    y: end.y - 18 * Math.sin(angle + side * 0.45),
  });
  return { start, end, left: head(1), right: head(-1) };
}

function paths(drawable: ReturnType<typeof generator.path>) {
  return generator.toPaths(drawable);
}

export function BoardDemo() {
  const [converted, setConverted] = useState(false);
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const key: LayoutKey = compact ? "compact" : "wide";
  const L = layouts[key];
  const [store, setStore] = useState(() => ({
    key: "wide" as LayoutKey,
    list: place(baseShapes, "wide"),
  }));
  const shapes = store.key === key ? store.list : place(store.list, key);
  const setShapes = useCallback(
    (update: (current: Shape[]) => Shape[]) =>
      setStore((cur) => ({
        key,
        list: update(cur.key === key ? cur.list : place(cur.list, key)),
      })),
    [key],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{
    id: string;
    dx: number;
    dy: number;
    moved: boolean;
    wasSelected: boolean;
  } | null>(null);

  // Box sketches only depend on the seed, so moving a shape is a translate.
  const boxSketches = useMemo(
    () =>
      Object.fromEntries(
        baseShapes.map((s) => [
          s.id,
          paths(
            generator.path(roundedRect(W, H, 18), {
              seed: s.seed,
              stroke,
              strokeWidth: 2,
              roughness: 1,
              fill: s.fill,
              fillStyle: "hachure",
              hachureGap: 8,
              fillWeight: 1.6,
            }),
          ),
        ]),
      ),
    [],
  );

  const byId = useMemo(
    () => Object.fromEntries(shapes.map((s) => [s.id, s])),
    [shapes],
  );
  const arrows = useMemo(
    () =>
      links.map((link) => {
        const g = arrowGeometry(byId[link.from], byId[link.to]);
        const o = { seed: link.seed, stroke, strokeWidth: 2, roughness: 1 };
        return {
          id: link.id,
          ...g,
          sketch: [
            ...paths(generator.line(g.start.x, g.start.y, g.end.x, g.end.y, o)),
            ...paths(generator.line(g.left.x, g.left.y, g.end.x, g.end.y, o)),
            ...paths(generator.line(g.right.x, g.right.y, g.end.x, g.end.y, o)),
          ],
        };
      }),
    [byId],
  );

  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return { x: 0, y: 0 };
    const point = new DOMPoint(clientX, clientY).matrixTransform(
      matrix.inverse(),
    );
    return { x: point.x, y: point.y };
  }, []);

  const moveTo = useCallback(
    (id: string, x: number, y: number) => {
      setShapes((current) =>
        current.map((s) =>
          s.id === id
            ? {
                ...s,
                x: Math.min(Math.max(x, L.canvas.left), L.canvas.right - W),
                y: Math.min(Math.max(y, L.canvas.top), L.canvas.bottom - H),
              }
            : s,
        ),
      );
    },
    [L, setShapes],
  );

  const startEdit = (id: string) => {
    setSelected(id);
    setEditing(id);
    setDraft(byId[id].label);
  };
  const commitEdit = () => {
    if (!editing) return;
    const text = draft.trim().slice(0, 24) || byId[editing].label;
    setShapes((current) =>
      current.map((s) => (s.id === editing ? { ...s, label: text } : s)),
    );
    setEditing(null);
  };

  const onPointerDown = (event: PointerEvent<SVGGElement>, s: Shape) => {
    if (!converted || editing) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = toCanvas(event.clientX, event.clientY);
    drag.current = {
      id: s.id,
      dx: p.x - s.x,
      dy: p.y - s.y,
      moved: false,
      wasSelected: selected === s.id,
    };
    setSelected(s.id);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = toCanvas(event.clientX, event.clientY);
    const s = byId[d.id];
    if (!d.moved && Math.hypot(p.x - d.dx - s.x, p.y - d.dy - s.y) < 3) return;
    d.moved = true;
    moveTo(d.id, p.x - d.dx, p.y - d.dy);
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    // A second tap on a selected shape edits its text, as on touch screens.
    if (d && !d.moved && d.wasSelected) startEdit(d.id);
  };
  const onShapeKey = (event: KeyboardEvent<SVGGElement>, s: Shape) => {
    if (!converted) return;
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

  const reset = () => {
    setStore({ key, list: place(baseShapes, key) });
    setSelected(null);
    setEditing(null);
  };

  const download = () => {
    const now = Date.now();
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
      updated: now,
      link: null,
      locked: false,
    };
    const elements = [
      ...shapes.flatMap((s) => [
        {
          ...base,
          id: s.id,
          type: "rectangle",
          x: s.x,
          y: s.y,
          width: W,
          height: H,
          backgroundColor: s.fill,
          roundness: { type: 3 },
          seed: s.seed,
          boundElements: [
            { type: "text", id: `${s.id}-text` },
            ...links
              .filter((l) => l.from === s.id || l.to === s.id)
              .map((l) => ({ type: "arrow", id: l.id })),
          ],
        },
        {
          ...base,
          id: `${s.id}-text`,
          type: "text",
          x: s.x + 10,
          y: s.y + H / 2 - 12.5,
          width: W - 20,
          height: 25,
          backgroundColor: "transparent",
          roundness: null,
          seed: s.seed + 1,
          boundElements: null,
          text: s.label,
          originalText: s.label,
          fontSize: 20,
          fontFamily: 5,
          textAlign: "center",
          verticalAlign: "middle",
          containerId: s.id,
          autoResize: true,
          lineHeight: 1.25,
        },
      ]),
      ...arrows.map((a, i) => ({
        ...base,
        id: a.id,
        type: "arrow",
        x: a.start.x,
        y: a.start.y,
        width: Math.abs(a.end.x - a.start.x),
        height: Math.abs(a.end.y - a.start.y),
        backgroundColor: "transparent",
        roundness: { type: 2 },
        seed: links[i].seed,
        boundElements: null,
        points: [
          [0, 0],
          [a.end.x - a.start.x, a.end.y - a.start.y],
        ],
        lastCommittedPoint: null,
        startBinding: { elementId: links[i].from, focus: 0, gap: 8 },
        endBinding: { elementId: links[i].to, focus: 0, gap: 8 },
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
  const tools = [
    Hand,
    MousePointer2,
    Square,
    Diamond,
    Circle,
    ArrowRight,
    Minus,
    Pencil,
    Type,
  ];

  return (
    <div
      className="board-demo product-art product-art-boardeject"
      data-converted={converted}
    >
      <div className="board-canvas-wrap">
        <svg
          ref={svgRef}
          className="board-canvas"
          viewBox={`0 0 ${L.view.w} ${L.view.h}`}
          role="group"
          aria-label={
            converted
              ? "Excalidraw canvas with three editable shapes. Drag a shape, or focus it and use arrow keys to move and Enter to edit its text."
              : "Apple Freeform board with three sticky shapes"
          }
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
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
            pointerEvents="none"
          />

          {converted ? (
            <g className="excalidraw-chrome" aria-hidden="true">
              <rect
                x={L.toolbarX}
                y="14"
                width="384"
                height="46"
                rx="10"
                fill="#fff"
                stroke="#e3e3e8"
              />
              {tools.map((Icon, i) => (
                <g key={i}>
                  {i === 1 && (
                    <rect
                      x={L.toolbarX + 10 + i * 41}
                      y="20"
                      width="34"
                      height="34"
                      rx="8"
                      fill="#e0dfff"
                    />
                  )}
                  <Icon
                    x={L.toolbarX + 18 + i * 41}
                    y="28"
                    width="18"
                    height="18"
                    color={i === 1 ? "#4a47b1" : "#1b1b1f"}
                    strokeWidth={1.8}
                  />
                </g>
              ))}
              {!compact && (
                <text x="30" y="43" className="board-title">
                  Excalidraw
                </text>
              )}
              <rect
                x="30"
                y={L.zoomY}
                width="96"
                height="36"
                rx="8"
                fill="#ececf4"
              />
              <text
                x="78"
                y={L.zoomY + 23}
                textAnchor="middle"
                className="board-zoom"
              >
                − 100% +
              </text>
            </g>
          ) : (
            <text x="30" y="43" className="board-title" aria-hidden="true">
              Freeform
            </text>
          )}

          {converted &&
            arrows.map((a) => (
              <g key={a.id} aria-hidden="true">
                {a.sketch.map((p, i) => (
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
            const tx = converted ? s.x : s.freeform.x;
            const ty = converted ? s.y : s.freeform.y;
            const tilt = converted ? 0 : s.freeform.tilt;
            const isSelected = converted && selected === s.id;
            return (
              <g
                key={s.id}
                className="board-shape"
                transform={`translate(${tx},${ty}) rotate(${tilt},${W / 2},${H / 2})`}
                tabIndex={converted ? 0 : -1}
                role={converted ? "button" : undefined}
                aria-label={
                  converted
                    ? `${s.label}. Arrow keys move it, Enter edits the text.`
                    : undefined
                }
                aria-pressed={converted ? isSelected : undefined}
                onPointerDown={(e) => onPointerDown(e, s)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (drag.current = null)}
                onDoubleClick={() => converted && startEdit(s.id)}
                onKeyDown={(e) => onShapeKey(e, s)}
                onFocus={() => converted && setSelected(s.id)}
              >
                {converted ? (
                  boxSketches[s.id].map((p, i) => (
                    <path
                      key={i}
                      d={p.d}
                      stroke={p.stroke}
                      strokeWidth={p.strokeWidth}
                      fill={p.fill ?? "none"}
                    />
                  ))
                ) : (
                  <rect
                    width={W}
                    height={H}
                    rx="18"
                    fill={s.freeform.color}
                    stroke="#21465d"
                    strokeWidth="2"
                  />
                )}
                {editing !== s.id && (
                  <text
                    x={W / 2}
                    y={H / 2 + 8}
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
                      height={H + 16}
                      fill="none"
                    />
                    {[
                      [-8, -8],
                      [W + 8, -8],
                      [-8, H + 8],
                      [W + 8, H + 8],
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
                    <circle cx={W / 2} cy="-26" r="5" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        {editingShape && (
          <input
            className="board-edit"
            autoFocus
            value={draft}
            maxLength={24}
            aria-label={`Edit text for ${editingShape.label}`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            style={{
              left: `${((editingShape.x + 12) / L.view.w) * 100}%`,
              top: `${((editingShape.y + H / 2 - 20) / L.view.h) * 100}%`,
              width: `${((W - 24) / L.view.w) * 100}%`,
            }}
          />
        )}
      </div>

      <div className="board-demo-bar">
        <button
          type="button"
          onClick={() => {
            setConverted(!converted);
            setSelected(null);
            setEditing(null);
          }}
          className="board-demo-action"
        >
          {converted ? <RotateCcw size={17} /> : <ArrowRight size={17} />}
          {converted ? "Back to Freeform" : "Convert to Excalidraw"}
        </button>
        {converted && (
          <>
            <button
              type="button"
              className="board-demo-secondary"
              onClick={download}
            >
              <Download size={16} aria-hidden="true" /> Download .excalidraw
            </button>
            <button
              type="button"
              className="board-demo-secondary"
              onClick={reset}
            >
              Reset
            </button>
          </>
        )}
      </div>
      <div className="board-demo-note">
        <p role="status">
          {converted
            ? "3 shapes · 2 bound arrows · 0 unsupported. Drag one, or tap it twice to edit."
            : "A Freeform board: three sticky shapes, no connections you can edit."}
        </p>
        <small>
          Sample board. The download opens in Excalidraw. Open BoardEject to
          convert your own.
        </small>
      </div>
    </div>
  );
}
