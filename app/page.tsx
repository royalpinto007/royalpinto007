import "./home.css";
import "./home-experience.css";
import "./coastal-home.css";
import "./home-environments.css";
import "./coastal-motion.css";
import "./ambient-coast.css";
import "./kinetic-opening.css";
import "./orbital-hero.css";
import "./home-discovery.css";
import "./reel.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { MotionReel } from "@/components/MotionReel";
import { BoardDemo } from "@/components/BoardDemo";
import { ContributionWall } from "@/components/ContributionWall";
import { CinematicHero } from "@/components/CinematicHero";
import { TypingDescriptor } from "@/components/TypingDescriptor";
import { HomeProjectExplorer } from "@/components/HomeProjectExplorer";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SystemsShowcase } from "@/components/SystemsShowcase";
import { SceneEnvironment } from "@/components/SceneEnvironment";
import { siteConfig } from "@/data/site";

const work = [
  {
    name: "BoardEject",
    kind: "Developer tool",
    image: "boardeject",
    scene: "pavilion",
    href: "https://boardeject.dev",
    description: "Apple Freeform to editable Excalidraw. Processed locally.",
    stack: ["Browser conversion", "macOS helper"],
  },
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
] as const;

export default function HomePage() {
  return (
    <div className="portfolio-shell home-page">
      <CinematicHero>
        <div className="hero-copy">
          <p className="intro-name">
            <strong>Software engineer</strong>
            <span>Indie dev · Freelancer</span>
          </p>
          <h1>
            <span className="hero-line">
              <span>I build</span>
            </span>
            <span className="hero-line">
              <span className="hero-title-accent">software.</span>
            </span>
          </h1>
          <div className="hero-details">
            <TypingDescriptor />
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

      <MotionReel />

      <section
        className="open-source open-source-experience"
        id="oss"
        aria-labelledby="source-title"
      >
        <div className="section-intro open-source-heading">
          <h2 id="source-title">Open by default.</h2>
          <p>
            Write code. Review PRs. Maintain projects.
            <br />
            Open source is part of the work.
          </p>
        </div>
        <div className="contribution-summary">
          <strong>12,623 contributions in 2026</strong>
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
            <strong>Still contributing, building and maintaining.</strong>
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
                    Selected
                    <br />
                    <span>projects.</span>
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
                  View {project.name}
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SystemsShowcase />

      <HomeProjectExplorer />
    </div>
  );
}
