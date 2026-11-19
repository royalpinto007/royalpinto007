"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** The first mobile scene paints before its optional scroll-animation bundle. */
export function PortfolioMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const root = document.documentElement;
    let revision = 0;
    let dispose = () => {};
    let cancelPending = () => {};
    function start() {
      cancelPending();
      cancelPending = () => {};
      const current = ++revision;
      dispose();
      dispose = () => {};
      root.dataset.motion = preference.matches ? "reduced" : "loading";
      if (preference.matches) return;
      void import("@/lib/motion/portfolio-motion")
        .then(({ mountPortfolioMotion }) => {
          if (current !== revision) return;
          dispose = mountPortfolioMotion(document.body);
          root.dataset.motion = "ready";
        })
        .catch(() => {
          if (current === revision) root.dataset.motion = "static";
        });
    }
    function schedule() {
      cancelPending();
      if (preference.matches || fine.matches) {
        start();
        return;
      }
      revision++;
      dispose();
      dispose = () => {};
      root.dataset.motion = "loading";
      let pending = true,
        frame = 0,
        idle = 0,
        timer = 0;
      const kick = () => {
        if (pending) start();
      };
      const afterLoad = () => {
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            if (typeof window.requestIdleCallback === "function")
              idle = window.requestIdleCallback(kick, { timeout: 2000 });
            else timer = window.setTimeout(kick, 100);
          });
        });
      };
      window.addEventListener("scroll", kick, { passive: true, once: true });
      window.addEventListener("pointerdown", kick, {
        passive: true,
        once: true,
      });
      if (document.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad, { once: true });
      cancelPending = () => {
        pending = false;
        cancelAnimationFrame(frame);
        if (idle) window.cancelIdleCallback(idle);
        clearTimeout(timer);
        window.removeEventListener("load", afterLoad);
        window.removeEventListener("scroll", kick);
        window.removeEventListener("pointerdown", kick);
      };
    }
    schedule();
    preference.addEventListener("change", schedule);
    fine.addEventListener("change", schedule);
    return () => {
      revision++;
      cancelPending();
      preference.removeEventListener("change", schedule);
      fine.removeEventListener("change", schedule);
      dispose();
      delete root.dataset.motion;
    };
  }, [pathname]);
  return <div className="reading-progress" aria-hidden="true" />;
}
