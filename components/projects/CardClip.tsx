"use client";

import { useEffect, useRef, useState } from "react";
import "./card-clip.css";

/** A silent loop over a card's screenshot. It loads and plays only while the card is on screen,
 *  and stays off for people who prefer reduced motion. */
export function CardClip({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else video.pause();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className="card-clip"
      data-playing={playing || undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    />
  );
}
