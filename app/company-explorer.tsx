"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { KineticText } from "./kinetic-text";

const companies = ["Google", "Amazon", "Apple", "Netflix", "Meta"] as const;
export function CompanyExplorer() {
  const [selected, setSelected] = useState<string>("Google");
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = false;
    const sync = () => el.classList.toggle("orbit-running", visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return (
    <div ref={root} className="company-explorer" data-paused={paused}>
      <div className="company-constellation" role="group" aria-label="Choose a company">
        <div className="constellation-field" aria-hidden="true"><i /><i /><i /></div>
        <div className="constellation-core" aria-hidden="true">S</div>
        {companies.map((name, i) => (
          <button key={name} className={`company-choice choice-${i}`}
            aria-label={`Select ${name}`} aria-pressed={selected === name}
            onClick={() => setSelected(name)}>
            <Image src={`/assets/logo-${name.toLowerCase()}${name === "Meta" ? ".svg" : ".webp"}`}
              alt="" width={100} height={36} />
          </button>
        ))}
      </div>
      <div className="company-selection">
        <div aria-live="polite"><small>YOUR NEXT CHALLENGE</small><p><KineticText text={`Prepare for ${selected}.`} /></p></div>
        <a href="https://strikes.in/practice" aria-label={`Explore practice for ${selected} on STRIKE`}>Explore practice <span aria-hidden="true">↗</span></a>
      </div>
      <button className="orbit-pause" onClick={() => setPaused(!paused)} aria-pressed={paused}>
        {paused ? "Play background motion" : "Pause background motion"}
      </button>
    </div>
  );
}
