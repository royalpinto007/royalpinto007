"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { profile } from "@/data/profile";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  // The mobile menu hides its links, so viewport prefetching never sees them.
  // Fetch the other main pages once the browser is idle so a tap is instant.
  useEffect(() => {
    const prefetch = () =>
      navLinks
        .filter((link) => link.href !== pathname)
        .forEach((link) => router.prefetch(link.href));
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(prefetch, 1500);
    return () => window.clearTimeout(timer);
  }, [pathname, router]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
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
          <Link className="primary-link" href={profile.hireUrl}>
            Hire me <ArrowRight size={15} />
          </Link>
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
            <Link
              href={profile.hireUrl}
              onClick={(event) => {
                const menu = event.currentTarget.closest("details");
                if (menu) menu.open = false;
              }}
            >
              Hire me <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
