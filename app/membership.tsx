"use client";
import { KineticText } from "./kinetic-text";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "motion/react";
import { TiltCard } from "./experience";
import { readOffer, saveOffer, unlockOffer, OFFER_EVENT } from "./offer-state";

const KEY = "strike-circuit-v2";
const CODE = "THUNDER20";
type Saved = { expires: number; dismissed: boolean; applied: boolean };
type Plan = "Plus" | "Ultra";
const prices = { Plus: [11499, 13799, 14374], Ultra: [13799, 14949, 15524] };
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
function read(): Saved | null {
  return readOffer();
}

export function Membership() {
  const [saved, setSaved] = useState<Saved | null>(null),
    [ready, setReady] = useState(false),
    [now, setNow] = useState(0),
    [step, setStep] = useState(0),
    [copy, setCopy] = useState("Copy code"),
    [storageError, setStorageError] = useState(false);
  const [plusYears, setPlusYears] = useState(4),
    [ultraYears, setUltraYears] = useState(4),
    [checkout, setCheckout] = useState<Plan | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    track = useRef<HTMLDivElement>(null),
    result = useRef<HTMLDivElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const expired = !!saved && now >= saved.expires;
  const revealed = !!saved && !saved.dismissed;
  const persist = useCallback((value: Saved) => {
    setSaved(value);
    setStorageError(!saveOffer(value));
  }, []);
  useEffect(() => {
    const refresh = () => {
      setSaved(read());
      setNow(Date.now());
      setReady(true);
    };
    const frame = requestAnimationFrame(refresh);
    const listener = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) refresh();
    };
    window.addEventListener("storage", listener);
    window.addEventListener(OFFER_EVENT, refresh);
    const useReward = () => {
      const latest = read();
      if (!latest || Date.now() >= latest.expires) return;
      persist({ ...latest, applied: true, dismissed: false });
      lastTrigger.current = document.activeElement as HTMLElement;
      setCheckout("Plus");
    };
    window.addEventListener("strike-use-reward", useReward);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("storage", listener);
      window.removeEventListener(OFFER_EVENT, refresh);
      window.removeEventListener("strike-use-reward", useReward);
    };
  }, [persist]);
  useEffect(() => {
    if (!step || reduce || !track.current) return;
    const animation = animate(track.current.querySelectorAll(".node-done"), {
      scale: [0.8, 1.12, 1],
      duration: 500,
      ease: "outBack",
    });
    return () => {
      animation.revert();
    };
  }, [step, reduce]);
  useEffect(() => {
    if (revealed && result.current)
      result.current.focus({ preventScroll: true });
  }, [revealed]);
  useEffect(() => {
    if (checkout) dialog.current?.showModal();
  }, [checkout]);
  // Timestamp reads occur only in this click handler, never during render.
  const reveal = () => {
    // eslint-disable-next-line react-hooks/purity -- Capture click time, never render time.
    const startedAt = Date.now();
    setNow(startedAt);
    setStep(3);
    persist(unlockOffer());
  };
  const connect = (index: number) => {
    if (index !== step) return;
    if (index === 2) reveal();
    else setStep(index + 1);
  };
  const valid = () => {
    const latest = read() || saved;
    if (!latest || Date.now() >= latest.expires) {
      if (latest) persist({ ...latest, applied: false, dismissed: false });
      setNow(Date.now());
      return false;
    }
    return true;
  };
  const copyCode = async () => {
    if (!valid()) return;
    try {
      await navigator.clipboard.writeText(CODE);
      setCopy("Copied!");
    } catch {
      setCopy("Select THUNDER20 to copy");
    }
  };
  const openCheckout = (plan: Plan) => {
    lastTrigger.current = document.activeElement as HTMLElement;
    setCheckout(plan);
  };
  const useOffer = () => {
    if (!valid() || !saved) return;
    persist({ ...saved, applied: true });
    openCheckout("Plus");
  };
  const closeCheckout = () => {
    dialog.current?.close();
    setCheckout(null);
    lastTrigger.current?.focus();
  };
  const seconds = Math.max(0, Math.ceil(((saved?.expires || 0) - now) / 1000));
  const timer = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  const renderPlan = (plan: Plan) => {
    const isPlus = plan === "Plus",
      years = isPlus ? plusYears : ultraYears,
      setYears = isPlus ? setPlusYears : setUltraYears,
      price = prices[plan][years - 2];
    return (
      <div data-reveal key={plan}>
        <TiltCard
          className={`plan-card ${isPlus ? "plus-plan" : "ultra-plan"}`}
        >
          <div className="plan-top">
            <span>
              <KineticText text={"MEMBERSHIP PLAN"} />
            </span>
            <span className="plan-tag">
              <KineticText
                text={isPlus ? "All current courses" : "Best value"}
              />
            </span>
          </div>
          <div className="plan-identity">
            <div>
              <h3>
                <KineticText text={"Strike "} />
                <KineticText text={plan} />
              </h3>
              <p>
                <KineticText
                  text={
                    isPlus
                      ? "All existing Strike courses."
                      : "Existing and upcoming courses."
                  }
                />
                <br />
                <KineticText text={"One focused investment."} />
              </p>
            </div>
            <Image
              src={`/assets/${plan.toLowerCase()}.webp`}
              alt={`Strike ${plan} membership artwork`}
              width={180}
              height={140}
            />
          </div>
          <div
            className="duration-control"
            role="group"
            aria-label={`Strike ${plan} duration`}
          >
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                aria-pressed={years === n}
                onClick={() => setYears(n)}
              >
                <KineticText text={`${n} Years`} />
                {n === 4 && (
                  <small>
                    <KineticText text={"Popular"} />
                  </small>
                )}
              </button>
            ))}
          </div>
          <div className="price">
            <strong>
              <KineticText text={money(price)} />
            </strong>
            <span>
              /<KineticText text={years} />
              <KineticText text={" years"} />
            </span>
          </div>
          <div className="price-detail">
            <del>
              <KineticText text={money(isPlus ? 19999 : 24999)} />
            </del>
            <span>
              <KineticText text={"One-time payment. No renewals."} />
            </span>
          </div>
          <ul className="plan-features">
            {(isPlus
              ? [
                  "All current courses included",
                  "HD recordings & live classes",
                  "Notes, resume review & certificates",
                  "System Design, DSA & Coder Arena",
                ]
              : [
                  "Everything in Strike Plus",
                  "Upcoming batches included",
                  "HD recordings & live classes",
                  "All learning platforms included",
                ]
            ).map((t) => (
              <li key={t}>
                <span aria-hidden>✓</span>
                <KineticText text={t} />
              </li>
            ))}
          </ul>
          <button
            className={`button ${isPlus ? "button-outline" : "button-light"}`}
            onClick={() => openCheckout(plan)}
          >
            <KineticText text={`Get Strike ${plan}`} />
            <span aria-hidden>↗</span>
          </button>
        </TiltCard>
      </div>
    );
  };
  return (
    <section className="section membership" id="plans">
      <div className="section-heading" data-reveal>
        <span className="eyebrow">
          <KineticText text={"THE STRIKE MEMBERSHIP"} />
        </span>
        <h2>
          <KineticText text={"Membership "} />
          <span>
            <KineticText text={"Plans"} />
          </span>
        </h2>
        <p>
          <KineticText
            text={"One focused investment in your engineering career."}
          />
          <br />
          <KineticText
            text={"Choose your courses and a 2, 3 or 4-year membership."}
          />
        </p>
      </div>
      <div className="plan-grid">
        {(["Plus", "Ultra"] as const).map(renderPlan)}
      </div>
      <div
        className={`circuit-panel ${revealed ? "is-revealed" : ""} ${expired ? "is-expired" : ""}`}
        tabIndex={-1}
      >
        {!revealed ? (
          <>
            <div className="circuit-copy">
              <span className="eyebrow">
                <KineticText text={"A LITTLE CURIOSITY GOES A LONG WAY"} />
              </span>
              <h3>
                <KineticText
                  text={
                    saved ? "Your circuit is saved." : "Your next connection?"
                  }
                />
              </h3>
              <p>
                <KineticText
                  text={
                    saved
                      ? "Pick up where you left off."
                      : "Three connections. Something worth discovering."
                  }
                />
              </p>
            </div>
            <div className="circuit-interaction" ref={track}>
              <div className="node-row">
                <div className="circuit-wire" aria-hidden>
                  <span style={{ transform: `scaleX(${step / 2})` }} />
                </div>
                {["Learn", "Build", "Unlock"].map((label, i) => (
                  <button
                    key={label}
                    disabled={!ready || !!saved || i !== step}
                    className={`circuit-node ${i < step ? "node-done" : ""} ${i === step ? "node-current" : ""}`}
                    onClick={() => connect(i)}
                    aria-label={`${label}${i === step ? ", connect next node" : ""}`}
                  >
                    <span className="node-symbol">
                      <KineticText
                        text={
                          i < step ? "✓" : i === 2 ? "↗" : i === 0 ? "⌘" : "⌥"
                        }
                      />
                    </span>
                    <span>
                      <KineticText text={label} />
                    </span>
                  </button>
                ))}
              </div>
              <button
                className="subtle-link"
                disabled={!ready}
                onClick={reveal}
              >
                <KineticText
                  text={saved ? "Reopen offer" : "Skip interaction & reveal"}
                />{" "}
                <span aria-hidden>↗</span>
              </button>
              <span className="sr-only" role="status">
                {step === 1
                  ? "Learn connected. Connect Build next."
                  : step === 2
                    ? "Build connected. Select Unlock to reveal your offer."
                    : ""}
              </span>
            </div>
          </>
        ) : (
          <div className="offer-result" ref={result} tabIndex={-1}>
            <div className="offer-title">
              <span className="eyebrow">
                <KineticText
                  text={expired ? "CONNECTION CLOSED" : "CIRCUIT COMPLETE"}
                />
              </span>
              <h3>
                {expired ? (
                  <KineticText text="This offer has expired." />
                ) : (
                  <>
                    <KineticText text={"You connected."} />
                    <br />
                    <span>
                      <KineticText text={"Save 20%."} />
                    </span>
                  </>
                )}
              </h3>
              <p>
                <KineticText text={"Strike Plus, "} />
                <KineticText text={plusYears} />
                <KineticText text={"-year membership"} />
              </p>
              <small>
                <KineticText
                  text={"Hackathon demo offer. Not a live STRIKE promotion."}
                />
              </small>
            </div>
            <div className="offer-controls">
              <div className="offer-timer">
                <span>
                  <KineticText
                    text={expired ? "Offer ended" : "Your offer ends in"}
                  />
                </span>
                <time>
                  <KineticText text={timer} />
                </time>
              </div>
              <div className="coupon">
                <code>
                  <KineticText text={CODE} />
                </code>
                <button onClick={copyCode} disabled={expired}>
                  <KineticText text={copy} />
                </button>
              </div>
              <button
                className="button button-amber"
                disabled={expired}
                onClick={useOffer}
              >
                <KineticText
                  text={
                    expired
                      ? "Offer expired"
                      : `Use offer · ${money(Math.round(prices.Plus[plusYears - 2] * 0.8))}`
                  }
                />
                <span aria-hidden>↗</span>
              </button>
              <button
                className="subtle-link"
                onClick={() => saved && persist({ ...saved, dismissed: true })}
              >
                <KineticText text={"Dismiss offer"} />
              </button>
              <span className="sr-only" role="status">
                {copy === "Copied!" ? "Coupon copied to clipboard." : ""}
              </span>
            </div>
          </div>
        )}
        {storageError && (
          <p className="storage-error" role="alert">
            <KineticText
              text={
                "Browser storage is unavailable. This timer cannot be saved after you leave."
              }
            />
          </p>
        )}
      </div>
      <p className="pricing-note">
        <KineticText
          text={"Prices inclusive of GST. One-time payment. No renewals."}
        />
      </p>
      <dialog
        ref={dialog}
        className="checkout-dialog"
        aria-label="Membership checkout preview"
        onCancel={closeCheckout}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCheckout();
        }}
      >
        <div className="checkout-inner">
          <button
            className="dialog-close"
            aria-label="Close checkout"
            onClick={closeCheckout}
          >
            ×
          </button>
          <span className="eyebrow">
            <KineticText text={"MEMBERSHIP PREVIEW"} />
          </span>
          <h2>
            <KineticText text={"Strike "} />
            <KineticText text={checkout || ""} />
          </h2>
          <p>
            <KineticText text={checkout === "Plus" ? plusYears : ultraYears} />
            <KineticText text={"-year plan. One-time payment."} />
          </p>
          <div className="checkout-summary">
            <div>
              <span>
                <KineticText text={"Plan price"} />
              </span>
              <strong>
                <KineticText
                  text={money(
                    prices[checkout || "Plus"][
                      (checkout === "Plus" ? plusYears : ultraYears) - 2
                    ],
                  )}
                />
              </strong>
            </div>
            {checkout === "Plus" && saved?.applied && !expired && (
              <div className="discount-line">
                <span>
                  <KineticText text={CODE} />
                  <KineticText text={" applied"} />
                </span>
                <strong>
                  <KineticText text={"−20%"} />
                </strong>
              </div>
            )}
            <div className="checkout-total">
              <span>
                <KineticText text={"Total"} />
              </span>
              <strong>
                <KineticText
                  text={money(
                    Math.round(
                      prices[checkout || "Plus"][
                        (checkout === "Plus" ? plusYears : ultraYears) - 2
                      ] *
                        (checkout === "Plus" && saved?.applied && !expired
                          ? 0.8
                          : 1),
                    ),
                  )}
                />
              </strong>
            </div>
          </div>
          {expired && saved?.applied && (
            <p role="alert">
              <KineticText
                text={"Your coupon expired. The discount has been removed."}
              />
            </p>
          )}
          <div className="demo-notice">
            <KineticText
              text={
                "This is a frontend demonstration. No payment is taken and no membership is purchased. The demo coupon is not valid on the official website."
              }
            />
          </div>
          <button className="button button-light" onClick={closeCheckout}>
            <KineticText text={"Continue exploring "} />
            <span aria-hidden>↗</span>
          </button>
          <a className="subtle-link" href="https://strikes.in/#membership">
            <KineticText text={"Visit official STRIKE website ↗"} />
          </a>
        </div>
      </dialog>
    </section>
  );
}
