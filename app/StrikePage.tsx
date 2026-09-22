import Image from "next/image";
import { mentors, faqs, site } from "./content";
import { CourseDeck } from "./course-deck";
import {
  Navigation,
  Cursor,
  CodeDemo,
  TiltCard,
  ProgressDemo,
} from "./experience";
import { Membership } from "./membership";
import { InteractiveMotion, AboutSection } from "./motion-system";
import { KineticText } from "./kinetic-text";
import { ReviewRail } from "./reviews-motion";
import { CompanyExplorer } from "./company-explorer";
import { SaleTeaser } from "./sale-teaser";
import { SaleWelcome } from "./sale-welcome";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        <KineticText text={"Skip to content"} />
      </a>
      <InteractiveMotion />
      <Cursor />
      <Navigation />
      <SaleTeaser />
      <SaleWelcome />
      <main id="main">
        <section className="hero" id="home">
          <div className="hero-stage">
            <div className="hero-geometry" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="hero-art" aria-hidden>
              <Image
                src="/assets/silver-flow.webp"
                alt=""
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div className="hero-copy">
              <h1>
                <span className="hero-kicker"><KineticText text="Take control of your" /></span>
                <span className="hero-title-line"><KineticText text="Future With Strike" /></span>
              </h1>
              <p className="hero-description">
                <KineticText text={"Master DSA, System Design & AI with"} />
                <br className="desktop-break" />
                <KineticText text={" interactive coding environments"} />
              </p>
              <div className="hero-actions">
                <a className="join-button" href="#plans"><KineticText text="Join Us" /></a>
              </div>
            </div>
          </div>
          <div className="editor-container">
            <CodeDemo />
          </div>
        </section>
        <Membership />
        <section className="section courses" id="courses">
          <div className="section-heading" data-reveal>
            <h2>
              <KineticText text={"What We "} />
              <span>
                <KineticText text={"Offer"} />
              </span>
            </h2>
            <p>
              <KineticText
                text={
                  "Explore our comprehensive courses designed to elevate your skills."
                }
              />
            </p>
          </div>
          <CourseDeck />
        </section>
        <section className="section benefits" id="why-strike">
          <div className="section-heading" data-reveal>
            <h2>
              <KineticText text={"Why Choose "} />
              <span>
                <KineticText text={"Us"} />
              </span>
            </h2>
            <p>
              <KineticText
                text={
                  "Learn smarter with modern tools, guided mentors, and a platform built to help you grow your skills faster."
                }
              />
            </p>
          </div>
          <div className="benefit-grid">
            <article className="benefit-interview" data-reveal>
              <div>
                <h3>
                  <KineticText text={"Interview"} />
                  <br />
                  <KineticText text={"Preparation"} />
                </h3>
                <p>
                  <KineticText text={"Learn faster with hands-on tracks"} />
                  <br />
                  <KineticText text={"and mentor feedback."} />
                </p>
                <a className="subtle-link" href={`${site}/practice`}>
                  <KineticText text={"Start practicing ↗"} />
                </a>
              </div>
              <Image
                src="/assets/interview.webp"
                alt="Interview preparation with STRIKE"
                width={500}
                height={500}
              />
            </article>
            <article className="benefit-ai" data-reveal>
              <div className="ai-orbit" aria-hidden>
                <span>✳</span>
                <i />
                <i />
              </div>
              <h3>
                <KineticText text={"AI Support"} />
              </h3>
              <p>
                <KineticText text={"A little guidance."} />
                <br />
                <KineticText text={"A better understanding."} />
              </p>
            </article>
            <article className="benefit-project" data-reveal>
              <div className="project-symbol" aria-hidden>
                <KineticText text={"<"} />
                <span>/</span>
                <KineticText text={">"} />
              </div>
              <h3>
                <KineticText text={"Projects Based Learning"} />
              </h3>
              <p>
                <KineticText
                  text={"Build something real with what you learn."}
                />
              </p>
              <a className="subtle-link" href="#courses">
                <KineticText text={"Explore the courses ↗"} />
              </a>
            </article>
            <article className="benefit-progress" data-reveal>
              <h3>
                <KineticText text={"Track Your Progress"} />
              </h3>
              <ProgressDemo />
            </article>
          </div>
        </section>
        <AboutSection />
        <section className="section faang" data-reveal>
          <div className="faang-copy">
            <h2>
              <KineticText text={"Get All Premium"} />
              <br />
              <KineticText text={"Questions Asked In"} />
              <br />
              <span>
                <KineticText text={"FAANG Companies"} />
              </span>
            </h2>
            <a href={`${site}/practice`} className="button button-light">
              <KineticText text={"Go Ahead "} />
              <span aria-hidden>↗</span>
            </a>
          </div>
          <CompanyExplorer />
        </section>
        <section className="section mentors" id="mentors">
          <div className="section-heading" data-reveal>
            <h2>
              <KineticText text={"Meet With Our "} />
              <span>
                <KineticText text={"Mentors"} />
              </span>
            </h2>
            <p>
              <KineticText
                text={"Learn from the people who build. And love to teach."}
              />
            </p>
          </div>
          <div className="mentor-grid">
            {mentors.map((m) => (
              <article className="mentor-card" key={m.name} data-reveal>
                <div className="mentor-portrait">
                  <Image
                    src={`/assets/${m.image}.webp`}
                    alt={m.name}
                    width={650}
                    height={700}
                    sizes="(max-width:767px) 100vw, 50vw"
                  />
                  <div className="mentor-name">
                    <span>
                      <KineticText text={m.role} />
                    </span>
                    <h3>
                      <KineticText text={m.name} />
                    </h3>
                  </div>
                </div>
                <div className="mentor-bio">
                  <p>
                    <KineticText text={m.bio} />
                  </p>
                  <div className="mentor-bottom">
                    <span>
                      <KineticText text={m.detail} />
                    </span>
                    <a href={m.url} target="_blank" rel="noreferrer">
                      <KineticText text={"Know More ↗"} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section reviews" id="reviews">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">
              <KineticText text={"REVIEWS"} />
            </span>
            <h2>
              <KineticText text={"Trusted by "} />
              <span>
                <KineticText text={"Visionaries"} />
              </span>
            </h2>
            <p>
              <KineticText
                text={"Learning journeys, in our students’ own words."}
              />
            </p>
          </div>
          <ReviewRail />
        </section>
        <section className="section faq" id="faq">
          <div className="faq-intro" data-reveal>
            <h2>
              <KineticText text={"Your Questions,"} />
              <br />
              <span>
                <KineticText text={"Answered"} />
              </span>
            </h2>
            <p>
              <KineticText
                text={
                  "Get instant answers to the most common questions about Strike."
                }
              />
            </p>
            <a className="subtle-link" href={`${site}/contact`}>
              <KineticText text={"Still curious? Contact us ↗"} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q} data-reveal>
                <summary>
                  <KineticText text={q} />
                  <span aria-hidden>+</span>
                </summary>
                <p>
                  <KineticText text={a} />
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-dots" aria-hidden="true">
          <div />
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            <h2>
              <KineticText text={"Make your next"} />
              <br />
              <span>
                <KineticText text={"move count."} />
              </span>
            </h2>
            <p>
              <KineticText text={"Powered by Coder Army."} />
              <br />
              <KineticText text={"Guided lessons. Real projects."} />
              <br />
              <KineticText text={"A world of endless coding."} />
            </p>
          </div>
          <div>
            <h3>
              <KineticText text={"Platform"} />
            </h3>
            <a href="#home">
              <KineticText text={"Home"} />
            </a>
            <a href={`${site}/practice`}>
              <KineticText text={"Practice"} />
            </a>
            <a href={`${site}/dsa-sheet`}>
              <KineticText text={"DSA Sheet"} />
            </a>
          </div>
          <div>
            <h3>
              <KineticText text={"Company"} />
            </h3>
            <a href={`${site}/contact`}>
              <KineticText text={"Contact"} />
            </a>
            <a href="#mentors">
              <KineticText text={"Mentors"} />
            </a>
          </div>
          <div>
            <h3>
              <KineticText text={"Legal"} />
            </h3>
            <a href={`${site}/terms`}>
              <KineticText text={"Terms of Service"} />
            </a>
            <a href={`${site}/privacy`}>
              <KineticText text={"Privacy Policy"} />
            </a>
          </div>
        </div>
        <a className="footer-display" href="#home" aria-label="STRIKE home">
          <KineticText text={"STRIKE"} />
        </a>
        <div className="footer-bottom">
          <span>
            <KineticText
              text={
                "STRIKE recreation for Thunder Hackathon 6.0. Not the official website."
              }
            />
          </span>
          <a href="#home">
            <KineticText text={"Back to top ↑"} />
          </a>
        </div>
      </footer>
    </>
  );
}
