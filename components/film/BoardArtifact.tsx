import { useId } from "react";
/** A supported-shape illustration, not a file parser or conversion result. */
export function BoardArtifact({ progress = 0 }: { progress?: number }) {
  const dots = useId();
  const p = Math.min(1, Math.max(0, progress));
  const shapes = [
    { x: 90, y: 150, endX: 65, endY: 170, label: "An idea", color: "#cee4f5" },
    { x: 340, y: 80, endX: 335, endY: 170, label: "A plan", color: "#f3c9d7" },
    {
      x: 535,
      y: 240,
      endX: 605,
      endY: 170,
      label: "Something real",
      color: "#f6ddbd",
    },
  ];
  return (
    <svg
      className="board-artifact"
      viewBox="0 0 860 460"
      aria-hidden="true"
      data-board-progress={p}
    >
      <defs>
        <pattern id={dots} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#829ca7" opacity=".35" />
        </pattern>
      </defs>
      <rect
        x="1"
        y="1"
        width="858"
        height="458"
        rx="24"
        fill="#fffaf0"
        stroke="#718b9b"
      />
      <rect
        x="20"
        y="70"
        width="820"
        height="370"
        rx="14"
        fill={`url(#${dots})`}
      />
      <text
        x="30"
        y="43"
        fill="#15394f"
        fontSize="22"
        fontFamily="var(--font-geist),sans-serif"
      >
        {p < 0.5
          ? "Freeform · the starting point"
          : "Excalidraw · editable elements"}
      </text>
      <g fill="none" stroke="#8d3664" strokeWidth="3" opacity={p}>
        <path d="M265 225H335m-14-8 14 8-14 8M535 225H605m-14-8 14 8-14 8" />
      </g>
      {shapes.map((shape, i) => {
        const x = shape.x + (shape.endX - shape.x) * p;
        const y = shape.y + (shape.endY - shape.y) * p;
        return (
          <g
            key={shape.label}
            transform={`translate(${x},${y}) rotate(${(i % 2 ? 7 : -6) * (1 - p)},100,55)`}
          >
            <rect
              width="200"
              height="110"
              rx={18 - p * 10}
              fill={shape.color}
              stroke="#21465d"
              strokeWidth="2"
            />
            <text
              x="100"
              y="63"
              textAnchor="middle"
              fill="#13364e"
              fontSize="22"
              fontFamily="var(--font-geist),sans-serif"
            >
              {shape.label}
            </text>
            <g opacity={p} fill="#fff" stroke="#357eae" strokeWidth="2">
              {[
                [0, 0],
                [200, 0],
                [0, 110],
                [200, 110],
              ].map(([cx, cy]) => (
                <rect
                  key={`${cx}-${cy}`}
                  x={cx - 5}
                  y={cy - 5}
                  width="10"
                  height="10"
                />
              ))}
            </g>
          </g>
        );
      })}
      <text
        x="30"
        y="419"
        fill="#34546a"
        fontSize="19"
        fontFamily="var(--font-geist),sans-serif"
      >
        {p < 0.5
          ? "Keep the idea. Change the canvas."
          : "Shapes, text and connections you can keep editing."}
      </text>
    </svg>
  );
}
