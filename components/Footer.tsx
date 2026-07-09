import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/BrandIcons";
import { siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg mt-24">
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2">
            <div className="display-em text-2xl mb-3 text-ink">{siteConfig.name}</div>
            <p className="text-sm text-mute leading-relaxed max-w-xs">{siteConfig.shortBio}</p>
            <p className="text-xs text-faint mt-2">{siteConfig.location}</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: GithubIcon, href: siteConfig.github },
                { icon: LinkedinIcon, href: siteConfig.linkedin },
                { icon: TwitterIcon, href: siteConfig.twitter },
                { icon: Mail, href: `mailto:${siteConfig.email}` },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-accent hover:border-accent transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(siteConfig.footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint mb-4">
                {group}
              </div>
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
          <p className="text-xs text-faint">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href={siteConfig.hireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accent-hover transition-colors"
          >
            Hire me — five live agents at hire.agentpostmortem.com
          </a>
        </div>
      </div>
    </footer>
  );
}
