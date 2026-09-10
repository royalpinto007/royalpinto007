import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export function DesignGallery({
  compact = false,
  kind = "all",
}: {
  compact?: boolean;
  kind?: "all" | "websites" | "experiments";
}) {
  const projects =
    kind === "websites"
      ? siteConfig.frontendSites
      : kind === "experiments"
        ? siteConfig.gpuSites
        : [...siteConfig.frontendSites, ...siteConfig.gpuSites];
  const selected = compact
    ? projects.filter((p) =>
        [
          "Ledger",
          "Atlas",
          "Frequency",
          "Mochimo",
          "Magnetic Sand",
          "Fogged Glass",
        ].includes(p.name),
      )
    : projects;
  return (
    <div className="design-gallery">
      {selected.map((project) => {
        const slug = new URL(project.url).hostname.split(".")[0];
        return (
          <a
            className="design-tile"
            href={project.url}
            key={project.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={`/designs/${slug}.webp`}
              alt={`${project.name} website preview`}
              width={960}
              height={640}
            />
            <div>
              <h3>{project.name}</h3>
              <ArrowUpRight size={18} />
            </div>
            <p>{project.genre}</p>
          </a>
        );
      })}
    </div>
  );
}
