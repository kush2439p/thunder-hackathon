"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { reviews } from "./content";
import { KineticText } from "./kinetic-text";

function ReviewQuote({ text }: { text: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion:no-preference)", () => {
      const tween = gsap.fromTo(
        ref.current!.querySelectorAll(".kinetic-char"),
        { opacity: 0 },
        { opacity: 1, duration: 0.08, stagger: 0.012, ease: "none" },
      );
      return () => tween.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <blockquote ref={ref}>
      <KineticText text={text} forceGlyphs />
    </blockquote>
  );
}
export function ReviewRail() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !inView || held || reduce) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % reviews.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [playing, inView, held, reduce]);
  const select = (next: number) => {
    setPlaying(false);
    setIndex((next + reviews.length) % reviews.length);
  };
  const review = reviews[index];
  return (
    <div
      ref={ref}
      className="review-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Student reviews"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <div className="review-controls">
        <button aria-label="Previous reviews" onClick={() => select(index - 1)}>
          ←
        </button>
        <button
          className="review-pause"
          aria-pressed={!playing}
          onClick={() => setPlaying((value) => !value)}
        >
          <KineticText text={playing ? "Pause reviews" : "Play reviews"} />
        </button>
        <button aria-label="Next reviews" onClick={() => select(index + 1)}>
          →
        </button>
      </div>
      <div className="review-stage" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="review review-featured"
            key={review.name}
            initial={reduce ? false : { x: -45, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: 90, opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            {inView ? (
              <ReviewQuote text={review.text} />
            ) : (
              <blockquote>
                <KineticText text={review.text} />
              </blockquote>
            )}
            <div className="review-person">
              <span className="initial-avatar" aria-hidden="true">
                {review.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <strong>
                  <KineticText text={review.name} />
                </strong>
                <small>
                  <KineticText text="STRIKE student review" />
                </small>
              </div>
              <span className="review-count">
                <KineticText text={`${index + 1} / ${reviews.length}`} />
              </span>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div
        className="review-selectors"
        role="group"
        aria-label="Choose a student review"
      >
        {reviews.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={i === index}
            onClick={() => select(i)}
          >
            <KineticText text={item.name} />
          </button>
        ))}
      </div>
      <span className="sr-only" role="status">
        {!playing ? `Showing review by ${review.name}` : ""}
      </span>
    </div>
  );
}
