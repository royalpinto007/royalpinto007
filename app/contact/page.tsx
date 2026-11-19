import "./contact.css";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, Calendar, Mail } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/BrandIcons";
import { ProjectsScenery } from "@/components/ProjectsScenery";
import { WorldScene } from "@/components/WorldScene";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Contact Royal Simpson Pinto about software, AI agent and full-stack work. Email or book a call to talk freelance projects, roles and open source.",
});

export default function ContactPage() {
  return (
    <div className="portfolio-shell contact-page">
      <header className="contact-heading" data-motion-intro>
        <ProjectsScenery scene="conservatory" priority />
        <div className="contact-copy">
          <p className="contact-kicker">Have something in mind?</p>
          <h1>
            Let’s <span>talk</span>
          </h1>
          <p className="contact-intro">
            Send the brief, the repo or the idea. Let’s figure out what to
            build.
          </p>
        </div>
        <WorldScene kind="telephone" priority />
      </header>
      <section className="contact-actions" aria-label="Direct contact">
        <a className="contact-channel" href={`mailto:${siteConfig.email}`}>
          <Mail size={28} aria-hidden="true" />
          <h2>Email me</h2>
          <p>{siteConfig.email}</p>
          <span className="contact-channel-action">
            Send email <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </a>
        <a
          className="contact-channel"
          href={siteConfig.calendarLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Calendar size={28} aria-hidden="true" />
          <h2>Book a call</h2>
          <p>Pick a time that works for you.</p>
          <span className="contact-channel-action">
            Choose a time <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </a>
      </section>
      <nav className="contact-socials" aria-label="Follow my work">
        <p>Code, experiments and what’s next.</p>
        <div className="contact-social-icons">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href={siteConfig.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            title="X"
          >
            <TwitterIcon />
          </a>
        </div>
      </nav>
    </div>
  );
}
