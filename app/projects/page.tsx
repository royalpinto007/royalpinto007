import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";
import { DesignGallery } from "@/components/DesignGallery";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my live products, websites, browser experiments, and open-source engineering.",
};
export default function ProjectsPage() {
  const products = siteConfig.projects.filter(
    (p) => p.section !== "Frontend & Design",
  );
  return (
    <div className="portfolio-shell projects-page">
      <header className="projects-heading">
        <p>Products / Interfaces / Systems</p>
        <h1>
          Built. Shipped.
          <br />
          <span>Still exploring.</span>
        </h1>
        <p>
          A closer look at the products I build and the details I care about.
          Open a live project and try it.
        </p>
      </header>
      <nav className="project-jumps" aria-label="Project categories">
        <a href="#products">Products & tools</a>
        <a href="#designs">Websites & experiments</a>
        <a href={siteConfig.hireUrl}>Work with me ↗</a>
      </nav>
      <section id="products">
        <div className="section-intro">
          <h2>Products with a purpose.</h2>
          <p>AI workflows, browser tools, and open-source systems.</p>
        </div>
        <div className="product-showcase">
          {products.map((project) => (
            <div key={project.id} className="product-entry">
              {["signalizeai", "agentpostmortem", "aashinyra"].some((slug) =>
                project.id.includes(slug),
              ) && (
                <Image
                  src={`/work/${project.id.includes("signalizeai") ? "signalizeai" : project.id.includes("aashinyra") ? "aashinyra" : "agentpostmortem"}.webp`}
                  alt={`${project.name} live preview`}
                  width={1008}
                  height={700}
                />
              )}
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </section>
      <section id="designs">
        <div className="section-intro">
          <h2>Interfaces worth exploring.</h2>
          <p>
            18 websites and 12 interactive experiences. Independent concepts,
            built to show what a custom web experience can feel like.
          </p>
        </div>
        <DesignGallery />
      </section>
    </div>
  );
}
