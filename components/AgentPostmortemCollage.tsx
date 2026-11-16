import tools from "@/data/agentpostmortem.json";
import { ProjectCollage } from "./ProjectCollage";

export function AgentPostmortemCollage() {
  return (
    <ProjectCollage
      items={tools}
      href="https://www.agentpostmortem.com/tools"
      caption={`${tools.length} agents, tools & resources`}
      action="Explore AgentPostmortem"
      className="agentpostmortem-collage collage-graphics"
    />
  );
}
