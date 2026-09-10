"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="brand-link"
          aria-label="RSP, Royal Simpson Pinto home"
        >
          RSP
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
          <button
            className="theme-button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <Sun className="hidden dark:block" size={16} />
            <Moon className="dark:hidden" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
