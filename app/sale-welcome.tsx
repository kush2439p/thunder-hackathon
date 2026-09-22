"use client";
import { useEffect, useRef, useState } from "react";
import { OFFER_CODE, offerTime, readOffer, saveOffer, unlockOffer, useOfferState } from "./offer-state";

const SEEN = "strike-envelope-seen-v2";
export function SaleWelcome() {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);
  const { offer, now, storageError } = useOfferState();
  const expired = !!offer && now >= offer.expires;
  useEffect(() => {
    const open = () => {
      trigger.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      try { localStorage.setItem(SEEN, "true"); } catch { /* Session still works. */ }
    };
    const welcome = setTimeout(() => {
      try { if (!localStorage.getItem(SEEN) && !readOffer()) open(); } catch { /* Dock remains available. */ }
    }, 1200);
    window.addEventListener("strike-open-reward", open);
    return () => { clearTimeout(welcome); if (timer.current) clearTimeout(timer.current); window.removeEventListener("strike-open-reward", open); };
  }, []);
  const close = () => { dialog.current?.close(); trigger.current?.focus({ preventScroll: true }); };
  const unlock = () => {
    if (opening) return;
    setOpening(true);
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850;
    timer.current = setTimeout(() => { unlockOffer(); setOpening(false); }, delay);
  };
  const copy = async () => {
    const current = readOffer();
    if (!current || Date.now() >= current.expires) return;
    try { await navigator.clipboard.writeText(OFFER_CODE); setCopied(true); }
    catch { setCopied(false); }
  };
  const use = () => {
    const current = readOffer();
    if (!current || Date.now() >= current.expires) return;
    saveOffer({ ...current, dismissed: false });
    close();
    window.dispatchEvent(new Event("strike-use-reward"));
  };
  return <dialog ref={dialog} className="reward-dialog" aria-labelledby="reward-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="reward-paper" data-opening={opening} data-unlocked={!!offer}>
      <button className="reward-close" aria-label="Close reward" onClick={close}>×</button>
      <p className="reward-label">A LITTLE SOMETHING FROM STRIKE</p>
      <div className="reward-envelope" aria-hidden="true"><div className="reward-letter"><strong>20%</strong><span>YOUR NEXT CHAPTER</span></div><div className="reward-fold"/><div className="reward-flap"/><div className="reward-seal">S</div></div>
      <h2 id="reward-title">{expired ? "This chapter has closed." : offer ? <>Congratulations.<br/><span>20% is yours.</span></> : <>Your next chapter.<br/><span>One small surprise.</span></>}</h2>
      <p className="reward-description">{expired ? "Your saved offer has expired. You can still explore the courses and membership plans." : offer ? "Save 20% on a 2, 3 or 4-year Strike Plus membership." : "Break the seal. Discover something extra for your learning journey."}</p>
      {offer && <div className="reward-voucher"><div><small>{expired ? "OFFER ENDED" : "YOUR OFFER ENDS IN"}</small><time aria-live="off">{offerTime(offer.expires, now)}</time></div><div><code>{OFFER_CODE}</code><button onClick={copy} disabled={expired}>{copied ? "Copied!" : "Copy code"}</button></div></div>}
      {!offer ? <button className="reward-primary" onClick={unlock} disabled={opening}><span>{opening ? "Opening your reward…" : "Break the seal"}</span><span aria-hidden="true">↗</span></button> : <button className="reward-primary" disabled={expired} onClick={use}><span>{expired ? "Offer expired" : "Use my 20% reward"}</span><span aria-hidden="true">↗</span></button>}
      <button className="reward-later" onClick={() => { if (offer) saveOffer({ ...offer, dismissed: true }); close(); }}>Keep exploring</button>
      <small className="reward-demo">Hackathon demo. No real purchase or official discount.</small>
      {storageError && <p role="alert">Browser storage is unavailable. Your deadline can only be kept for this session.</p>}
      <span className="sr-only" role="status">{copied ? "Coupon copied." : opening ? "Opening reward." : ""}</span>
    </div>
  </dialog>;
}
