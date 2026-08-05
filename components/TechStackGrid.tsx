import { siteConfig } from "@/data/site";

export function TechStackGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(siteConfig.techStack).map(([category, items]) => (
        <div
          key={category}
          className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong"
        >
          <div className="eyebrow text-faint mb-4">{category}</div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className="mono text-[11px] px-2.5 py-1 rounded-full border border-line text-mute"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
