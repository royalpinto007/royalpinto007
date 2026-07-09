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
import { BlogCard } from "@/components/BlogCard";
import { siteConfig } from "@/data/site";
import { fetchMediumPosts } from "@/lib/medium";

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Brain,
  Server,
  Palette,
};

export default async function HomePage() {
  const featuredProjects = siteConfig.projects.filter((p) => p.featured).slice(0, 4);
  const latestPosts = await fetchMediumPosts(siteConfig.mediumFeedUrl, 3);

  return (
    <div className="max-w-[1300px] mx-auto px-5 sm:px-8">
      {/* Hero */}
      <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          <div className="flex-1 min-w-0 reveal">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent mb-6">
              {siteConfig.role} — {siteConfig.location}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-ink tracking-tight mb-7 leading-[1.05] font-normal">
              I build <span className="display-em text-accent">AI products</span>
              <br />
              that actually ship.
            </h1>
            <p className="text-lg text-mute leading-relaxed mb-8 max-w-xl">
              {siteConfig.name}. Agentic workflows with n8n and the Claude API,
              browser extensions with real users, and 1500+ contributions to open
              source compilers and networking systems.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-10">
              <span className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border border-line text-mute">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Available for work
              </span>
              <span className="inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border border-line text-mute">
                <MapPin className="w-3 h-3" /> {siteConfig.timezone}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
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
          <div className="flex-shrink-0 reveal reveal-2">
            <img
              src={siteConfig.avatar}
              alt={siteConfig.name}
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-full object-cover border border-line-strong"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 border-b border-line">
        <div className="grid grid-cols-3 gap-px bg-line rounded-xl overflow-hidden border border-line">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 sm:p-8 bg-panel">
              <div className="display-em text-3xl sm:text-4xl text-accent">{stat.value}</div>
              <div className="text-xs text-mute mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Currently */}
      <section className="py-20 border-b border-line">
        <SectionHeader eyebrow="Right now" title="Currently" titleEm="in motion" />
        <div className="grid sm:grid-cols-2 gap-4">
          {siteConfig.currently.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 rounded-xl border border-line bg-panel"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="text-sm text-mute leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 border-b border-line">
        <SectionHeader
          eyebrow="What I do"
          title="Where I can"
          titleEm="add value"
          subtitle="From product vision to production deployment."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.services.map((service) => {
            const Icon = serviceIconMap[service.icon];
            return (
              <div
                key={service.title}
                className="p-6 rounded-xl border border-line bg-panel hover:border-line-strong transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center mb-5">
                  {Icon && <Icon className="w-4.5 h-4.5 text-accent" />}
                </div>
                <h3 className="text-ink mb-2">{service.title}</h3>
                <p className="text-sm text-mute mb-5 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-line text-mute"
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

      {/* Featured Projects */}
      <section className="py-20 border-b border-line">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            eyebrow="Work"
            title="Featured"
            titleEm="work"
            subtitle="Live products people use today."
          />
          <Link
            href="/projects"
            className="text-sm text-accent hover:text-accent-hover flex-shrink-0 mb-12 transition-colors"
          >
            All projects →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 border-b border-line">
        <SectionHeader
          eyebrow="Skills"
          title="What I"
          titleEm="build with"
          subtitle="The tools and technologies I reach for most."
        />
        <TechStackGrid />
      </section>

      {/* Blog */}
      {latestPosts.length > 0 && (
        <section className="py-20 border-b border-line">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader
              eyebrow="Writing"
              title="Latest"
              titleEm="writing"
              subtitle="Thoughts on AI, engineering, and building products."
            />
            <Link
              href="/blog"
              className="text-sm text-accent hover:text-accent-hover flex-shrink-0 mb-12 transition-colors"
            >
              All posts →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post, i) => (
              <BlogCard key={i} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="rounded-xl border border-line bg-panel p-10 sm:p-16 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent tracking-wide">Available now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-ink mb-4 font-normal">
            Building something <span className="display-em text-accent">with AI?</span>
          </h2>
          <p className="text-mute mb-9 max-w-md mx-auto leading-relaxed">
            Five live agents are already running at hire.agentpostmortem.com. Tell me
            what you&apos;re building and I&apos;ll help you ship it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={siteConfig.hireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-bg text-sm font-semibold px-7 py-3 rounded-full hover:bg-accent-hover transition-colors"
            >
              Hire me <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="border border-line-strong text-ink text-sm px-7 py-3 rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              Email me
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
