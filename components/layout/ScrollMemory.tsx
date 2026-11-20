"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const storageKey = "portfolio:scroll";
const keyFor = () => location.pathname + location.search;

function readSaved(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

/** Scroll to a saved offset, retrying while late images or fonts grow the page. */
function restoreTo(target: number) {
  let tries = 0;
  let frame = 0;
  const apply = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    window.scrollTo({ top: Math.min(target, max), behavior: "instant" });
    if (max < target && ++tries < 30) frame = requestAnimationFrame(apply);
  };
  apply();
  return () => cancelAnimationFrame(frame);
}

/** Opening a URL with #section: the browser jumps before the page has its final height
 *  (manual restoration, late images), so keep the section in place until layout settles. */
function revealHash(hash: string) {
  let element: Element | null = null;
  try {
    element = document.querySelector(decodeURIComponent(hash));
  } catch {
    return () => {};
  }
  if (!element) return () => {};
  const target = element;
  let frame = 0;
  let last = Number.NaN;
  let steady = 0;
  const started = performance.now();
  const apply = () => {
    target.scrollIntoView({ behavior: "instant", block: "start" });
    const top = Math.round(target.getBoundingClientRect().top);
    steady = top === last ? steady + 1 : 0;
    last = top;
    if (steady < 20 && performance.now() - started < 3000)
      frame = requestAnimationFrame(apply);
  };
  const stop = () => cancelAnimationFrame(frame);
  // A reader who starts scrolling takes over.
  const takeOver = () => {
    stop();
    removeEventListener("wheel", takeOver);
    removeEventListener("touchstart", takeOver);
    removeEventListener("keydown", takeOver);
  };
  addEventListener("wheel", takeOver, { passive: true });
  addEventListener("touchstart", takeOver, { passive: true });
  addEventListener("keydown", takeOver);
  apply();
  return takeOver;
}

/**
 * Links open a page at the top (the router does that); Back, Forward and
 * reload return to where the reader was. The browser cannot do the second part
 * on its own here, because the router moves to the top before it records the
 * page being left, so positions are kept per URL and restored explicitly.
 */
export function ScrollMemory() {
  const pathname = usePathname();
  const saved = useRef<Record<string, number>>({});
  const current = useRef("");
  const restoring = useRef(false);

  useEffect(() => {
    saved.current = readSaved();
    current.current = keyFor();
    history.scrollRestoration = "manual";
    const persist = () => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(saved.current));
      } catch {}
    };
    const remember = () => {
      if (current.current) saved.current[current.current] = scrollY;
    };
    // Same-origin link clicks: note where this page was before the route changes.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
        return;
      if (link.origin !== location.origin) return;
      remember();
      persist();
    };
    // Back/Forward: the URL has already changed, but the page shown is still
    // the one being left, so its position is still the live one.
    const onPopState = () => {
      remember();
      persist();
      restoring.current = true;
    };
    const onPageHide = () => {
      remember();
      persist();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pagehide", onPageHide);

    const entry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    let cancelRestore = () => {};
    const target = saved.current[current.current];
    if (location.hash) cancelRestore = revealHash(location.hash);
    else if (entry && entry.type !== "navigate" && target)
      cancelRestore = restoreTo(target);

    return () => {
      cancelRestore();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pagehide", onPageHide);
      history.scrollRestoration = "auto";
    };
  }, []);

  useLayoutEffect(() => {
    current.current = keyFor();
    if (!restoring.current) return;
    restoring.current = false;
    const target = saved.current[current.current];
    if (location.hash || !target) return;
    return restoreTo(target);
  }, [pathname]);

  return null;
}
