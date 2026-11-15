import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachPointerMotion } from "./pointer-motion";

const revealSelector = [
  ".section-intro",
  ".work-piece",
  ".capability-list article",
  ".contribution-wall",
  ".experience-facts > div",
  ".playground-images > a",
  ".experiment-preview",
  ".design-tile",
  ".category-project",
  ".reveal",
  ".footer-invitation",
].join(", ");

export function mountPortfolioMotion(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  try {
    media.add(
      {
        all: "all",
        fine: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      },
      (context) => {
        const fine = Boolean(context.conditions?.fine);
        const header = root.querySelector<HTMLElement>(".site-header");
        const hero = root.querySelector<HTMLElement>(".portfolio-hero");
        const lines = root.querySelectorAll(".hero-line > span");
        const intro = root.querySelectorAll("[data-motion-intro] > *");
        const progress = root.querySelector(".reading-progress");
        const revealTweens = new Map<
          HTMLElement,
          ReturnType<typeof gsap.from>
        >();

        let finishEntrance = () => {};
        if (hero && window.scrollY < 80) {
          const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
          finishEntrance = () => {
            entrance.progress(1);
          };
          entrance.from(
            lines,
            {
              yPercent: 110,
              duration: 0.9,
              stagger: 0.1,
              clearProps: "transform",
            },
            0,
          );
          entrance.from(
            root.querySelector(".intro-name"),
            { y: 12, opacity: 0, duration: 0.6, clearProps: "all" },
            0.1,
          );
          entrance.from(
            root.querySelector(".hero-description"),
            { y: 18, opacity: 0, duration: 0.7, clearProps: "all" },
            0.25,
          );
          entrance.from(
            root.querySelector(".hero-actions"),
            { y: 16, opacity: 0, duration: 0.6, clearProps: "all" },
            0.4,
          );
          entrance.from(
            root.querySelector(".portrait"),
            {
              y: fine ? 28 : 0,
              rotation: fine ? 3 : 0,
              duration: 0.8,
              clearProps: "all",
            },
            0.1,
          );
        }
        if (intro.length && window.scrollY < 80) {
          gsap.from(intro, {
            y: 22,
            opacity: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "all",
          });
        }

        const candidates = Array.from(
          root.querySelectorAll<HTMLElement>(revealSelector),
        );
        const selected = new Set(candidates);
        // Animate an outer card once, instead of stacking reveals on its children.
        const targets = candidates.filter((node) => {
          for (
            let parent = node.parentElement;
            parent && parent !== root;
            parent = parent.parentElement
          ) {
            if (selected.has(parent)) return false;
          }
          return node.getBoundingClientRect().bottom > 0;
        });
        targets.forEach((node) => {
          const index = node.parentElement
            ? Array.from(node.parentElement.children).indexOf(node)
            : 0;
          const tween = gsap.from(node, {
            y: node.matches(".work-piece") && fine ? 0 : 24,
            x: node.matches(".work-piece") && fine ? (index % 2 ? 36 : -36) : 0,
            opacity: 0,
            duration: 0.7,
            delay: (index % 3) * 0.06,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: node, start: "top 92%", once: true },
          });
          revealTweens.set(node, tween);
        });

        root
          .querySelectorAll<HTMLElement>(".work-preview")
          .forEach((preview) => {
            const wipe = gsap.from(preview, {
              clipPath: "inset(9% 14% 9% 0 round 8px)",
              duration: 1.05,
              ease: "power3.out",
              clearProps: "clipPath",
              scrollTrigger: { trigger: preview, start: "top 90%", once: true },
            });
            revealTweens.set(preview, wipe);
            const image = preview.querySelector("img");
            if (!image) return;
            if (fine) {
              gsap.fromTo(
                image,
                { scale: 1.13, yPercent: -5 },
                {
                  scale: 1.13,
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: preview,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.7,
                  },
                },
              );
            } else {
              gsap.from(image, {
                scale: 1.06,
                duration: 1.1,
                ease: "power3.out",
                clearProps: "transform",
                scrollTrigger: {
                  trigger: preview,
                  start: "top 90%",
                  once: true,
                },
              });
            }
          });

        root
          .querySelectorAll(
            ".section-intro h2, .capabilities h2, .reel-heading h2",
          )
          .forEach((title) => {
            gsap.from(title, {
              y: 28,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.85,
              ease: "power3.out",
              clearProps: "transform,clipPath",
              scrollTrigger: { trigger: title, start: "top 92%", once: true },
            });
          });

        if (fine) {
          const scene = root.querySelector(
            ".portrait-scene:not(.portrait-person)",
          );
          if (hero && scene)
            gsap.to(scene, {
              y: -65,
              rotation: -2,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          const landscape = root.querySelector(".hero-landscape");
          if (landscape && hero)
            gsap.to(landscape, {
              yPercent: 12,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          root
            .querySelectorAll<HTMLElement>(".product-art")
            .forEach((art, i) => {
              const light = art.querySelector(".product-light");
              if (light)
                gsap.fromTo(
                  light,
                  { xPercent: -28, opacity: 0.25 },
                  {
                    xPercent: 28,
                    opacity: 0.8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: art,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.8,
                    },
                  },
                );
              gsap.fromTo(
                art,
                { rotation: i % 2 ? -1.5 : 1.5, scale: 1.06 },
                {
                  rotation: i % 2 ? 1.5 : -1.5,
                  scale: 1.06,
                  ease: "none",
                  scrollTrigger: {
                    trigger: art,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                },
              );
            });
          root
            .querySelectorAll(".playground-images img")
            .forEach((image, i) => {
              gsap.fromTo(
                image,
                { yPercent: i % 2 ? -10 : 8, scale: 1.24 },
                {
                  yPercent: i % 2 ? 10 : -8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: ".playground-images",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                },
              );
            });
          const footerTitle = root.querySelector(".footer-invitation h2");
          if (footerTitle)
            gsap.from(footerTitle, {
              x: 35,
              ease: "none",
              scrollTrigger: {
                trigger: footerTitle,
                start: "top bottom",
                end: "top 55%",
                scrub: 0.7,
              },
            });
        }
        root
          .querySelectorAll(".sky-current, .sunset-current, .horizon-lines")
          .forEach((layer, i) => {
            gsap.to(layer, {
              yPercent: (i + 1) * -5,
              xPercent: i % 2 ? -6 : 6,
              ease: "none",
              scrollTrigger: { start: 0, end: "max", scrub: 1 },
            });
          });

        const calendar = root.querySelector(".contribution-calendar");
        if (calendar)
          gsap.from(calendar.querySelectorAll(".wall-svg rect"), {
            y: 6,
            scale: 0.85,
            transformOrigin: "50% 50%",
            duration: 0.6,
            stagger: 0.002,
            ease: "power3.out",
            clearProps: "transform,transformOrigin",
            scrollTrigger: { trigger: calendar, start: "top 88%", once: true },
          });

        if (progress) {
          gsap.fromTo(
            progress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                start: 0,
                end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
                scrub: 0.15,
                invalidateOnRefresh: true,
              },
            },
          );
        }
        if (header) {
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: () =>
              header.classList.toggle("is-scrolled", window.scrollY > 24),
          });
        }
        const systems = root.querySelector(".systems-showcase");
        let layoutFrame = 0;
        const refreshSystemLayout = () => {
          cancelAnimationFrame(layoutFrame);
          layoutFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        systems?.addEventListener("toggle", refreshSystemLayout, true);
        systems?.addEventListener("change", refreshSystemLayout);
        if (systems)
          ScrollTrigger.create({
            trigger: systems,
            start: "top 85%",
            end: "bottom top",
            toggleClass: "is-in-view",
          });
        // Keyboard navigation makes a focused card visible immediately.
        const revealFocus = (event: FocusEvent) => {
          if (!(event.target instanceof Node)) return;
          if (hero?.contains(event.target)) finishEntrance();
          for (const [node, tween] of revealTweens) {
            if (node.contains(event.target)) {
              tween.progress(1);
              tween.scrollTrigger?.kill(false);
            }
          }
        };
        root.addEventListener("focusin", revealFocus);
        const removePointer = fine ? attachPointerMotion(root) : () => {};
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          cancelAnimationFrame(frame);
          cancelAnimationFrame(layoutFrame);
          systems?.removeEventListener("toggle", refreshSystemLayout, true);
          systems?.removeEventListener("change", refreshSystemLayout);
          root.removeEventListener("focusin", revealFocus);
          header?.classList.remove("is-scrolled");
          removePointer();
        };
      },
      root,
    );
  } catch (error) {
    media.revert();
    throw error;
  }

  return () => media.revert();
}
