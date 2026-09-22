"use client";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { courses, site } from "./content";

const details = [
  { title: "Build for the real world.", name: "Thunder · 100 Days of Code", topics: ["Web development", "System design", "Security", "DevOps"], summary: "Connect web development, system design, security and DevOps in one learning path." },
  { title: "From local to production.", name: "DevOps", topics: ["Linux & CI/CD", "Docker", "Kubernetes", "Terraform & cloud"], summary: "Explore the tools behind software delivery, from Linux and containers to cloud infrastructure." },
  { title: "Algorithms meet intelligence.", name: "DSA + GenAI Combo", topics: ["Data structures", "Algorithms", "Generative AI"], summary: "Build your foundation in algorithms alongside generative AI." },
  { title: "Think. Solve. Repeat.", name: "DSA in C++", topics: ["C++", "Data structures", "Problem solving"], summary: "Develop your problem-solving skills with data structures and algorithms in C++." },
  { title: "Build what comes next.", name: "Generative AI", topics: ["Generative AI", "AI agents", "Application building"], summary: "Explore generative AI and learn to build autonomous agents." },
];

export function CourseDeck() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<DOMRect | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (selected === null || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    if (origin.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const from = origin.current, to = element.getBoundingClientRect();
      const animation = element.animate([
        { transformOrigin: "top left", transform: `translate(${from.x - to.x}px,${from.y - to.y}px) scale(${from.width / to.width},${from.height / to.height})`, opacity: .4 },
        { transformOrigin: "top left", transform: "none", opacity: 1 },
      ], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" });
      return () => animation.cancel();
    }
  }, [selected]);
  const open = (index: number, target: HTMLButtonElement) => {
    origin.current = target.closest("article")!.getBoundingClientRect();
    lastTrigger.current = target;
    setSelected(index);
  };
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    lastTrigger.current?.focus({ preventScroll: true });
  };
  const course = selected === null ? null : courses[selected];
  const detail = selected === null ? null : details[selected];
  return <>
    <div className="course-deck">
      {courses.map((course, index) => <article key={course.slug} className={`course-tile ${index < 2 ? "course-tile-featured" : ""}`} data-reveal>
        <div className="course-surface">
          <div className="course-art">
            <Image src={`/assets/${course.image}.webp`} alt={course.description} width={1000} height={563} sizes={index < 2 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, 33vw"} />
          </div>
          <div className="course-sheet">
            <div className="course-sheet-meta"><span>{details[index].name}</span><span>{course.duration}</span></div>
            <h3>{details[index].title}</h3>
            <div className="course-discovery">
              <p>{details[index].summary}</p>
              <ul aria-label="Topics">{details[index].topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
            </div>
            <div className="course-actions">
              <button onClick={event => open(index, event.currentTarget)} aria-haspopup="dialog" aria-label={`Preview ${details[index].name}`}>Quick look <span aria-hidden="true">↗</span></button>
              <a href={`${site}/course/${course.slug}`} aria-label={`Explore ${details[index].name}`}>Explore course <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </article>)}
    </div>
    <dialog ref={dialog} className="course-preview" aria-labelledby="course-preview-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {course && detail && <div className="course-preview-body">
        <button className="course-preview-close" onClick={close} aria-label="Close course preview" autoFocus>×</button>
        <Image src={`/assets/${course.image}.webp`} alt={course.description} width={1000} height={563} sizes="(max-width: 767px) 90vw, 720px" />
        <div className="course-preview-copy">
          <p className="course-sheet-meta">{detail.name} · {course.duration}</p>
          <h2 id="course-preview-title">{course.title}</h2>
          <p>{detail.summary}</p>
          <ul>{detail.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          <a className="course-preview-link" href={`${site}/course/${course.slug}`}>Explore this course on STRIKE <span aria-hidden="true">↗</span></a>
        </div>
      </div>}
    </dialog>
  </>;
}

