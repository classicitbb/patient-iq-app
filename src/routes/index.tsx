import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitContactRequest } from "@/lib/contact.functions";

export const Route = createFileRoute("/")({
  component: MarketingPage,
});

const PRODUCT = "VisionLift IQ";

const outcomes = [
  {
    n: "01",
    t: "Reveal intent earlier",
    d: "Identify lifestyle, urgency, budget comfort, and product fit before the handoff.",
  },
  {
    n: "02",
    t: "Coach the floor in real time",
    d: "Give clerks a practical interaction tracker that keeps patient needs visible during the visit.",
  },
  {
    n: "03",
    t: "Equip optoms and managers",
    d: "Surface self-admitted lifestyle needs so clinical and retail leaders can personalize recommendations.",
  },
];

const workflow = [
  ["1", "Capture the visit context", "New or returning patients complete a modern intake flow on a tablet or shared link."],
  ["2", "Score needs automatically", "The dashboard organizes lifestyle, urgency, lens opportunities, and purchase readiness."],
  ["3", "Guide the interaction", "Clerks track the visit while optoms and managers align care and product recommendations."],
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function MarketingPage() {
  const submitContact = useServerFn(submitContactRequest);
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ kind: "error", message: "Please fill in all fields." });
      return;
    }

    if (!isValidEmail(form.email.trim())) {
      setStatus({ kind: "error", message: "Please enter a valid email address." });
      return;
    }

    if (!form.consent) {
      setStatus({ kind: "error", message: "Please accept the contact and privacy notice." });
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        },
      });
      setForm({ name: "", email: "", message: "", consent: false });
      setStatus({ kind: "success", message: "Demo request sent. We'll be in touch soon." });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to send. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="marketing-view" className="mktg-page">
      <header className="mktg-header" aria-label="Primary navigation">
        <a href="#top" className="mktg-logo" aria-label={`${PRODUCT} home`}>
          <span className="mktg-logo-mark" aria-hidden="true">VL</span>
          <span className="mktg-logo-text">VisionLift <strong>IQ</strong></span>
        </a>
        <nav className="mktg-nav" aria-label="Page sections">
          <a href="#outcomes">Outcomes</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
          <a href="#compliance">Compliance</a>
          <a href="#contact">Demo</a>
        </nav>
        <Link to="/login" className="mktg-login-btn">Staff Login</Link>
      </header>

      <main id="top">
        <section className="mktg-hero" aria-labelledby="hero-title">
          <div className="mktg-hero-bg" aria-hidden="true" />
          <div className="mktg-hero-inner">
            <div className="mktg-hero-copy">
              <div className="mktg-hero-badge">Modern optical patient-intelligence SaaS</div>
              <h1 id="hero-title" className="mktg-hero-title">Turn every intake answer into a smarter optical sale.</h1>
              <p className="mktg-hero-sub">
                {PRODUCT} helps optical teams understand each patient before the conversation starts - so clerks,
                optometrists, and managers can guide better care, uncover lifestyle needs, and create more confident
                purchase moments.
              </p>
              <div className="mktg-hero-actions">
                <a href="#contact" className="mktg-cta-btn">Schedule a demo</a>
                <a href="#pricing" className="mktg-secondary-btn">Start with 30 days free</a>
              </div>
              <div className="mktg-trust-strip" aria-label="Highlights">
                <span>30-day full-feature trial</span>
                <span>$15 USD / month intro price</span>
                <span>Built for optical retail teams</span>
              </div>
            </div>

            <div className="mktg-hero-panel" aria-label="Example patient intelligence card">
              <div className="mktg-panel-topline">Live visit insight</div>
              <div className="mktg-score-ring"><span>86</span><small>readiness</small></div>
              <div className="mktg-panel-card emphasized">
                <strong>Patient lifestyle signal</strong>
                <p>Screen-heavy workdays, night driving, and style-conscious frame preference.</p>
              </div>
              <div className="mktg-panel-grid">
                <div><span>Care cue</span><strong>Premium lens education</strong></div>
                <div><span>Retail cue</span><strong>Backup pair opportunity</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mktg-section mktg-outcomes" id="outcomes" aria-labelledby="outcomes-title">
          <div className="mktg-section-kicker">Why opticals buy</div>
          <h2 id="outcomes-title" className="mktg-section-title">A sharper visit for patients. A clearer selling motion for your team.</h2>
          <p className="mktg-section-sub">
            Patients tell you what matters. {PRODUCT} packages those answers into timely, practical cues that help your
            team serve with confidence instead of guessing.
          </p>
          <div className="mktg-metric-grid">
            {outcomes.map((card) => (
              <article key={card.n} className="mktg-metric-card">
                <span>{card.n}</span>
                <h3>{card.t}</h3>
                <p>{card.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mktg-section mktg-workflow" id="workflow" aria-labelledby="workflow-title">
          <div className="mktg-split">
            <div>
              <div className="mktg-section-kicker">How it works</div>
              <h2 id="workflow-title" className="mktg-section-title">From waiting-room form to sales-aware care plan in minutes.</h2>
              <p className="mktg-section-sub">
                The front desk shares a guided intake. Patients answer simple questions. Your staff sees a clean profile
                with readiness, care priorities, and conversation prompts.
              </p>
            </div>
            <div className="mktg-steps" aria-label="Product workflow">
              {workflow.map(([n, title, body]) => (
                <div key={n} className="mktg-step">
                  <span>{n}</span>
                  <div><strong>{title}</strong><p>{body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mktg-section mktg-pricing" id="pricing" aria-labelledby="pricing-title">
          <div className="mktg-pricing-card">
            <div className="mktg-price-copy">
              <div className="mktg-section-kicker">One price</div>
              <h2 id="pricing-title" className="mktg-section-title">Introductory access for growing opticals.</h2>
              <p className="mktg-pricing-sub">
                Full-feature trial for 30 days, then one straightforward subscription designed to help stores convert
                more patient tests into better sales conversations.
              </p>
            </div>
            <div className="mktg-price-box" aria-label="$15 USD per month introductory price">
              <span className="mktg-price-label">Intro price</span>
              <div className="mktg-price"><sup>$</sup>15<span>USD/mo</span></div>
              <p>One modern SaaS workspace for the optical visit.</p>
              <a href="#contact" className="mktg-cta-btn full">Claim the trial</a>
            </div>
          </div>
        </section>

        <section className="mktg-section mktg-compliance" id="compliance" aria-labelledby="compliance-title">
          <div className="mktg-section-kicker">Trust, terms, and privacy</div>
          <h2 id="compliance-title" className="mktg-section-title">Built with practical regional compliance in mind.</h2>
          <div className="mktg-compliance-grid">
            <article>
              <h3>Privacy-first contact</h3>
              <p>Demo requests collect only business contact details needed to respond. Submitting the form confirms permission to contact you about {PRODUCT}.</p>
            </article>
            <article>
              <h3>Responsible patient data posture</h3>
              <p>The product is designed around secure access, role-aware dashboards, and minimal collection for optical visit support. Deployment teams should configure region-appropriate retention and data-processing terms.</p>
            </article>
            <article>
              <h3>Commercial terms made visible</h3>
              <p>The trial, introductory price, and cancellation-friendly subscription expectations are presented before a demo conversation so buyers have clear starting terms.</p>
            </article>
          </div>
          <div className="mktg-legal-notes" id="terms">
            <h3>Summary terms</h3>
            <p>30-day full-feature trial. Introductory price is $15 USD per month unless superseded by a signed agreement. Access may require accepted subscription, privacy, and data-processing terms before production use.</p>
          </div>
          <div className="mktg-legal-notes" id="privacy">
            <h3>Privacy summary</h3>
            <p>We use submitted contact information to respond to demo and product inquiries. Do not submit patient health information in the marketing contact form. Regional privacy obligations may vary by customer location and should be finalized in the production agreement.</p>
          </div>
        </section>

        <section className="mktg-contact" id="contact" aria-labelledby="contact-title">
          <div className="mktg-contact-inner">
            <div className="mktg-section-kicker">Contact us</div>
            <h2 id="contact-title" className="mktg-section-title">Let's make your optical visits more profitable and more personal.</h2>
            <p className="mktg-contact-sub">Tell us about your store and we'll help you schedule a demo, preview the workflow, and activate your 30-day full-feature trial.</p>
            <form className="mktg-contact-form" aria-label="Demo request form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="mktgName">Your name</label>
              <input
                type="text"
                id="mktgName"
                autoComplete="name"
                placeholder="Your name"
                className="mktg-input"
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              />
              <label className="sr-only" htmlFor="mktgEmail">Email address</label>
              <input
                type="email"
                id="mktgEmail"
                autoComplete="email"
                placeholder="Email address"
                className="mktg-input"
                maxLength={160}
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              />
              <label className="sr-only" htmlFor="mktgMessage">Practice details</label>
              <textarea
                id="mktgMessage"
                placeholder="Tell us about your optical location, team size, and demo goals..."
                className="mktg-textarea"
                maxLength={1200}
                value={form.message}
                onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))}
              />
              <label className="mktg-consent">
                <input
                  type="checkbox"
                  id="mktgConsent"
                  checked={form.consent}
                  onChange={(e) => setForm((current) => ({ ...current, consent: e.target.checked }))}
                />
                <span>I agree to be contacted about {PRODUCT} and confirm I will not submit patient health information in this form.</span>
              </label>
              {status && <p className={`mktg-form-status ${status.kind}`}>{status.message}</p>}
              <button type="submit" className="mktg-submit-btn" disabled={submitting}>
                {submitting ? "Sending..." : "Schedule my demo"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="mktg-footer">
        <span>© {new Date().getFullYear()} {PRODUCT}. Optical patient-intelligence software.</span>
        <div className="mktg-footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <Link to="/login">Staff Login</Link>
        </div>
      </footer>
    </div>
  );
}
