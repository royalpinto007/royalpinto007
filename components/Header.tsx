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
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="display-em text-xl text-ink hover:text-accent transition-colors"
        >
          {siteConfig.initials}
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 text-sm tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-ink"
                  : "text-mute hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.hireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover border border-line-strong hover:border-accent px-4 py-1.5 rounded-full transition-colors"
          >
            Hire me <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-mute hover:text-ink border border-transparent hover:border-line transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
