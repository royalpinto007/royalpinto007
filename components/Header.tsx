"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const onHome = pathname === "/";
  // Over the home hero the bar is clear so the sky runs to the top; it turns
  // frosted once the page scrolls. The hero slides under it by --header-h.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${header.offsetHeight}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
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
    <header
      ref={headerRef}
      className={`site-header${onHome ? " on-home" : ""}${scrolled ? " is-scrolled" : ""}`}
    >
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
          </nav>
        </details>
      </div>
    </header>
  );
}
