"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, RotateCcw, X } from "lucide-react";
import type { SculptureScene } from "@/lib/sculpture-scene";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

/** The authored poster is the default; graphics load only after an explicit choice. */
export function CoastalSculpture() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [angle, setAngle] = useState(0);
  const [light, setLight] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<SculptureScene | null>(null);
  const restore = useRef(false);
  const launch = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; x: number; angle: number } | null>(null);
  useEffect(() => {
    if (!open) {
      if (restore.current) {
        launch.current?.focus({ preventScroll: true });
        restore.current = false;
      }
      return;
    }
    if (!canvas.current) return;
    const target = canvas.current;
    const controller = new AbortController();
    close.current?.focus({ preventScroll: true });
    const lost = (event: Event) => {
      event.preventDefault();
      setStatus("error");
      controller.abort();
    };
    target.addEventListener("webglcontextlost", lost);
    import("@/lib/sculpture-scene")
      .then(({ mountSculpture }) => mountSculpture(target, controller.signal))
      .then((mounted) => {
        if (controller.signal.aborted) {
          mounted.dispose();
          return;
        }
        scene.current = mounted;
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => {
      target.removeEventListener("webglcontextlost", lost);
      controller.abort();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [open]);
  useEffect(() => scene.current?.update(angle, light), [angle, light, status]);
  useEffect(() => {
    window.dispatchEvent(new Event("portfolio:layout"));
  }, [open, status]);
  function dismiss() {
    restore.current = true;
    setOpen(false);
    setAngle(0);
    setLight(0);
  }
  return (
    <div
      className="coastal-sculpture"
      data-state={open ? status : "poster"}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) dismiss();
      }}
    >
      <div className="world-scene world-play" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/scene/liquid-chrome-mobile.webp"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/scene/liquid-chrome.webp"
            alt=""
            width={1200}
            height={960}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <i className="world-glint" />
        <i className="world-glint" />
        <i className="world-glint" />
      </div>
      {ready && !open && (
        <button
          ref={launch}
          className="sculpture-launch"
          onClick={() => {
            setStatus("loading");
            setOpen(true);
          }}
          type="button"
        >
          Make it yours <ArrowUpRight size={17} />
        </button>
      )}
      {open && (
        <div
          className="sculpture-lab"
          aria-label="Interactive coastal sculpture"
        >
          <button
            ref={close}
            className="sculpture-close"
            type="button"
            onClick={dismiss}
            aria-label="Close sculpture"
          >
            <X size={18} />
          </button>
          {status !== "error" && (
            <canvas
              ref={canvas}
              aria-label="Chrome and glass sculpture, drag horizontally to turn"
              role="img"
              onPointerDown={(event) => {
                drag.current = { id: event.pointerId, x: event.clientX, angle };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const start = drag.current;
                if (start?.id === event.pointerId)
                  setAngle(
                    Math.max(
                      -180,
                      Math.min(
                        180,
                        start.angle + (event.clientX - start.x) * 0.7,
                      ),
                    ),
                  );
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
            />
          )}
          <p className="sculpture-status" role="status">
            {status === "loading"
              ? "Bringing the sculpture to life…"
              : status === "error"
                ? "This view could not open. The original artwork is still here."
                : "Drag to turn. Find your light."}
          </p>
          {status === "ready" && (
            <div className="sculpture-controls">
              <label>
                Turn{" "}
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={angle}
                  onChange={(event) => setAngle(Number(event.target.value))}
                  aria-label="Rotate sculpture"
                />
              </label>
              <div className="sculpture-lights" aria-label="Sculpture lighting">
                {["Golden hour", "Sky blue", "Rose glow"].map((name, index) => (
                  <button
                    type="button"
                    key={name}
                    aria-pressed={light === index}
                    onClick={() => setLight(index)}
                  >
                    {name}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Reset sculpture"
                  onClick={() => {
                    setAngle(0);
                    setLight(0);
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
