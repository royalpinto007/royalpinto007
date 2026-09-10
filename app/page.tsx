import { readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";

const wallSvg = readFileSync(
  path.join(process.cwd(), "public", "wall2026.svg"),
  "utf8",
);
const work = [
  {
    name: "SignalizeAI",
    kind: "AI product / browser extension",
    image: "signalizeai",
    href: "https://signalizeai.org",
    description:
      "From a company website to a sales-ready prospect record. Research, personas, and outreach in the browser.",
  },
  {
    name: "AgentPostmortem",
    kind: "AI infrastructure / open source",
    image: "agentpostmortem",
    href: "https://agentpostmortem.com",
    description:
      "A public registry of real AI-agent failures. Making failure evidence useful to the next builder.",
  },
  {
    name: "AashiNyra Deals",
    kind: "Full-stack product / commerce",
    image: "aashinyra",
    href: "https://aashinyra.com",
    description:
      "A fashion deals platform with retailer tracking, genuine price drops, and cashback to UPI.",
  },
  {
    name: "Facetworks",
    kind: "Creative development / interaction",
    image: "facetworks",
    href: "https://facetworks.signalizeai.org",
    description:
      "Thirty working concepts, from distinctive websites to tactile browser experiments. Built to be explored.",
  },
];

export default function HomePage() {
  return (
    <div className="portfolio-shell">
      <section className="portfolio-hero">
        <div className="hero-copy">
          <p className="intro-name">Royal Simpson Pinto / Software engineer</p>
          <h1>
            Built to work.
            <br />
            <span>Made to matter.</span>
          </h1>
          <p className="hero-description">
            I build AI products, useful tools, and distinctive web experiences.
            From the first interface to the systems underneath.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href={siteConfig.hireUrl}>
              Hire me <ArrowUpRight size={17} />
            </a>
            <Link className="quiet-link" href="/projects">
              View projects <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <figure className="portrait">
          <Image
            src={siteConfig.avatar}
            alt="Royal Simpson Pinto"
            width={600}
            height={660}
            priority
          />
          <figcaption>
            <span>Engineer. Builder. Open-source contributor.</span>
            <span>
              {siteConfig.availabilityStatus
                ? "Open to opportunities"
                : "Currently building"}
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="selected-work" id="work">
        <div className="section-intro">
          <p className="section-kicker">Selected work</p>
          <h2>Ideas you can actually open.</h2>
          <p>
            Products, platforms, and a little creative engineering. Each one has
            a working life beyond this page.
          </p>
        </div>
        <div className="work-grid">
          {work.map((project) => (
            <article className="work-piece" key={project.name}>
              <a
                className="work-preview"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`/work/${project.image}.webp`}
                  alt={`${project.name} live website`}
                  width={1008}
                  height={700}
                />
              </a>
              <div className="work-meta">
                <h3>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name} <ArrowUpRight size={19} />
                  </a>
                </h3>
                <span>{project.kind}</span>
              </div>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
        <Link className="quiet-link collection-link" href="/projects">
          View projects <ArrowRight size={17} />
        </Link>
      </section>

      <section className="capabilities">
        <div>
          <h2>
            One engineer.
            <br />
            The whole picture.
          </h2>
          <p>
            I care about the experience people see and the engineering they
            don’t. Clear interfaces, deliberate architecture, and a usable
            handover.
          </p>
          <a className="quiet-link" href={siteConfig.hireUrl}>
            Hire me <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="capability-list">
          {siteConfig.services.map((service) => (
            <article key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description.replaceAll("—", ",")}</p>
              <span>{service.tags.join(" / ")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="open-source" id="oss">
        <div className="section-intro">
          <h2>Open source is part of the job.</h2>
          <p>
            GSoC, Linux Foundation (LFX), and Symmetry Autumn of Code.
            Contributions to compilers, networking systems, and AI tooling.
          </p>
        </div>
        <div className="contribution-summary">
          <strong>6,744 contributions in 2026</strong>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            View GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>
        <div
          className="contribution-wall"
          dangerouslySetInnerHTML={{ __html: wallSvg }}
        />
        <div className="experience-facts">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="playground" id="frontend">
        <div className="section-intro">
          <h2>A serious interest in play.</h2>
          <p>
            {siteConfig.frontendSites.length} design sites.{" "}
            {siteConfig.gpuSites.length} interactive experiences. A place to
            explore what the browser can feel like.
          </p>
        </div>
        <div className="playground-images">
          {["fogged-glass", "magnetic-sand", "jelly-iphone"].map((slug) => (
            <a
              key={slug}
              href={`https://${slug}.signalizeai.org`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={`/work/${slug}.webp`}
                alt={slug.replaceAll("-", " ")}
                width={960}
                height={640}
              />
              <span>
                {slug
                  .split("-")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}{" "}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
        <a
          className="quiet-link"
          href="https://facetworks.signalizeai.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Facetworks <ArrowUpRight size={17} />
        </a>
        <details className="project-index">
          <summary>
            Browse all{" "}
            {siteConfig.frontendSites.length + siteConfig.gpuSites.length}{" "}
            design experiments
          </summary>
          <div>
            {[...siteConfig.frontendSites, ...siteConfig.gpuSites].map(
              (project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.name}
                  <span>{project.genre}</span>
                </a>
              ),
            )}
          </div>
        </details>
      </section>
      <section className="writing-link">
        <div>
          <h2>What I learn while building.</h2>
          <p>Notes on engineering, AI, and shipping software.</p>
        </div>
        <Link className="quiet-link" href="/blog">
          Read the blog <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
