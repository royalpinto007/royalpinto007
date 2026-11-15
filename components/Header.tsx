"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
      </div>
    </header>
  );
}
