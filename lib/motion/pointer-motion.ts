import { gsap } from "gsap";

/** Fine-pointer effects reuse their tweens and leave the native cursor intact. */
export function attachPointerMotion(root: HTMLElement) {
  const cleanup: (() => void)[] = [];
  const scene = root.querySelector<HTMLElement>(".portrait-scene");
  const portrait = scene?.querySelector<HTMLElement>(".portrait-visual");

  if (scene && portrait) {
    const rotateX = gsap.quickTo(portrait, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotateY = gsap.quickTo(portrait, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.set(portrait, { transformPerspective: 1000 });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = scene.getBoundingClientRect();
      rotateX(((event.clientY - box.top) / box.height - 0.5) * -8);
      rotateY(((event.clientX - box.left) / box.width - 0.5) * 8);
    };
    const reset = () => {
      rotateX(0);
      rotateY(0);
    };
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerleave", reset);
    scene.addEventListener("pointercancel", reset);
    cleanup.push(() => {
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", reset);
      scene.removeEventListener("pointercancel", reset);
      rotateX.tween.kill();
      rotateY.tween.kill();
    });
  }

  root
    .querySelectorAll<HTMLElement>(
      ".hero-actions .primary-link, .footer-invitation .primary-link",
    )
    .forEach((link) => {
      const x = gsap.quickTo(link, "x", { duration: 0.25, ease: "power3.out" });
      const y = gsap.quickTo(link, "y", { duration: 0.25, ease: "power3.out" });
      let box = link.getBoundingClientRect();
      const enter = () => {
        box = link.getBoundingClientRect();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || link.matches(":focus-visible"))
          return;
        x(
          gsap.utils.clamp(
            -6,
            6,
            (event.clientX - box.left - box.width / 2) * 0.12,
          ),
        );
        y(
          gsap.utils.clamp(
            -4,
            4,
            (event.clientY - box.top - box.height / 2) * 0.12,
          ),
        );
      };
      const reset = () => {
        x(0);
        y(0);
      };
      link.addEventListener("pointerenter", enter);
      link.addEventListener("pointermove", move);
      link.addEventListener("pointerleave", reset);
      link.addEventListener("pointercancel", reset);
      link.addEventListener("focus", reset);
      cleanup.push(() => {
        link.removeEventListener("pointerenter", enter);
        link.removeEventListener("pointermove", move);
        link.removeEventListener("pointerleave", reset);
        link.removeEventListener("pointercancel", reset);
        link.removeEventListener("focus", reset);
        x.tween.kill();
        y.tween.kill();
      });
    });

  return () => cleanup.forEach((remove) => remove());
}
