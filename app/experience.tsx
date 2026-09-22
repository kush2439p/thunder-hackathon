"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, stagger } from "animejs";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { site } from "./content";
import { TypedCode } from "./typed-code";
import { KineticText } from "./kinetic-text";

export function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100),
    s = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 450, damping: 32 }),
    sy = useSpring(y, { stiffness: 450, damping: 32 }),
    ss = useSpring(s, { stiffness: 300, damping: 25 });
  const reduce = useReducedMotion();
  useEffect(() => {
    const media = matchMedia("(pointer:fine) and (min-width:1024px)");
    const move = (e: PointerEvent) => {
      if (reduce || !media.matches) {
        s.set(0);
        return;
      }
      x.set(e.clientX - 16);
      y.set(e.clientY - 16);
      s.set(
        (e.target as Element).closest("a,button,summary")
          ? 1.55
          : (e.target as Element).closest(".kinetic-char")
            ? 1.15
            : 0.8,
      );
    };
    const leave = () => s.set(0);
    const press = () => {
      if (!reduce && media.matches) s.set(0.6);
    };
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      document.removeEventListener("mouseleave", leave);
    };
  }, [reduce, x, y, s]);
  return (
    <motion.div
      aria-hidden
      className="cursor-ring"
      style={{ x: sx, y: sy, scale: ss }}
    >
      <span className="cursor-center" />
      <span className="cursor-orbit" />
    </motion.div>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["Home", "#home"],
    ["Courses", "#courses"],
    ["Practice", site + "/practice"],
    ["CodeArena", site + "/codearena"],
    ["Quiz", site + "/login"],
    ["System Design", site + "/system-design"],
    ["Contests", site + "/login"],
  ];
  return (
    <header className="nav-wrap">
      <nav ref={ref} className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#home">
          <KineticText text={"STRIKE"} />
        </a>
        <div className={`nav-links ${open ? "open" : ""}`} id="main-menu">
          {links.map(([name, url]) => (
            <a
              key={name}
              className={name === "Home" ? "active" : ""}
              href={url}
              onClick={() => setOpen(false)}
            >
              <KineticText text={name} />
            </a>
          ))}
        </div>
        <a className="nav-start" href="#plans">
          <KineticText text={"Get Started "} />
          <span aria-hidden>↗</span>
        </a>
        <button
          className="menu-toggle"
          aria-controls="main-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <KineticText text={open ? "×" : "☰"} />
        </button>
      </nav>
    </header>
  );
}

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 180, damping: 24 }),
    ry = useSpring(y, { stiffness: 180, damping: 24 });
  return (
    <motion.div
      className={`tilt-card ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || innerWidth < 1024) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
        y.set(((e.clientX - r.left) / r.width - 0.5) * 5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function CodeDemo() {
  const [ran, setRan] = useState(false),
    [tab, setTab] = useState("AI Assistant");
  const terminal = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const run = () => {
    setRan(true);
    if (!reduce && terminal.current)
      animate(terminal.current, {
        opacity: [0.3, 1],
        translateY: [6, 0],
        duration: 500,
        ease: "outExpo",
      });
  };
  return (
    <div className="editor" data-reveal>
      <div className="editor-bar">
        <div className="window-dots" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <span className="file-name">
          <KineticText text={"strike.js"} />
        </span>
        <span className="editor-ready">
          <KineticText text={ran ? "SUCCESS" : "READY"} />
        </span>
        <button onClick={run} className="run-button">
          <KineticText text={"▷   Run Code"} />
        </button>
      </div>
      <div className="editor-columns">
        <div className="code-area">
          <TypedCode />
          <div className="terminal" ref={terminal}>
            <span>
              <KineticText text={"TERMINAL"} />
            </span>
            <p role="status">
              <KineticText
                text={
                  ran
                    ? "✓ Welcome to STRIKE. You’re ready to build."
                    : "$ Ready when you are. Run your first step."
                }
              />
            </p>
            {ran && (
              <a href="#plans">
                <KineticText
                  text={"A new connection is waiting in Membership →"}
                />
              </a>
            )}
          </div>
        </div>
        <aside className="assistant">
          <div className="editor-tabs">
            {["AI Assistant", "Bug Shots"].map((t) => (
              <button
                key={t}
                className={tab === t ? "selected" : ""}
                onClick={() => setTab(t)}
              >
                <KineticText text={t} />
              </button>
            ))}
          </div>
          <small>
            <KineticText
              text={
                tab === "AI Assistant" ? "QUICK SUGGESTIONS" : "CODE REVIEW"
              }
            />
          </small>
          <strong>
            <KineticText
              text={
                tab === "AI Assistant"
                  ? "Make every line count."
                  : "Build with confidence."
              }
            />
          </strong>
          <p>
            <KineticText
              text={
                tab === "AI Assistant"
                  ? "Extract user fetch and logging into separate utils for better testability."
                  : "Add a try-catch block to handle failures from getUser(). Validate the user before displaying their name."
              }
            />
          </p>
          <div className="editor-tip">
            <span aria-hidden>↳</span>
            <KineticText
              text={
                tab === "AI Assistant"
                  ? "Define a User type. Keep learning."
                  : "Handle errors. Keep improving."
              }
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    let animation: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animation = animate(el.querySelectorAll(".activity-column"), {
            scaleY: [0.1, 1],
            delay: stagger(65),
            duration: 850,
            ease: "outExpo",
          });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      animation?.revert();
    };
  }, [reduce]);
  return (
    <div className="progress-demo" ref={ref}>
      <div className="progress-label">
        <span>
          <KineticText text={"Grow With Strike"} />
        </span>
        <small>
          <KineticText text={"ILLUSTRATIVE PROGRESS"} />
        </small>
      </div>
      <div className="activity-chart">
        {[28, 42, 35, 67, 58, 81, 95].map((v, i) => (
          <div key={i}>
            <div className="activity-column" style={{ height: `${v}%` }} />
            <span>
              <KineticText text={["M", "T", "W", "T", "F", "S", "S"][i]} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
