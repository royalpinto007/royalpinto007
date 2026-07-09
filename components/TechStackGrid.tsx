import { siteConfig } from "@/data/site";

export function TechStackGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Object.entries(siteConfig.techStack).map(([category, items]) => (
        <div key={category} className="rounded-xl border border-line bg-panel p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint mb-4">
            {category}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className="text-xs px-2.5 py-1 rounded-full border border-line text-mute"
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
