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
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="display text-2xl text-ink group-hover:text-accent transition-colors">
            {siteConfig.initials}
          </span>
          <span className="mono hidden sm:inline text-[10px] text-faint tracking-widest">
            {siteConfig.name.split(" ")[0].toUpperCase()}
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm transition-colors ${
                  active ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={siteConfig.hireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-bg bg-accent hover:bg-accent-hover px-4 py-1.5 rounded-full transition-colors"
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
