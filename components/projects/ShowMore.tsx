"use client";

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/** Extra cards stay in the page (hidden) and open in place; the toggle sits below them. */
export function ShowMore({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    // Closing removes the cards above the button; keep the button where the reader is.
    if (!next)
      requestAnimationFrame(() =>
        button.current?.scrollIntoView({ block: "center", behavior: "instant" }),
      );
  };

  return (
    <div className="collage-expand" data-open={open}>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        ref={button}
        type="button"
        className="collage-expand-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        {open ? "Show less" : `Show ${count} more`}
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
