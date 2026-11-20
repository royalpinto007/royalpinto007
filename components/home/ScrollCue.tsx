"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** "Scroll" hint pinned to the bottom of the first screen; it leaves on the first scroll. */
export function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(window.scrollY < 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      className="scroll-cue"
      href="#work"
      data-visible={visible}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span>Scroll</span>
      <ChevronDown size={18} aria-hidden="true" />
    </a>
  );
}
