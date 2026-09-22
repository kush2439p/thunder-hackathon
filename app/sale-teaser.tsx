"use client";
import { offerTime, saveOffer, useOfferState } from "./offer-state";

export function SaleTeaser() {
  const { offer, now, ready } = useOfferState();
  if (!ready) return null;
  const expired = !!offer && now >= offer.expires;
  const open = () => window.dispatchEvent(new Event("strike-open-reward"));
  if (offer?.dismissed) return <button className="reward-reopen" onClick={open} aria-label="Reopen reward">{expired ? "Offer ended" : "Your reward"} <span aria-hidden="true">↗</span></button>;
  return <aside className="reward-dock" aria-label="STRIKE reward">
    <span className="reward-dock-mark" aria-hidden="true">{offer ? "20%" : "S"}</span>
    <div><strong>{expired ? "Your offer has ended" : offer ? "20% off Strike Plus" : "A little extra, for your next step."}</strong>
      {offer ? <time aria-label="Time remaining" aria-live="off">{offerTime(offer.expires, now)} <small>remaining</small></time> : <small>A sealed reward is waiting.</small>}
    </div>
    <button onClick={open} className="reward-dock-open">{offer ? "View" : "Open"} <span aria-hidden="true">↗</span></button>
    {offer && <button className="reward-dock-dismiss" aria-label="Dismiss reward reminder" onClick={() => saveOffer({ ...offer, dismissed: true })}>×</button>}
  </aside>;
}
