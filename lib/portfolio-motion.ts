import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachPointerMotion } from "./pointer-motion";

const revealSelector = [
  ".section-intro:not(.playground-heading)",
  ".work-piece:not(.work-world)",
  ".work-world .work-details",
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
        if (hero && window.scrollY < 80 && fine) {
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
        if (intro.length && window.scrollY < 80 && fine) {
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
          const rect = node.getBoundingClientRect();
          return (
            rect.bottom > 0 && (fine || rect.top > window.innerHeight * 0.9)
          );
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
            if (
              !fine &&
              preview.getBoundingClientRect().top <= window.innerHeight * 0.9
            )
              return;
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
            if (
              !fine &&
              title.getBoundingClientRect().top <= window.innerHeight * 0.9
            )
              return;
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
            .querySelectorAll<HTMLElement>(".product-art:not(.board-demo)")
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

        if (fine) {
          root
            .querySelectorAll<HTMLElement>(".chapter-environment")
            .forEach((scene) => {
              const camera = scene.querySelector(".environment-camera");
              if (!camera) return;
              const travel = gsap.timeline({
                scrollTrigger: {
                  trigger: scene,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              });
              travel.fromTo(
                camera,
                { yPercent: 3 },
                { yPercent: -3, ease: "none" },
                0,
              );
              travel.fromTo(
                scene.querySelector(".environment-light"),
                { xPercent: -8, opacity: 0.35 },
                { xPercent: 8, opacity: 0.8, ease: "none" },
                0,
              );
              travel.fromTo(
                scene.querySelectorAll(".environment-glint"),
                { opacity: 0.2, scale: 0.7 },
                { opacity: 1, scale: 1.5, stagger: 0.15, ease: "none" },
                0,
              );
            });
        }
        root.querySelectorAll<HTMLElement>(".world-scene").forEach((scene) => {
          const boat = scene.querySelector(".horizon-boat");
          if (boat) {
            const crossing = gsap.timeline({
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            });
            crossing.fromTo(
              boat,
              { xPercent: -9, rotation: -3 },
              { xPercent: 9, rotation: 2, ease: "none" },
              0,
            );
            crossing.fromTo(
              scene.querySelector(".horizon-reflection"),
              { scaleX: 0.7 },
              { scaleX: 1.3, ease: "none" },
              0,
            );
            return;
          }
          const subject = scene.querySelector("img, .chrome-stage");
          if (!subject) return;
          const arcade = scene.classList.contains("world-arcade");
          const telephone = scene.classList.contains("world-telephone");
          gsap.fromTo(
            subject,
            {
              yPercent: arcade ? 2 : 5,
              rotation: arcade ? 5 : telephone ? -6 : -1,
            },
            {
              yPercent: arcade ? -2 : -5,
              rotation: arcade ? -3 : telephone ? 4 : 1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
          const sphere = scene.querySelector(".chrome-sphere");
          if (sphere)
            gsap.fromTo(
              sphere,
              { rotation: -25 },
              {
                rotation: 35,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          gsap.fromTo(
            scene.querySelectorAll(".world-glint"),
            { opacity: 0.2, scale: 0.7 },
            {
              opacity: 1,
              scale: 1.5,
              stagger: 0.15,
              ease: "sine.inOut",
              scrollTrigger: {
                trigger: scene,
                start: "top 90%",
                end: "bottom 25%",
                scrub: 0.7,
              },
            },
          );
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
        window.addEventListener("portfolio:layout", refreshSystemLayout);
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
          window.removeEventListener("portfolio:layout", refreshSystemLayout);
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
