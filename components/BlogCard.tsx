import { ExternalLink, Clock, Calendar } from "lucide-react";
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
      className="group block rounded-xl border border-line bg-panel p-7 hover:border-line-strong transition-colors duration-300"
    >
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[11px] px-2.5 py-1 rounded-full border border-line text-accent"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
      <h3 className="text-base text-ink mb-2 group-hover:text-accent transition-colors leading-snug">
        {post.title}
      </h3>
      <p className="text-sm text-mute mb-5 leading-relaxed line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <div className="flex items-center gap-3 text-xs text-faint">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.pubDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min read
          </span>
        </div>
        <span className="text-xs font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
          Read <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}
