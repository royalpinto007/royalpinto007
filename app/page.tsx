import { readFileSync } from "node:fs";
import "./home.css";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, GitBranch } from "lucide-react";
import { DesignGallery } from "@/components/DesignGallery";
import { MotionReel } from "@/components/MotionReel";
import { KineticBand } from "@/components/KineticBand";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SystemsShowcase } from "@/components/SystemsShowcase";
import { siteConfig } from "@/data/site";

const wallSvg = readFileSync(
  path.join(process.cwd(), "public", "wall2026.svg"),
  "utf8",
);
const work = [
  {
    name: "SignalizeAI",
    kind: "AI product",
    image: "signalizeai",
    href: "https://signalizeai.org",
    description: "Account research, right inside your browser.",
    stack: ["Browser extension", "AI workflows"],
  },
  {
    name: "AgentPostmortem",
    kind: "AI infrastructure",
    image: "agentpostmortem",
    href: "https://agentpostmortem.com",
    description: "Real agent failures. Lessons worth building on.",
    stack: ["Supabase", "MCP", "Open source"],
  },
  {
    name: "AashiNyra",
    kind: "Commerce",
    image: "aashinyra",
    href: "https://aashinyra.com",
    description: "Tracked deals. Real price drops. UPI cashback.",
    stack: ["PostgreSQL", "D1", "R2"],
  },
  {
    name: "BoardEject",
    kind: "Developer tool",
    image: "boardeject",
    href: "https://boardeject.dev",
    description: "Apple Freeform to editable Excalidraw. Processed locally.",
    stack: ["Browser conversion", "macOS helper"],
  },
];

export default function HomePage() {
  return (
    <div className="portfolio-shell home-page">
      <section className="portfolio-hero hero-cinema">
        <div className="hero-sunset" aria-hidden="true" />
        <div className="hero-copy">
          <p className="intro-name">
            Royal Simpson Pinto <span>Software engineer</span>
          </p>
          <h1>
            <span className="hero-line">
              <span>Built from</span>
            </span>
            <span className="hero-line">
              <span className="hero-title-accent">curiosity.</span>
            </span>
          </h1>
          <p className="hero-description">
            AI agents. Full-stack products. Automation. Web3.
          </p>
          <a className="hero-open-source" href="#oss">
            <GitBranch size={15} /> Built in the open <ArrowRight size={14} />
          </a>
          <div className="hero-actions">
            <a className="primary-link" href="#work">
              Explore my work <ArrowRight size={17} />
            </a>
            <a className="quiet-link" href={siteConfig.hireUrl}>
              Let’s talk <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <figure className="portrait">
          <div className="portrait-scene">
            <div className="portrait-visual">
              <picture>
                <source srcSet="/portrait-sky.webp" type="image/webp" />
                <Image
                  src={siteConfig.avatar}
                  alt="Illustrated portrait of Royal Simpson Pinto against a blue and pink sunset sky"
                  width={460}
                  height={460}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </div>
          <figcaption>
            <span>Mangaluru, India</span>
            <span>
              {siteConfig.availabilityStatus
                ? "Open to opportunities"
                : "Currently building"}
            </span>
          </figcaption>
        </figure>
      </section>

      <a className="scroll-note" href="#work">
        <span>Scroll to explore</span>
        <ArrowRight size={15} aria-hidden="true" />
      </a>

      <KineticBand />

      <section className="selected-work" id="work">
        <div className="section-intro work-heading">
          <h2>
            A few things <span>I’ve built.</span>
          </h2>
          <Link className="quiet-link" href="/projects">
            All projects <ArrowRight size={17} />
          </Link>
        </div>
        <div className="work-grid">
          {work.map((project) => (
            <article className="work-piece" key={project.name}>
              <a
                className="work-preview"
                aria-label={`Explore ${project.name}`}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProjectVisual product={project.image} />
              </a>
              <div className="work-details">
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
                <ul
                  className="work-stack"
                  aria-label={`${project.name} engineering`}
                >
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SystemsShowcase />
      <MotionReel />

      <section className="open-source" id="oss">
        <div className="section-intro open-source-heading">
          <h2>
            Started in open source.
            <br />
            <span>Still building in it.</span>
          </h2>
          <p>
            From my first programmes to the projects I contribute to, build, and
            maintain today.
          </p>
        </div>
        <div className="open-source-journey">
          <div className="journey-start">
            <span className="journey-label">Where it started</span>
            <ul
              className="programme-strip"
              aria-label="Programmes that started my open-source journey"
            >
              <li>
                <strong>GSoC</strong>
                <span>Google Summer of Code</span>
              </li>
              <li>
                <strong>LFX</strong>
                <span>Linux Foundation’s LFX Mentorship</span>
              </li>
              <li>
                <strong>SAoC</strong>
                <span>Symmetry Autumn of Code</span>
              </li>
            </ul>
          </div>
          <div className="journey-now">
            <span className="journey-label">Where it keeps going</span>
            <a
              href="https://github.com/qdrant"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Contributing</strong>
              <span>Qdrant, compilers, networking & developer tools</span>
              <ArrowUpRight size={18} />
            </a>
            <a
              href="https://github.com/AgentPostmortem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Building & maintaining</strong>
              <span>AgentPostmortem, BoardEject & open-source tooling</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="contribution-summary">
          <strong>12,529 contributions in 2026</strong>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            View GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="contribution-calendar">
          <div
            className="contribution-wall"
            role="region"
            aria-label="GitHub contribution calendar, scroll horizontally to explore the year"
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: wallSvg }}
          />
          <div className="contribution-legend">
            <span>
              Every square is a day on GitHub.
              <small className="calendar-scroll-hint">
                Scroll to explore the year.
              </small>
            </span>
            <div aria-label="Contribution intensity from fewer to more">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <i key={level} data-level={level} aria-hidden="true" />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
        <div className="experience-facts">
          {siteConfig.stats.slice(1).map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="playground" id="frontend">
        <div className="section-intro">
          <h2>Go on. Play with it.</h2>
          <p>Physics. Light. A little browser magic.</p>
        </div>
        <div className="playground-images">
          {["fogged-glass", "magnetic-sand", "jelly-iphone"].map((slug) => (
            <a
              key={slug}
              href={`/facetworks/${slug}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="playground-image-viewport">
                <Image
                  src={`/work/${slug}.webp`}
                  alt={slug.replaceAll("-", " ")}
                  width={960}
                  height={640}
                />
              </div>
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
          href="https://royalpinto007.com/facetworks"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Facetworks <ArrowUpRight size={17} />
        </a>
        <DesignGallery compact />
      </section>
    </div>
  );
}
