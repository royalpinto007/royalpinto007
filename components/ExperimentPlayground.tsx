"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";

const experiments = [
  { slug: "fogged-glass", name: "Fogged Glass" },
  { slug: "magnetic-sand", name: "Magnetic Sand" },
  { slug: "jelly-iphone", name: "Jelly iPhone" },
];

/** Mount only the chosen experiment; the initial page loads no demo runtimes. */
export function ExperimentPlayground() {
  const [active, setActive] = useState<string | null>(null);
  const launchers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeControl = useRef<HTMLButtonElement>(null);
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (active) closeControl.current?.focus({ preventScroll: true });
    else if (previous.current)
      launchers.current[previous.current]?.focus({ preventScroll: true });
    previous.current = active;
  }, [active]);
  return (
    <div
      className="playground-images"
      onKeyDown={(event) => {
        if (event.key === "Escape") setActive(null);
      }}
    >
      {experiments.map(({ slug, name }) => (
        <article
          className="experiment-preview"
          key={slug}
          data-active={active === slug}
        >
          <div className="playground-image-viewport">
            <Image
              src={`/work/${slug}.webp`}
              alt={name}
              width={960}
              height={640}
            />
            {active === slug ? (
              <>
                <iframe
                  src={`/facetworks/${slug}/`}
                  title={`Interactive ${name} experiment`}
                  loading="lazy"
                  onLoad={(event) =>
                    event.currentTarget.contentDocument?.addEventListener(
                      "keydown",
                      (key) => {
                        if (key.key === "Escape") setActive(null);
                      },
                    )
                  }
                />
                <button
                  className="experiment-close"
                  ref={closeControl}
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label={`Close ${name} preview`}
                >
                  <X size={17} /> Close
                </button>
              </>
            ) : (
              <button
                className="experiment-play"
                ref={(node) => {
                  launchers.current[slug] = node;
                }}
                type="button"
                onClick={() => setActive(slug)}
                aria-label={`Try ${name} here`}
              >
                <Play size={18} fill="currentColor" /> Try it here
              </button>
            )}
          </div>
          <a
            href={`/facetworks/${slug}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
            <ArrowUpRight size={16} />
          </a>
        </article>
      ))}
    </div>
  );
}
