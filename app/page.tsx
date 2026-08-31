import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Layers,
  Brain,
  Server,
  Palette,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStackGrid } from "@/components/TechStackGrid";
import { siteConfig } from "@/data/site";

const serviceIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Layers,
  Brain,
  Server,
  Palette,
};

const wallSvg = readFileSync(
  path.join(process.cwd(), "public", "wall2026.svg"),
  "utf8",
);

export default function HomePage() {
  const pick = (ids: string[]) =>
    ids
      .map((id) => siteConfig.projects.find((p) => p.id === id))
      .filter((p): p is (typeof siteConfig.projects)[number] => Boolean(p));

  const projectGroups = [
    {
      label: "Flagship",
      items: pick([
        "signalizeai",
        "aashinyra",
        "kabootar",
        "tiny-day",
        "auralis",
        "mycelia",
      ]),
    },
    {
      label: "AI engineering stack",
      items: pick([
        "tenantq",
        "vaultrag",
        "mcp-audit",
        "skill-audit",
        "evalgate",
        "answerproof",
        "ctxlens",
        "ctxtrim",
        "injection-arena",
        "agentrace",
        "voiceeval",
        "relayg",
        "casebook-mcp",
        "casebook-chat",
        "distro-skills",
      ]),
    },
    {
      label: "Agent suite",
      items: pick([
        "resolvd",
        "tracecase",
        "webhands",
        "bridgekit",
        "greenlite",
      ]),
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
      {/* Hero */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="glow" aria-hidden />
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-14 lg:gap-20">
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-6 flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              {siteConfig.role} — {siteConfig.location}
            </div>
            <h1 className="display text-5xl sm:text-7xl lg:text-[5.5rem] text-ink mb-8">
              I build{" "}
              <span className="display-em text-accent">AI products</span>
              <br />
              that actually ship.
            </h1>
            <p className="text-lg text-mute leading-relaxed mb-9 max-w-xl">
              {siteConfig.name}. AI agents, permission-aware RAG, and voice and
              agent evals, with the full-stack around all of it, plus an offline
              mesh messenger for when there is no internet.{" "}
              <span className="text-ink">
                Fifteen-plus products live, open source every single day.
              </span>
            </p>
            <div className="flex flex-wrap gap-2.5 mb-10">
              <span className="mono inline-flex items-center gap-2 text-[11px] px-3.5 py-1.5 rounded-full border border-line text-mute">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Available for work
              </span>
              <span className="mono inline-flex items-center gap-2 text-[11px] px-3.5 py-1.5 rounded-full border border-line text-mute">
                <MapPin className="w-3 h-3" /> {siteConfig.timezone}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.hireUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-bg text-sm font-semibold px-6 py-3 rounded-full hover:bg-accent-hover transition-colors"
              >
                Hire me <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-line-strong text-ink text-sm px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors"
              >
                View projects <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-mute text-sm px-4 py-3 hover:text-ink transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-full border border-line"
                aria-hidden
              />
              <img
                src={siteConfig.avatar}
                alt={siteConfig.name}
                width={448}
                height={448}
                fetchPriority="high"
                className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover border border-line-strong"
              />
              <span className="mono absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full border border-line bg-panel text-mute whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Open to work
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="grid grid-cols-3 border-y border-line">
          {siteConfig.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-9 sm:py-11 text-center ${
                i > 0 ? "border-l border-line" : ""
              }`}
            >
              <div className="display text-4xl sm:text-6xl text-accent">
                {stat.value}
              </div>
              <div className="mono text-[11px] text-faint mt-3 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 01 — Open source graph */}
      <section className="py-20 border-b border-line">
        <div className="reveal">
          <SectionHeader
            index="01"
            eyebrow="Open source, every day"
            title="The graph is the"
            titleEm="habit."
            subtitle="5,810 contributions in 2026. GSoC, Linux Foundation (LFX), and Symmetry Autumn of Code. Not a sprint — a practice."
          />
        </div>
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal mt-10 block p-6 rounded-2xl border border-line bg-panel hover:border-accent/50 transition-colors"
        >
          {/* Inlined so page CSS can theme the cell fills (an <img> cannot be
              styled by the page). The file is generated by scripts/gen-wall.mjs. */}
          <div
            className="w-full [&>svg]:w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: wallSvg }}
          />
          <span className="mono inline-block mt-4 text-xs text-mute">
            2026 · github.com/royalpinto007 &rarr;
          </span>
        </a>
      </section>

      {/* 02 — Services */}
      <section className="py-20 border-b border-line">
        <div className="reveal">
          <SectionHeader
            index="02"
            eyebrow="What I do"
            title="Where I"
            titleEm="add value"
            subtitle="From product vision to production deployment."
          />
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.services.map((service, i) => {
            const Icon = serviceIconMap[service.icon];
            return (
              <div
                key={service.title}
                data-d={String((i % 3) + 1)}
                className="reveal group p-6 rounded-2xl border border-line bg-panel hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-full border border-line flex items-center justify-center mb-5 group-hover:border-accent transition-colors">
                  {Icon && <Icon className="w-4.5 h-4.5 text-accent" />}
                </div>
                <h3 className="display text-xl text-ink mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-mute mb-5 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="mono text-[10px] px-2.5 py-1 rounded-full border border-line text-mute"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03 — Work */}
      <section className="py-20 border-b border-line">
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeader
            index="03"
            eyebrow="Work"
            title="Everything"
            titleEm="I've shipped"
            subtitle="Flagship products, the AI-engineering stack, and the live agent suite."
          />
          <Link
            href="/projects"
            className="mono text-xs text-accent hover:text-accent-hover flex-shrink-0 whitespace-nowrap transition-colors"
          >
            All projects &rarr;
          </Link>
        </div>
        <div className="mt-10 space-y-12">
          {projectGroups.map((group) => (
            <div key={group.label}>
              <div className="eyebrow text-faint mb-5">{group.label}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((project, i) => (
                  <div
                    key={project.id}
                    data-d={String((i % 3) + 1)}
                    className="reveal"
                  >
                    <ProjectCard {...project} compact />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — Frontend design */}
      <section className="py-20 border-b border-line">
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeader
            index="04"
            eyebrow="Frontend design"
            title="Ten sites,"
            titleEm="one bar"
            subtitle="Design-forward, multi-page marketing sites, each a distinct genre and visual identity, built static-first with Astro and verified to render fully without JavaScript."
          />
          <a
            href="https://frequency.signalizeai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs text-accent hover:text-accent-hover flex-shrink-0 whitespace-nowrap transition-colors"
          >
            See one live &rarr;
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {siteConfig.frontendSites.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              data-d={String((i % 3) + 1)}
              className="reveal group flex flex-col gap-1 p-5 rounded-2xl border border-line bg-panel hover:border-accent/50 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="display text-lg text-ink flex items-center justify-between">
                {s.name}
                <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-accent transition-colors" />
              </span>
              <span className="mono text-[10px] uppercase tracking-wider text-faint">
                {s.genre}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 05 — Toolkit */}
      <section className="py-20 border-b border-line">
        <div className="reveal">
          <SectionHeader
            index="05"
            eyebrow="Toolkit"
            title="What I"
            titleEm="build with"
            subtitle="The tools and technologies I reach for most."
          />
        </div>
        <div className="reveal mt-10">
          <TechStackGrid />
        </div>
      </section>
    </div>
  );
}
