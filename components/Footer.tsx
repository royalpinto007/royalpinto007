import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/BrandIcons";
import { siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-bg mt-28 overflow-hidden">
      <div className="glow opacity-60" aria-hidden />
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16">
        {/* Big closing wordmark */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-14 border-b border-line">
          <div>
            <div className="display text-5xl sm:text-6xl text-ink leading-none">
              Let&apos;s build
              <br />
              <span className="display-em text-accent">something.</span>
            </div>
          </div>
          <a
            href={siteConfig.hireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-bg bg-accent hover:bg-accent-hover px-6 py-3 rounded-full transition-colors"
          >
            Hire me — five live agents
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 py-14">
          <div className="sm:col-span-2">
            <div className="display text-2xl mb-3 text-ink">{siteConfig.name}</div>
            <p className="text-sm text-mute leading-relaxed max-w-xs">
              {siteConfig.shortBio}
            </p>
            <p className="mono text-xs text-faint mt-3">{siteConfig.location}</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: GithubIcon, href: siteConfig.github, label: "GitHub" },
                { icon: LinkedinIcon, href: siteConfig.linkedin, label: "LinkedIn" },
                { icon: TwitterIcon, href: siteConfig.twitter, label: "Twitter" },
                { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-accent hover:border-accent transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(siteConfig.footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="eyebrow text-faint mb-4">{group}</div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mute hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="mono text-xs text-faint">
            © {year} {siteConfig.name}
          </p>
          <p className="mono text-xs text-faint">Built and shipped, daily.</p>
        </div>
      </div>
    </footer>
  );
}
