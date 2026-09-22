"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { KineticText } from "./kinetic-text";

const lines = [
  [{ text: "// Your next chapter starts here.", tone: "comment" }],
  [
    { text: "const", tone: "key" },
    { text: " welcome = " },
    { text: "async", tone: "key" },
    { text: " () => {" },
  ],
  [
    { text: "  const", tone: "key" },
    { text: " user = " },
    { text: "await", tone: "key" },
    { text: " getUser();" },
  ],
  [
    { text: "  console.log(" },
    { text: "`Welcome ${user.name}!`", tone: "string" },
    { text: ");" },
  ],
  [
    { text: "  return", tone: "key" },
    { text: " { ready: " },
    { text: "true", tone: "string" },
    { text: " };" },
  ],
  [{ text: "};" }],
];
const source = lines
  .map((line) => line.map((token) => token.text).join(""))
  .join("\n");
export function TypedCode() {
  const ref = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    const root = ref.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion:no-preference)", () => {
      let started = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !started) {
            started = true;
            timeline.current = gsap.fromTo(
              root.querySelectorAll(".code-glyph"),
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.035,
                stagger: 0.015,
                ease: "none",
                onComplete: () => root.classList.remove("is-typing"),
              },
            );
            root.classList.add("is-typing");
          } else if (timeline.current) {
            if (entry.isIntersecting && !document.hidden)
              timeline.current.resume();
            else timeline.current.pause();
          }
        },
        { threshold: 0.3 },
      );
      const visibility = () =>
        document.hidden
          ? timeline.current?.pause()
          : timeline.current?.resume();
      observer.observe(root);
      document.addEventListener("visibilitychange", visibility);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        timeline.current?.kill();
        gsap.set(root.querySelectorAll(".code-glyph"), {
          clearProps: "opacity",
        });
        root.classList.remove("is-typing");
      };
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} className="typed-code">
      <code className="sr-only">{source}</code>
      <pre aria-hidden="true">
        <code>
          {lines.map((line, i) => (
            <span className="code-line" key={i}>
              {line.map((token, j) => (
                <span
                  key={j}
                  className={"tone" in token ? `code-${token.tone}` : undefined}
                >
                  {Array.from(token.text).map((char, k) => (
                    <span className="code-glyph" key={k}>
                      {char}
                    </span>
                  ))}
                </span>
              ))}
              {i < lines.length - 1 ? "\n" : ""}
            </span>
          ))}
        </code>
      </pre>
      <div className="code-playback">
        <button
          onClick={() => {
            if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
            ref.current?.classList.add("is-typing");
            timeline.current?.restart();
          }}
        >
          <KineticText text="Replay typing" />
        </button>
        <button
          onClick={() => {
            timeline.current?.progress(1);
            ref.current?.classList.remove("is-typing");
          }}
        >
          <KineticText text="Show full code" />
        </button>
      </div>
    </div>
  );
}
