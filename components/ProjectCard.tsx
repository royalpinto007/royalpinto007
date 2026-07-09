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
}: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-line bg-panel p-7 hover:border-line-strong transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-faint mb-1.5">
            {category}
          </div>
          <h3 className="text-lg text-ink">{name}</h3>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-line text-accent whitespace-nowrap">
          {status}
        </span>
      </div>
      <p className="text-sm text-mute mb-5 leading-relaxed">{description}</p>
      <ul className="space-y-1.5 mb-5">
        {features.slice(0, 3).map((f) => (
          <li key={f} className="text-xs text-mute flex items-start gap-2 leading-relaxed">
            <span className="text-accent mt-0.5 flex-shrink-0">—</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
        {tech.map((t) => (
          <span
            key={t}
            className="text-[11px] px-2.5 py-1 rounded-full border border-line text-mute"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-5 pt-4 border-t border-line">
        {liveUrl && liveUrl !== "#" && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Live
          </a>
        )}
        {githubUrl && githubUrl !== "#" && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-mute hover:text-ink transition-colors"
          >
            <GithubIcon className="w-3 h-3" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
