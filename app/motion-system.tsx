"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { KineticText } from "./kinetic-text";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function InteractiveMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });
      gsap.from(".hero-copy > *", {
        y: 18,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) => {
        const card = el.parentElement?.classList.contains("course-grid");
        gsap.from(el, {
          y: card ? 64 : 34,
          rotation: card ? (i % 2 ? 2 : -2) : 0,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      });
      gsap.to(".hero-geometry", {
        y: 90,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-stage",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.set(".editor-container", {
        rotateX: 7,
        scale: 0.96,
        transformPerspective: 1200,
      });
      gsap.to(".editor-container", {
        y: -22,
        rotateX: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".editor-container",
          start: "top bottom",
          end: "top 25%",
          scrub: 1,
        },
      });
      gsap.utils.toArray<HTMLElement>(".mentor-portrait img").forEach((img) =>
        gsap.from(img, {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }),
      );
      gsap.utils.toArray<HTMLElement>(".about-chapter").forEach((el) =>
        gsap.from(el.querySelectorAll("h3,p,.chapter-icon"), {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        }),
      );
      gsap.fromTo(
        ".footer-dots > div",
        { xPercent: 0 },
        {
          xPercent: -25,
          duration: 3.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".footer-dots",
            start: "top bottom",
            once: true,
          },
        },
      );
      gsap.to(".footer-display", {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    });
    mm.add(
      "(min-width:1024px) and (prefers-reduced-motion:no-preference)",
      () => {
        const cards = gsap.utils.toArray<HTMLElement>(".about-visual-card");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".about-story",
            start: "top top+=100",
            end: "bottom bottom-=80",
            scrub: 0.7,
          },
        });
        cards
          .slice(1)
          .forEach((card, i) =>
            timeline.fromTo(
              card,
              { yPercent: 120, rotation: 8 },
              { yPercent: 0, rotation: 0, duration: 1 },
              i,
            ),
          );
      },
    );
    mm.add(
      "(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
      () => {
        // One delegated listener pair services every letter across the page.
        const enter = (event: PointerEvent) => {
          if (!(event.target instanceof Element)) return;
          const char = event.target.closest<HTMLElement>(".kinetic-char");
          if (!char) return;
          gsap.to(char, {
            y: char.closest("h1") ? -8 : -4,
            rotation: -2,
            duration: 0.24,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const leave = (event: PointerEvent) => {
          if (!(event.target instanceof Element)) return;
          const char = event.target.closest<HTMLElement>(".kinetic-char");
          if (!char) return;
          gsap.to(char, {
            y: 0,
            rotation: 0,
            duration: 0.5,
            ease: "elastic.out(1,.6)",
            overwrite: "auto",
          });
        };
        document.addEventListener("pointerover", enter);
        document.addEventListener("pointerout", leave);
        return () => {
          document.removeEventListener("pointerover", enter);
          document.removeEventListener("pointerout", leave);
          gsap.killTweensOf(".kinetic-char");
        };
      },
    );
    const anchor = (event: MouseEvent) => {
      const a =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (
        !a ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        matchMedia("(prefers-reduced-motion:reduce)").matches
      )
        return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      history.replaceState(null, "", href);
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: target, offsetY: 115, autoKill: true },
        ease: "power3.inOut",
        onComplete: () => {
          if (event.detail !== 0) return;
          if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
            target.addEventListener(
              "blur",
              () => target.removeAttribute("tabindex"),
              { once: true },
            );
          }
          target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", anchor);
    return () => {
      mm.revert();
      document.removeEventListener("click", anchor);
      gsap.killTweensOf(window);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden />;
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section className="section about" id="about" ref={ref}>
      <div className="about-intro" data-reveal>
        <span className="eyebrow">
          <KineticText text={"BUILT FOR YOUR NEXT CHAPTER"} />
        </span>
        <h2>
          <KineticText text={"Knowing is a start."} />
          <br />
          <span>
            <KineticText text={"Building changes everything."} />
          </span>
        </h2>
        <p>
          <KineticText
            text={
              "STRIKE brings structured courses, hands-on projects and interview practice into one learning platform. Powered by Coder Army. Built around learning by doing."
            }
          />
        </p>
      </div>
      <div className="about-story">
        <div className="about-visual" aria-hidden>
          <div className="about-visual-card learn-card">
            <span className="about-card-label">
              <KineticText text={"THE STRIKE WAY"} />
            </span>
            <div className="large-symbol">⌘</div>
            <strong>
              <KineticText text={"Learn."} />
            </strong>
            <p>
              <KineticText text={"Make the fundamentals yours."} />
            </p>
            <div className="signal-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="about-visual-card build-card">
            <span className="about-card-label">
              <KineticText text={"TURN KNOWLEDGE INTO ACTION"} />
            </span>
            <div className="large-symbol">
              <KineticText text={"</>"} />
            </div>
            <strong>
              <KineticText text={"Build."} />
            </strong>
            <p>
              <KineticText text={"Go from concepts to working code."} />
            </p>
            <div className="signal-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="about-visual-card strike-card">
            <span className="about-card-label">
              <KineticText text={"TAKE YOUR NEXT STEP"} />
            </span>
            <div className="large-symbol">↗</div>
            <strong>
              <KineticText text={"Strike."} />
            </strong>
            <p>
              <KineticText text={"Show up ready for the next challenge."} />
            </p>
            <div className="signal-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="about-chapters">
          <article className="about-chapter">
            <span className="chapter-icon" aria-hidden>
              ⌘
            </span>
            <h3>
              <KineticText text={"Understand the why."} />
            </h3>
            <p>
              <KineticText
                text={
                  "Start with the fundamentals. Explore DSA, development, system design and AI through structured courses and guided lessons."
                }
              />
            </p>
            <a className="subtle-link" href="#courses">
              <KineticText text={"Find your course ↗"} />
            </a>
          </article>
          <article className="about-chapter">
            <span className="chapter-icon" aria-hidden>
              <KineticText text={"</>"} />
            </span>
            <h3>
              <KineticText text={"Make it real."} />
            </h3>
            <p>
              <KineticText
                text={
                  "Turn what you learn into projects. Write, test and improve your code, with mentor guidance along the way."
                }
              />
            </p>
            <a className="subtle-link" href="#mentors">
              <KineticText text={"Meet your mentors ↗"} />
            </a>
          </article>
          <article className="about-chapter">
            <span className="chapter-icon" aria-hidden>
              ↗
            </span>
            <h3>
              <KineticText text={"Build your next chapter."} />
            </h3>
            <p>
              <KineticText
                text={
                  "Practice interview questions, strengthen your problem-solving skills and keep a clear view of your progress."
                }
              />
            </p>
            <a className="subtle-link" href="https://strikes.in/practice">
              <KineticText text={"Start practicing ↗"} />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
