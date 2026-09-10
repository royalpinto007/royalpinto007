import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
interface ProjectCardProps {
  name: string;
  category: string;
  status: string;
  description: string;
  features: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  compact?: boolean;
}
export function ProjectCard({
  name,
  category,
  status,
  description,
  features,
  tech,
  liveUrl,
  githubUrl,
  compact = false,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card-head">
        <span>{category}</span>
        <span>{status}</span>
      </div>
      <h3>{name}</h3>
      <p>{description.replaceAll("—", ",")}</p>
      {!compact && features.length > 0 && (
        <ul>
          {features.slice(0, 3).map((f) => (
            <li key={f}>{f.replaceAll("—", ",")}</li>
          ))}
        </ul>
      )}
      <div className="project-card-tech">{tech.slice(0, 3).join(" / ")}</div>
      <div className="project-card-links">
        {liveUrl && liveUrl !== "#" && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} />
            {/npmjs.com|pypi.org/.test(liveUrl) ? "View package" : "Live site"}
          </a>
        )}
        {githubUrl && githubUrl !== "#" && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="w-3.5 h-3.5" />
            Source
          </a>
        )}
      </div>
    </article>
  );
}
