import type { CSSProperties } from "react";
import { Bot, Layers3, Workflow, Hexagon } from "lucide-react";

const skills = [
  {
    label: "Agents",
    Icon: Bot,
    href: "/projects#project-agent-suite",
    name: "Agents projects",
  },
  {
    label: "Apps",
    Icon: Layers3,
    href: "/projects#apps",
    name: "Apps projects",
  },
  {
    label: "Automation",
    Icon: Workflow,
    href: "/projects#project-dent-docs",
    name: "Automation projects",
  },
  {
    label: "Web3",
    Icon: Hexagon,
    href: "/projects#web3",
    name: "Solana and Web3 projects",
  },
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
  if (!film) {
    return (
      <nav
        className="skill-rail skill-rail-live"
        aria-label="Explore projects by area"
      >
        <div className="skill-rail-track">
          {skills.map(({ label, Icon, href, name }) => (
            <a
              className="skill-tile"
              key={label}
              href={href}
              aria-label={name}
              title={name}
            >
              <span className="skill-icon">
                <Icon aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </nav>
    );
  }
  return (
    <div className="skill-rail skill-rail-film" aria-hidden="true">
      <div className="skill-rail-track" style={cameraStyle}>
        {skills.map(({ label, Icon }, i) => (
          <span
            className="skill-tile"
            key={label}
            style={{ "--phase": `${i * 2}s` } as CSSProperties}
          >
            <Icon aria-hidden="true" />
            <span>{label === "Automation" ? "Flows" : label}</span>
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
