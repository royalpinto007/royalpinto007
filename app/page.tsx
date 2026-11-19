import "@/styles/home/home.css";
import "@/styles/home/home-experience.css";
import "@/styles/home/coastal-home.css";
import "@/styles/home/home-environments.css";
import "@/styles/home/coastal-motion.css";
import "@/styles/home/ambient-coast.css";
import "@/styles/home/kinetic-opening.css";
import "@/styles/home/orbital-hero.css";
import "@/styles/home/home-discovery.css";
import "@/styles/home/reel.css";
import "@/styles/home/hero-refine.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Coffee, Star } from "lucide-react";
import { MotionReel } from "@/components/home/MotionReel";
import { BoardDemo } from "@/components/home/BoardDemo";
import { ContributionCalendar } from "@/components/home/ContributionCalendar";
import contributions from "@/content/contributions.json";
import { CinematicHero } from "@/components/home/CinematicHero";
import { TypingDescriptor } from "@/components/home/TypingDescriptor";
import { HomeProjectExplorer } from "@/components/home/HomeProjectExplorer";
import { ProjectVisual } from "@/components/home/ProjectVisual";
import { jsonLdScript, personJsonLd } from "@/lib/seo";
import { SystemsShowcase } from "@/components/home/SystemsShowcase";
import { SceneEnvironment } from "@/components/scenery/SceneEnvironment";
import { siteConfig } from "@/lib/data/site";

const work = [
  {
    name: "AgentPostmortem",
    kind: "Open source",
    image: "agentpostmortem",
    scene: "observatory",
    href: "https://github.com/AgentPostmortem/agentpostmortem",
    description:
      "Find out how your AI agent fails before your customers do. 25 failure scenarios, judged by real side effects.",
    stack: ["Python + MCP", "On PyPI"],
  },
  {
    name: "BoardEject",
    kind: "Developer tool",
    image: "boardeject",
    scene: "pavilion",
    href: "https://boardeject.dev",
    description:
      "Freeform boards to editable Excalidraw, or a verified local archive. Nothing is uploaded.",
    stack: ["Export + archive", "macOS helper"],
  },
  {
    name: "SignalizeAI",
    kind: "AI product",
    image: "signalizeai",
    scene: "marina",
    href: "https://signalizeai.org",
    description:
      "Research any company once. Get told when its pricing, hiring or messaging changes.",
    stack: ["Browser extension", "Change alerts"],
  },
  {
    name: "AashiNyra",
    kind: "Commerce",
    image: "aashinyra",
    scene: "conservatory",
    href: "https://aashinyra.com",
    description: "Tracked deals. Real price drops. UPI cashback.",
    stack: ["Workers + D1", "Nightly price jobs"],
  },
] as const;

export default function HomePage() {
  return (
    <div className="portfolio-shell home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(personJsonLd())}
      />
      <CinematicHero>
        <div className="hero-copy">
          <p className="intro-name">
            <strong>Software engineer</strong>
          </p>
          <h1>
            <span className="hero-line">
              <span>I build</span>
            </span>
            <span className="hero-line">
              <span className="hero-title-accent">software</span>
            </span>
          </h1>
          <div className="hero-details">
            <TypingDescriptor />
            <div className="hero-support" aria-label="Support my work">
              <a
                href="https://www.buymeacoffee.com/royalpinto007"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Coffee size={18} aria-hidden="true" /> Buy me a coffee
              </a>
              <a
                href="https://github.com/royalpinto007/royalpinto007"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star size={18} aria-hidden="true" /> Like this site? Star it on
                GitHub
              </a>
            </div>
          </div>
        </div>
        <figure className="portrait">
          <div className="portrait-scene portrait-person">
            <picture>
              <source srcSet="https://assets.royalpinto007.com/portrait-enhanced.webp" type="image/webp" />
              <Image
                src={siteConfig.avatar}
                alt="Illustrated portrait of Royal Simpson Pinto against a blue and pink sunset sky"
                width={1254}
                height={1254}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
          <svg
            width="0"
            height="0"
            aria-hidden="true"
            style={{ position: "absolute" }}
          >
            <defs>
              <filter
                id="portrait-clean-edge"
                x="-2%"
                y="-2%"
                width="104%"
                height="104%"
                colorInterpolationFilters="sRGB"
              >
                <feMorphology
                  in="SourceAlpha"
                  operator="erode"
                  radius="0.8"
                  result="tight"
                />
                <feGaussianBlur in="tight" stdDeviation=".15" result="soft" />
                <feComposite in="SourceGraphic" in2="soft" operator="in" />
              </filter>
            </defs>
          </svg>
        </figure>
      </CinematicHero>

      <section
        className="open-source open-source-experience"
        id="oss"
        aria-labelledby="source-title"
      >
        <div className="section-intro open-source-heading">
          <h2 id="source-title">Open by default</h2>
        </div>
        <ContributionCalendar
          years={contributions.years}
          profile={siteConfig.github}
        />
        <div className="source-origin journey-start">
          {siteConfig.stats
            .filter((stat) => stat.label === "Students mentored")
            .map((stat) => (
              <p className="mentoring-fact" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </p>
            ))}
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
              <span>Linux Foundation</span>
            </li>
            <li>
              <strong>SAoC</strong>
              <span>Symmetry Autumn of Code</span>
            </li>
          </ul>
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
                    <span>projects</span>
                  </h2>
                  <Link
                    className="go-link go-link-surface"
                    data-direction="forward"
                    href="/projects"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="go-link-label">All projects</span>
                    <span className="go-link-icon" aria-hidden="true">
                      <ArrowRight />
                    </span>
                  </Link>
                </header>
              )}
              <div className="work-preview">
                {project.image === "boardeject" ? (
                  <BoardDemo name={project.name} href={project.href} />
                ) : (
                  <>
                    <ProjectVisual product={project.image} />
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
                  </>
                )}
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
                  className="go-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="go-link-label">View {project.name}</span>
                  <span className="go-link-icon" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MotionReel />
      <SystemsShowcase />

      <HomeProjectExplorer />
    </div>
  );
}
