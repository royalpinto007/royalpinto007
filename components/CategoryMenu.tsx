"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

export function CategoryMenu({
  items,
}: {
  items: { id: string; title: string }[];
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        menu.current?.open
      )
        menu.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return (
    <details
      className="category-menu"
      ref={menu}
      onToggle={(event) => {
        const details = event.currentTarget;
        if (!details.open) return;
        const summary = details.querySelector("summary");
        const nav = details.querySelector("nav");
        if (!summary || !nav) return;
        const rect = summary.getBoundingClientRect();
        const headerHeight =
          document.querySelector(".site-header")?.getBoundingClientRect()
            .height ?? 64;
        const below = innerHeight - rect.bottom - 20;
        const above = rect.top - headerHeight - 20;
        const side = below >= 220 || below >= above ? "down" : "up";
        details.dataset.side = side;
        nav.style.maxHeight = `${Math.max(100, Math.min(420, side === "down" ? below : above))}px`;
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>
        Browse by category <ChevronDown size={16} />
      </summary>
      <nav aria-label="Browse project categories">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => {
              if (menu.current) menu.current.open = false;
            }}
          >
            <span>{item.title}</span>
            <ArrowUpRight size={16} />
          </a>
        ))}
      </nav>
    </details>
  );
}
