import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicTenant, submitPublicIntake } from "@/lib/intake.functions";
import { QUESTIONS, type IntakeOption } from "@/lib/intake-questions";
import type { AnswerKey, Score } from "@/lib/scoring";

export const Route = createFileRoute("/intake/$code")({
  component: IntakePage,
});

type Stage = "welcome" | "contact" | "question" | "thanks";

function IntakePage() {
  const { code } = Route.useParams();
  const fetchTenant = useServerFn(getPublicTenant);
  const submit = useServerFn(submitPublicIntake);

  const tenantQuery = useQuery({
    queryKey: ["public-tenant", code],
    queryFn: () => fetchTenant({ data: { code } }),
    retry: false,
  });

  const [stage, setStage] = useState<Stage>("welcome");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [score, setScore] = useState<Score | null>(null);

  function reset() {
    setStage("welcome");
    setQuestionIdx(0);
    setIsNewPatient(false);
    setContact({ name: "", phone: "", email: "" });
    setAnswers({});
    setScore(null);
    setSubmitError("");
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await submit({
        data: {
          accountCode: code,
          isNewPatient,
          contact,
          answers,
        },
      });
      setScore(res.score);
      setStage("thanks");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save your form";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function selectOption(qid: string, value: AnswerKey) {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    setTimeout(() => {
      if (questionIdx + 1 >= QUESTIONS.length) {
        // delay submit until state has settled
        setTimeout(() => {
          void (async () => {
            setSubmitting(true);
            try {
              const res = await submit({
                data: { accountCode: code, isNewPatient, contact, answers: next },
              });
              setScore(res.score);
              setStage("thanks");
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Could not save your form";
              setSubmitError(msg);
            } finally {
              setSubmitting(false);
            }
          })();
        }, 250);
      } else {
        setQuestionIdx((i) => i + 1);
      }
    }, 280);
  }

  if (tenantQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (tenantQuery.isError || !tenantQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md text-center space-y-2">
          <div className="text-4xl">🚫</div>
          <h1 className="text-xl font-semibold">Store not found</h1>
          <p className="text-sm text-muted-foreground">
            We couldn't find a clinic with code “{code}”. Please ask the front desk for the correct link.
          </p>
        </div>
      </div>
    );
  }

  const tenant = tenantQuery.data;

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8 flex flex-col items-center">
      <header className="w-full max-w-xl text-center mb-6">
        <div className="text-2xl">👓</div>
        <h1 className="text-lg font-semibold mt-1">{tenant.name}</h1>
      </header>

      <ProgressDots stage={stage} questionIdx={questionIdx} />

      <main className="w-full max-w-xl">
        {stage === "welcome" && (
          <WelcomeCard
            storeName={tenant.name}
            welcomeMsg={tenant.welcomeMsg || "While you wait, let us get to know your style a little — so we can make the most of your visit today."}
            isNewPatient={isNewPatient}
            onToggleNew={() => setIsNewPatient((v) => !v)}
            onStart={() => setStage("contact")}
          />
        )}

        {stage === "contact" && (
          <ContactCard
            contact={contact}
            onChange={setContact}
            onBack={() => setStage("welcome")}
            onNext={() => {
              setQuestionIdx(0);
              setStage("question");
            }}
          />
        )}

        {stage === "question" && (
          <QuestionCard
            idx={questionIdx}
            selected={answers[QUESTIONS[questionIdx].id]}
            onSelect={(v) => selectOption(QUESTIONS[questionIdx].id, v)}
            onBack={() => {
              if (questionIdx === 0) setStage("contact");
              else setQuestionIdx((i) => i - 1);
            }}
            onNext={() => {
              const cur = QUESTIONS[questionIdx];
              if (!answers[cur.id]) return;
              if (questionIdx + 1 >= QUESTIONS.length) void handleSubmit();
              else setQuestionIdx((i) => i + 1);
            }}
            submitting={submitting}
          />
        )}

        {submitError && stage !== "thanks" && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {stage === "thanks" && (
          <ThanksCard
            firstName={contact.name.split(" ")[0]}
            score={score}
            isNewPatient={isNewPatient}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}

function ProgressDots({ stage, questionIdx }: { stage: Stage; questionIdx: number }) {
  if (stage === "welcome" || stage === "thanks") return <div className="h-6" />;
  const total = QUESTIONS.length;
  const activeIdx = stage === "contact" ? -1 : questionIdx;
  return (
    <div className="w-full max-w-xl mb-4">
      <div className="flex gap-1 justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i < activeIdx ? "bg-primary" : i === activeIdx ? "bg-primary/70" : "bg-border"
            }`}
          />
        ))}
      </div>
      {stage === "question" && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          Question {questionIdx + 1} of {total}
        </div>
      )}
    </div>
  );
}

function WelcomeCard(props: {
  storeName: string;
  welcomeMsg: string;
  isNewPatient: boolean;
  onToggleNew: () => void;
  onStart: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-center space-y-4">
      <div className="text-4xl">👋</div>
      <h2 className="text-xl font-semibold">Welcome to {props.storeName}!</h2>
      <p className="text-sm text-muted-foreground">{props.welcomeMsg}</p>

      <button
        type="button"
        onClick={props.onToggleNew}
        className="flex items-center gap-3 mx-auto px-4 py-2 rounded-md border border-border hover:bg-muted/50"
      >
        <span
          className={`w-5 h-5 rounded border flex items-center justify-center ${
            props.isNewPatient ? "bg-primary text-primary-foreground border-primary" : "border-border"
          }`}
        >
          {props.isNewPatient ? "✓" : ""}
        </span>
        <span className="text-sm">This is my first visit here</span>
      </button>

      <button
        type="button"
        onClick={props.onStart}
        className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2.5 font-medium"
      >
        Let's Get Started →
      </button>
    </div>
  );
}

function ContactCard(props: {
  contact: { name: string; phone: string; email: string };
  onChange: (c: { name: string; phone: string; email: string }) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { contact, onChange } = props;
  return (
    <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
      <div className="text-3xl text-center">📋</div>
      <h2 className="text-xl font-semibold text-center">Quick intro!</h2>
      <p className="text-sm text-muted-foreground text-center">
        A CSR can help you fill this in if you prefer.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1">First Name</label>
          <input
            value={contact.name}
            onChange={(e) => onChange({ ...contact, name: e.target.value })}
            placeholder="Your name"
            className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Phone</label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => onChange({ ...contact, phone: e.target.value })}
            placeholder="Phone number"
            className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium block mb-1">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
          placeholder="Email address"
          className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm"
        />
      </div>

      <p className="text-xs text-muted-foreground text-center">💬 Fields are optional — tap Next to continue</p>

      <div className="flex items-center justify-between pt-2">
        <button onClick={props.onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
        <span className="text-xs text-muted-foreground">Contact Info</span>
        <button
          onClick={props.onNext}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function QuestionCard(props: {
  idx: number;
  selected: AnswerKey | undefined;
  onSelect: (v: AnswerKey) => void;
  onBack: () => void;
  onNext: () => void;
  submitting: boolean;
}) {
  const q = QUESTIONS[props.idx];
  return (
    <div className="rounded-2xl border border-border bg-background p-8 space-y-5">
      <div className="text-center space-y-1">
        <div className="text-3xl">{q.emoji}</div>
        <h2 className="text-lg font-semibold">{q.q}</h2>
        <p className="text-sm text-muted-foreground">{q.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.opts.map((o: IntakeOption) => {
          const sel = props.selected === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => props.onSelect(o.v)}
              className={`text-left rounded-xl border px-4 py-3 flex items-start gap-3 transition-colors ${
                sel
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <span className="text-2xl">{o.e}</span>
              <span className="text-sm leading-snug">{o.t}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button onClick={props.onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
        <span className="text-xs text-muted-foreground">
          {props.idx + 1} / {QUESTIONS.length}
        </span>
        <button
          onClick={props.onNext}
          disabled={!props.selected || props.submitting}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {props.submitting ? "Saving…" : props.idx + 1 === QUESTIONS.length ? "Finish →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

function ThanksCard(props: {
  firstName: string;
  score: Score | null;
  isNewPatient: boolean;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-center space-y-4">
      <div className="text-4xl">🎉</div>
      <h2 className="text-xl font-semibold">
        Thank you{props.firstName ? ` ${props.firstName}` : ""}!
      </h2>
      <p className="text-sm text-muted-foreground">
        Your optician will be right with you. We're looking forward to helping you find your perfect pair today.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {props.score?.frameStyle && <Chip>🎨 {props.score.frameStyle}</Chip>}
        {props.score?.colorPref && <Chip>✨ {props.score.colorPref}</Chip>}
        {(props.score?.lensFlags ?? []).slice(0, 2).map((f) => (
          <Chip key={f}>{f}</Chip>
        ))}
        {props.isNewPatient && <Chip tone="accent">New Patient</Chip>}
      </div>

      <p className="text-xs text-muted-foreground">
        Please hand the tablet back to the front desk — they'll call you shortly!
      </p>

      <button
        onClick={props.onReset}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Start a New Form
      </button>
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone?: "accent" }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
        tone === "accent" ? "bg-red-100 text-red-700" : "bg-muted text-foreground/80"
      }`}
    >
      {children}
    </span>
  );
}

useEffect; // satisfy TS unused import in some configs (no-op)
