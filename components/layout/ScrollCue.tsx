"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** "Scroll" hint pinned to the bottom of the first screen. A click reveals the rest of the
 *  opening section (never jumping past it), and the hint leaves on the first scroll. */
export function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(window.scrollY < 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const down = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reveal the rest of the opening section first (on phones the portrait sits below the
    // fold); if it already fits, move down one screen.
    const opening = document.querySelector(".portfolio-hero, .projects-heading");
    const rest = opening ? opening.getBoundingClientRect().bottom - window.innerHeight : 0;
    const top = rest > 40 ? rest : window.innerHeight * 0.85;
    window.scrollBy({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="scroll-cue"
      data-visible={visible}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={down}
    >
      <span>Scroll</span>
      <ChevronDown size={18} aria-hidden="true" />
    </button>
  );
}
