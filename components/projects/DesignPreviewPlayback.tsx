"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function DesignPreviewPlayback() {
  const button = useRef<HTMLButtonElement>(null);
  const enabled = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const control = button.current;
    const gallery = control?.closest(".facetworks-page");
    if (!control || !gallery || !("IntersectionObserver" in window)) return;

    const videos = gallery.querySelectorAll<HTMLVideoElement>("video[data-preview-src]");
    const visible = new Set<HTMLVideoElement>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;

    const sync = (video: HTMLVideoElement) => {
      if (!enabled.current || document.hidden || !visible.has(video)) {
        video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = video.dataset.previewSrc!;
      video.muted = true;
      void video.play().catch(() => {
        // An interrupted play is normal during rapid scroll. Keep the poster on failure.
        if (video.paused && video.readyState < 2) video.removeAttribute("data-started");
      });
    };
    const update = () => videos.forEach(sync);
    const changePlayback = (value: boolean) => {
      enabled.current = value;
      setPlaying(value);
      update();
    };
    const followPreference = () => changePlayback(!preference.matches && !connection?.saveData);
    const toggle = () => changePlayback(!enabled.current);
    const showFrame = (event: Event) => (event.currentTarget as HTMLVideoElement).setAttribute("data-started", "");
    const showPoster = (event: Event) => (event.currentTarget as HTMLVideoElement).removeAttribute("data-started");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.intersectionRatio >= 0.15) visible.add(video);
        else visible.delete(video);
        sync(video);
      }
    }, { threshold: [0, 0.15] });

    followPreference();
    control.hidden = false;
    control.addEventListener("click", toggle);
    preference.addEventListener("change", followPreference);
    document.addEventListener("visibilitychange", update);
    for (const video of videos) {
      video.addEventListener("playing", showFrame);
      video.addEventListener("error", showPoster);
      observer.observe(video);
    }

    return () => {
      observer.disconnect();
      control.removeEventListener("click", toggle);
      preference.removeEventListener("change", followPreference);
      document.removeEventListener("visibilitychange", update);
      videos.forEach(video => {
        video.removeEventListener("playing", showFrame);
        video.removeEventListener("error", showPoster);
        video.pause();
      });
    };
  }, []);

  const Icon = playing ? Pause : Play;
  return (
    <button className="preview-playback" type="button" ref={button} hidden>
      <Icon size={16} aria-hidden="true" />
      {playing ? "Pause previews" : "Play previews"}
    </button>
  );
}
