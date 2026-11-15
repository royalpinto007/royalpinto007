import "./home.css";
import "./home-experience.css";
import "./coastal-home.css";
import "./home-environments.css";
import "./coastal-motion.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, GitBranch } from "lucide-react";
import { DesignGallery } from "@/components/DesignGallery";
import { MotionReel } from "@/components/MotionReel";
import { KineticBand } from "@/components/KineticBand";
import { ExperimentPlayground } from "@/components/ExperimentPlayground";
import { CoastalSculpture } from "@/components/CoastalSculpture";
import { BoardDemo } from "@/components/BoardDemo";
import { ContributionWall } from "@/components/ContributionWall";
import { CinematicHero } from "@/components/CinematicHero";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SystemsShowcase } from "@/components/SystemsShowcase";
import { SceneEnvironment } from "@/components/SceneEnvironment";
import { siteConfig } from "@/data/site";

const work = [
  {
    name: "SignalizeAI",
    kind: "AI product",
    image: "signalizeai",
    scene: "marina",
    href: "https://signalizeai.org",
    description: "Account research, right inside your browser.",
    stack: ["Browser extension", "AI workflows"],
  },
  {
    name: "AashiNyra",
    kind: "Commerce",
    image: "aashinyra",
    scene: "conservatory",
    href: "https://aashinyra.com",
    description: "Tracked deals. Real price drops. UPI cashback.",
    stack: ["PostgreSQL", "D1", "R2"],
  },
  {
    name: "BoardEject",
    kind: "Developer tool",
    image: "boardeject",
    scene: "pavilion",
    href: "https://boardeject.dev",
    description: "Apple Freeform to editable Excalidraw. Processed locally.",
    stack: ["Browser conversion", "macOS helper"],
  },
] as const;

export default function HomePage() {
  return (
    <div className="portfolio-shell home-page">
      <CinematicHero>
        <div className="hero-copy">
          <p className="intro-name">
            Software engineer <span>Independent builder</span>
          </p>
          <h1>
            <span className="hero-line">
              <span>Build</span>
            </span>
            <span className="hero-line">
              <span className="hero-title-accent">beyond.</span>
            </span>
          </h1>
          <div className="hero-details">
            <p className="hero-description">
              AI agents. Full-stack. Automation. Web3.
            </p>
            <a className="hero-open-source" href="#oss">
              <GitBranch size={13} /> Built in the open <ArrowRight size={13} />
            </a>
          </div>
        </div>
        <figure className="portrait">
          <div className="portrait-scene portrait-person">
            <picture>
              <source srcSet="/portrait-original.webp" type="image/webp" />
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
        </figure>
      </CinematicHero>

      <KineticBand />

      <section
        className="selected-work immersive-work"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="work-grid">
          {work.map((project, i) => (
            <article
              className={`work-piece work-world work-world-${project.image}`}
              key={project.name}
            >
              <SceneEnvironment scene={project.scene} />
              {i === 0 && (
                <header className="section-intro work-heading chapter-heading">
                  <h2 id="work-title">
                    Ideas,
                    <br />
                    <span>shipped.</span>
                  </h2>
                  <Link
                    className="quiet-link"
                    href="/projects"
                    prefetch={false}
                  >
                    All projects <ArrowRight size={17} />
                  </Link>
                </header>
              )}
              <div className="work-preview">
                {project.image === "boardeject" ? (
                  <BoardDemo />
                ) : (
                  <ProjectVisual product={project.image} />
                )}
                <a
                  className="work-preview-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    Explore {project.name} <ArrowUpRight size={15} />
                  </span>
                </a>
              </div>
              <div className="work-details">
                <p className="work-index">
                  <span>0{i + 1}</span> {project.kind}
                </p>
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
                <a
                  className="work-visit"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore {project.name}
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SystemsShowcase />
      <MotionReel />

      <section
        className="open-source open-source-experience"
        id="oss"
        aria-labelledby="source-title"
      >
        <div className="section-intro open-source-heading">
          <h2 id="source-title">Open by default.</h2>
          <p>
            Contribute. Create. Maintain.
            <br />
            Keep the good ideas moving.
          </p>
        </div>
        <div className="contribution-summary">
          <strong>12,529 contributions in 2026</strong>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            View GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="contribution-calendar">
          <ContributionWall />
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
        <div className="source-origin journey-start">
          <p>
            Where it started.
            <br />
            <strong>Still building, well beyond the programmes.</strong>
          </p>
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
        <div className="experience-facts">
          {siteConfig.stats.slice(1).map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="playground immersive-chapter"
        id="frontend"
        aria-labelledby="playground-title"
      >
        <SceneEnvironment scene="tidal" />
        <header className="section-intro world-heading playground-heading chapter-heading">
          <h2 id="playground-title">
            A little
            <br />
            <span>browser magic.</span>
          </h2>
          <p>Touch, drag, explore.</p>
          <CoastalSculpture />
        </header>
        <ExperimentPlayground />
        <div className="gallery-heading">
          <h3>More from Facetworks.</h3>
          <a
            className="quiet-link"
            href="https://royalpinto007.com/facetworks"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Facetworks <ArrowUpRight size={17} />
          </a>
        </div>
        <DesignGallery compact />
      </section>
    </div>
  );
}
