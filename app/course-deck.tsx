"use client";

import Image from "next/image";
import { useState } from "react";
import { courses, site } from "./content";

const details = [
  { title: "Build for the real world.", name: "Thunder · 100 Days of Code", topics: ["Web development", "System design", "Security", "DevOps"], summary: "Connect web development, system design, security and DevOps in one learning path." },
  { title: "From local to production.", name: "DevOps", topics: ["Linux & CI/CD", "Docker", "Kubernetes", "Terraform & cloud"], summary: "Explore the tools behind software delivery, from Linux and containers to cloud infrastructure." },
  { title: "Algorithms meet intelligence.", name: "DSA + GenAI Combo", topics: ["Data structures", "Algorithms", "Generative AI"], summary: "Build your foundation in algorithms alongside generative AI." },
  { title: "Think. Solve. Repeat.", name: "DSA in C++", topics: ["C++", "Data structures", "Problem solving"], summary: "Develop your problem-solving skills with data structures and algorithms in C++." },
  { title: "Build what comes next.", name: "Generative AI", topics: ["Generative AI", "AI agents", "Application building"], summary: "Explore generative AI and learn to build autonomous agents." },
];

export function CourseDeck() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const toggle = (index: number) => setFlipped(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);

  return <div className="course-deck">
    {courses.map((course, index) => {
      const detail = details[index];
      const isFlipped = flipped.includes(index);
      return <article key={course.slug} className={`course-tile ${index < 2 ? "course-tile-featured" : ""} ${isFlipped ? "is-flipped" : ""}`} data-reveal>
        <div className="course-surface">
          <div className="course-flip-inner">
            <div className="course-card-face course-card-front" role="button" tabIndex={0} aria-label={`Show details for ${detail.name}`} onClick={() => toggle(index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(index); } }}>
              <div className="course-art"><Image src={`/assets/${course.image}.webp`} alt={course.description} width={1000} height={563} sizes={index < 2 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, 33vw"} /></div>
              <div className="course-front-copy"><span>{course.tag}</span><strong>{detail.name}</strong><small>Tap to turn over <i aria-hidden="true">↗</i></small></div>
            </div>
            <div className="course-card-face course-card-back">
              <div className="course-back-heading"><span>{course.duration}</span><button type="button" onClick={() => toggle(index)} aria-label={`Show ${detail.name} cover`}>Turn back <i aria-hidden="true">↶</i></button></div>
              <h3>{detail.title}</h3><p>{detail.summary}</p>
              <ul aria-label="Topics">{detail.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
              <div className="course-price-row"><span>Current price</span><a href={`${site}/course/${course.slug}`}>View on STRIKE <i aria-hidden="true">↗</i></a></div>
            </div>
          </div>
        </div>
      </article>;
    })}
  </div>;
}
