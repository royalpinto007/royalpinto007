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
  /** Home page variant: no feature bullets, tighter type, condensed tech list. */
  compact?: boolean;
}

/** Status colours by value, so Production / Open Source / Live read apart. */
function statusStyle(status: string) {
  const key = status.toLowerCase();
  if (key === "production" || key === "live") {
    return "border-transparent bg-[color-mix(in_srgb,var(--signal)_18%,transparent)] text-[var(--signal)]";
  }
  if (key === "open source") {
    return "border-transparent bg-accent-soft text-accent";
  }
  return "border border-line text-mute";
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
  const shownTech = tech.slice(0, 3);
  const extraTech = tech.length - shownTech.length;

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-panel p-5 sm:p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1">
      {/* hover accent hairline */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

      <div className="mono mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
        <span className="truncate">{category}</span>
        <span
          className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] tracking-normal ${statusStyle(status)}`}
        >
          {status}
        </span>
      </div>

      <h3 className="display text-xl sm:text-[1.6rem] text-ink leading-tight">
        {name}
      </h3>

      <p
        className={`mt-2 text-sm text-mute leading-relaxed ${compact ? "line-clamp-2" : "line-clamp-3"}`}
      >
        {description}
      </p>

      {!compact && features.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {features.slice(0, 3).map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-xs text-mute leading-relaxed"
            >
              <span className="mt-0.5 flex-shrink-0 text-accent">&bull;</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mono mt-4 text-[10px] text-faint truncate">
        {shownTech.join(" · ")}
        {extraTech > 0 && ` · +${extraTech}`}
      </div>

      <div className="mt-auto flex gap-5 pt-4">
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
