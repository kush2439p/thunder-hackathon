"use client";
import { useEffect, useState } from "react";

export const OFFER_KEY = "strike-circuit-v2";
export const OFFER_EVENT = "strike-offer-change";
export const OFFER_CODE = "THUNDER20";
const DURATION = 36 * 60 * 60 * 1000;
export type Offer = { expires: number; dismissed: boolean; applied: boolean };
let memory: Offer | null = null;
let storageUnavailable = false;

export function readOffer(): Offer | null {
  try {
    const raw = localStorage.getItem(OFFER_KEY);
    if (!raw) return memory;
    const value = JSON.parse(raw);
    if (!value || !Number.isFinite(value.expires) || value.expires < 1 || value.expires > Date.now() + DURATION + 60000)
      return { expires: 1, dismissed: false, applied: false };
    return { expires: value.expires, dismissed: value.dismissed === true, applied: value.applied === true };
  } catch {
    storageUnavailable = true;
    return memory;
  }
}
export function saveOffer(value: Offer) {
  memory = value;
  try { localStorage.setItem(OFFER_KEY, JSON.stringify(value)); storageUnavailable = false; }
  catch { storageUnavailable = true; }
  window.dispatchEvent(new Event(OFFER_EVENT));
  return !storageUnavailable;
}
export function unlockOffer() {
  const existing = readOffer();
  // Preserve earlier deadlines, including the original teaser's first-visit timer.
  let expires = Date.now() + DURATION;
  try {
    const legacy = Number(localStorage.getItem("strike-sale-deadline-v1"));
    if (Number.isFinite(legacy) && legacy > 0) expires = Math.min(expires, legacy);
  } catch { storageUnavailable = true; }
  const value = existing ? { ...existing, dismissed: false } : { expires, dismissed: false, applied: false };
  saveOffer(value);
  return value;
}
export function offerTime(expires: number, now: number) {
  const seconds = Math.max(0, Math.ceil((expires - now) / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(n => String(n).padStart(2, "0")).join(":");
}
export function useOfferState() {
  const [state, setState] = useState<{ offer: Offer | null; now: number; ready: boolean; storageError: boolean }>({ offer: null, now: 0, ready: false, storageError: false });
  useEffect(() => {
    const refresh = () => setState({ offer: readOffer(), now: Date.now(), ready: true, storageError: storageUnavailable });
    const frame = requestAnimationFrame(refresh);
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener(OFFER_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); window.removeEventListener(OFFER_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return state;
}
