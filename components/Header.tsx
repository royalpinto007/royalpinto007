"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { siteConfig } from "@/data/site";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="brand-link"
          aria-label="Royal Simpson Pinto home"
        >
          <span>Royal Simpson Pinto</span>
          <small>
            {pathname === "/"
              ? "Software engineer & open-source builder"
              : "Software engineer & creative developer"}
          </small>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                (
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                )
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a className="primary-link" href={siteConfig.hireUrl}>
            Hire me <ArrowUpRight size={15} />
          </a>
        </div>
        {pathname === "/" && (
          <details
            className="home-mobile-menu"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
          >
            <summary>
              Explore <Plus size={16} />
            </summary>
            <nav aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={(event) => {
                    const menu = event.currentTarget.closest("details");
                    if (menu) menu.open = false;
                  }}
                >
                  {link.label}
                  <ArrowUpRight size={15} />
                </Link>
              ))}
              <a href={siteConfig.hireUrl}>
                Hire me <ArrowUpRight size={15} />
              </a>
            </nav>
          </details>
        )}
      </div>
    </header>
  );
}
