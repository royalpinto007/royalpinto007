"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { profile } from "@/data/profile";
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
          prefetch={false}
          className="brand-link"
          aria-label="Royal Simpson Pinto home"
        >
          <span>Royal Simpson Pinto</span>
          <small>Indie dev · Freelancer · Open source</small>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
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
          <a className="primary-link" href={profile.hireUrl}>
            Hire me <ArrowUpRight size={15} />
          </a>
        </div>
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
            Menu <Plus size={16} aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {navLinks.map((link, index) => (
              <Link
                href={link.href}
                prefetch={false}
                key={link.href}
                aria-current={
                  (
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href)
                  )
                    ? "page"
                    : undefined
                }
                onClick={(event) => {
                  const menu = event.currentTarget.closest("details");
                  if (menu) menu.open = false;
                }}
              >
                <span className="menu-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{link.label}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
            <a href={profile.hireUrl}>
              Hire me <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
