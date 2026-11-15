"use client";

import { useEffect, useRef, useState } from "react";
import { Asterisk, Pause, Play } from "lucide-react";

const disciplines = [
  "AI agents",
  "Full stack",
  "Automation",
  "Web3",
  "Open source",
];

export function KineticBand() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let inView = false;
    const sync = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div
      ref={host}
      className="kinetic-band"
      data-active={active}
      data-paused={paused}
    >
      <p className="sr-only">
        AI agents, full-stack development, automation, Web3, and open source.
      </p>
      <div className="kinetic-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="kinetic-group" key={copy}>
            {disciplines.map((label) => (
              <span key={label}>
                {label}
                <Asterisk />
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="band-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Play moving text" : "Pause moving text"}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
