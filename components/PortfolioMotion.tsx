"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Content stays visible until the optional motion bundle is ready. */
export function PortfolioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let revision = 0;
    let dispose = () => {};

    function start() {
      const current = ++revision;
      dispose();
      dispose = () => {};
      root.dataset.motion = preference.matches ? "reduced" : "loading";
      if (preference.matches) return;

      void import("@/lib/portfolio-motion")
        .then(({ mountPortfolioMotion }) => {
          if (current !== revision) return;
          dispose = mountPortfolioMotion(document.body);
          root.dataset.motion = "ready";
        })
        .catch(() => {
          if (current === revision) root.dataset.motion = "static";
        });
    }

    start();
    preference.addEventListener("change", start);
    return () => {
      revision++;
      preference.removeEventListener("change", start);
      dispose();
      delete root.dataset.motion;
    };
  }, [pathname]);

  return <div className="reading-progress" aria-hidden="true" />;
}
