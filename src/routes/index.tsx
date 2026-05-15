import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MarketingPage,
});

const PRODUCT = "VisionLift IQ";

function MarketingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border">
        <a href="#top" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">VL</span>
          <span>VisionLift <strong>IQ</strong></span>
        </a>
        <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
          <a href="#outcomes" className="hover:text-foreground">Outcomes</a>
          <a href="#workflow" className="hover:text-foreground">Workflow</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#compliance" className="hover:text-foreground">Compliance</a>
          <a href="#contact" className="hover:text-foreground">Demo</a>
        </nav>
        <Link to="/login" className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium">
          Staff Login
        </Link>
      </header>

      <main id="top">
        <section className="px-6 md:px-12 py-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <div className="inline-block text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-muted-foreground mb-6">
              Modern optical patient-intelligence SaaS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Turn every intake answer into a smarter optical sale.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {PRODUCT} helps optical teams understand each patient before the conversation starts —
              so clerks, optometrists, and managers can guide better care, uncover lifestyle needs,
              and create more confident purchase moments.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#contact" className="rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium">
                Schedule a demo
              </a>
              <a href="#pricing" className="rounded-md border border-border px-6 py-3 font-medium">
                Start with 30 days free
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-6">
              <span>30-day full-feature trial</span>
              <span>$15 USD / month intro price</span>
              <span>Built for optical retail teams</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Live visit insight</div>
            <div className="inline-flex items-baseline gap-1 mb-6">
              <span className="text-6xl font-bold text-primary">86</span>
              <small className="text-muted-foreground">readiness</small>
            </div>
            <div className="rounded-lg bg-background border border-border p-4 mb-4">
              <strong className="block mb-1">Patient lifestyle signal</strong>
              <p className="text-sm text-muted-foreground">Screen-heavy workdays, night driving, and style-conscious frame preference.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-background border border-border p-3">
                <span className="text-muted-foreground text-xs">Care cue</span>
                <strong className="block">Premium lens education</strong>
              </div>
              <div className="rounded-lg bg-background border border-border p-3">
                <span className="text-muted-foreground text-xs">Retail cue</span>
                <strong className="block">Backup pair opportunity</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="outcomes" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Why opticals buy</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A sharper visit for patients. A clearer selling motion for your team.</h2>
          <p className="text-muted-foreground mb-10 max-w-3xl">
            Patients tell you what matters. {PRODUCT} packages those answers into timely, practical cues
            that help your team serve with confidence instead of guessing.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Reveal intent earlier", d: "Identify lifestyle, urgency, budget comfort, and product fit before the handoff." },
              { n: "02", t: "Coach the floor in real time", d: "Give clerks a practical interaction tracker that keeps patient needs visible during the visit." },
              { n: "03", t: "Equip optoms and managers", d: "Surface self-admitted lifestyle needs so clinical and retail leaders can personalize recommendations." },
            ].map((c) => (
              <article key={c.n} className="rounded-xl border border-border p-6">
                <span className="text-3xl font-bold text-primary block mb-2">{c.n}</span>
                <h3 className="text-lg font-semibold mb-2">{c.t}</h3>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="px-6 md:px-12 py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">How it works</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">From waiting-room form to sales-aware care plan in minutes.</h2>
              <p className="text-muted-foreground">
                The front desk shares a guided intake. Patients answer simple questions. Your staff sees
                a clean profile with readiness, care priorities, and conversation prompts.
              </p>
            </div>
            <div className="space-y-4">
              {[
                ["1", "Capture the visit context", "New or returning patients complete a modern intake flow on a tablet or shared link."],
                ["2", "Score needs automatically", "The dashboard organizes lifestyle, urgency, lens opportunities, and purchase readiness."],
                ["3", "Guide the interaction", "Clerks track the visit while optoms and managers align care and product recommendations."],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-4 p-5 rounded-xl bg-background border border-border">
                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{n}</span>
                  <div>
                    <strong className="block mb-1">{t}</strong>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="rounded-2xl border border-border p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">One price</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Introductory access for growing opticals.</h2>
              <p className="text-muted-foreground">
                Full-feature trial for 30 days, then one straightforward subscription designed to help
                stores convert more patient tests into better sales conversations.
              </p>
            </div>
            <div className="rounded-xl bg-primary text-primary-foreground p-8 text-center">
              <span className="text-xs uppercase tracking-wider opacity-80">Intro price</span>
              <div className="my-4 inline-flex items-baseline">
                <sup className="text-xl">$</sup>
                <span className="text-6xl font-bold">15</span>
                <span className="ml-1 opacity-80">USD/mo</span>
              </div>
              <p className="text-sm opacity-90 mb-6">One modern SaaS workspace for the optical visit.</p>
              <a href="#contact" className="block rounded-md bg-background text-foreground px-6 py-3 font-medium">Claim the trial</a>
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 md:px-12 py-20 bg-muted/30">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Talk to us</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See {PRODUCT} in your own optical workflow.</h2>
            <p className="text-muted-foreground mb-8">
              Tell us about your store and we'll set up a personalized walkthrough.
            </p>
            <Link to="/login" className="rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium inline-block">
              Staff sign-in
            </Link>
          </div>
        </section>

        <footer id="compliance" className="px-6 md:px-12 py-10 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {PRODUCT}. Privacy-first. Built for optical retail.
        </footer>
      </main>
    </div>
  );
}
