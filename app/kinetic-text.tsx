"use client";
import { memo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let media: MediaQueryList | undefined;
const notify = () => listeners.forEach((listener) => listener());
function subscribe(listener: () => void) {
  media ??= window.matchMedia(
    "(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
  );
  listeners.add(listener);
  if (listeners.size === 1) media.addEventListener("change", notify);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) media?.removeEventListener("change", notify);
  };
}
const snapshot = () => media?.matches ?? false;
const serverSnapshot = () => false;

// React owns every glyph. No DOM rewriting or per-letter event listeners.
export const KineticText = memo(function KineticText({
  text,
  forceGlyphs = false,
}: {
  text: string | number;
  forceGlyphs?: boolean;
}) {
  const value = String(text);
  const interactive = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  // Compact, readable SSR and mobile HTML. Desktop progressively enhances once hydrated.
  if (!forceGlyphs && !interactive)
    return <span className="kinetic-text">{value}</span>;
  return (
    <span className="kinetic-text">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {value.split(/(\s+)/).map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            <span className="kinetic-word" key={i}>
              {Array.from(word).map((char, j) => (
                <span className="kinetic-char" key={j}>
                  {char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
});
