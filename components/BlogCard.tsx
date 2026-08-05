import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { MediumPost } from "@/lib/medium";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogCard({ post }: { post: MediumPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl border border-line bg-panel p-7 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1"
    >
      <span className="pointer-events-none absolute inset-x-7 top-0 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="mono text-[10px] px-2.5 py-1 rounded-full border border-line text-accent"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      <h3 className="display text-xl text-ink mb-2 leading-tight group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-mute mb-5 leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-line mt-auto">
        <div className="flex items-center gap-3 mono text-[11px] text-faint">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.pubDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </span>
        </div>
        <span className="text-xs font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
          Read <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
