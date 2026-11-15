import type { CSSProperties } from "react";
import { Bot, Layers3, Workflow, Hexagon } from "lucide-react";

const skills = [
  { label: "Agents", Icon: Bot },
  { label: "Apps", Icon: Layers3 },
  { label: "Flows", Icon: Workflow },
  { label: "Web3", Icon: Hexagon },
];

/** Original physical icon rail. Film poses are supplied by the Remotion frame. */
export function SkillRail({
  film = false,
  cameraStyle,
  orbStyle,
}: {
  film?: boolean;
  cameraStyle?: CSSProperties;
  orbStyle?: CSSProperties;
}) {
  return (
    <div
      className={`skill-rail ${film ? "skill-rail-film" : "skill-rail-live"}`}
      aria-hidden="true"
    >
      <div className="skill-rail-track" style={cameraStyle}>
        {skills.map(({ label, Icon }, i) => (
          <span
            className="skill-tile"
            key={label}
            style={{ "--phase": `${i * 2}s` } as CSSProperties}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </span>
        ))}
        <div className="skill-rail-orbit">
          <div className="skill-rail-ball-route" style={orbStyle}>
            <span className="skill-rail-ball" />
          </div>
        </div>
      </div>
    </div>
  );
}
