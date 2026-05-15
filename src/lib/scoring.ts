export type AnswerKey = "a" | "b" | "c" | "d";
export type Answers = Record<string, AnswerKey | undefined>;

export type Score = {
  purchaseReadiness: number;
  urgency: "low" | "medium" | "high";
  budgetTier: "value" | "mid" | "premium" | "luxury";
  frameStyle: string;
  faceShape: string;
  colorPref: string;
  usageEnv: string;
  lensFlags: string[];
};

const pick = <T,>(map: Record<string, T>, k: string | undefined, fallback: T): T =>
  (k && map[k]) ?? fallback;

export function scoreAnswers(ans: Answers): Score {
  const pr =
    (pick({ a: 25, b: 18, c: 8, d: 15 }, ans.q4, 0)) +
    (pick({ a: 5, b: 15, c: 25, d: 35 }, ans.q6, 0)) +
    (pick({ a: 8, b: 18, c: 28, d: 40 }, ans.q8, 0));

  const lensFlags: string[] = [];
  if (ans.q3 === "c" || ans.q3 === "d") lensFlags.push("blue-light");
  if (ans.q1 === "c") lensFlags.push("backup pair opp.");
  if (ans.q6 === "c" || ans.q6 === "d") lensFlags.push("progressive check");
  if (ans.q1 === "a") lensFlags.push("premium coatings");
  if (ans.q3 === "d") lensFlags.push("transitions");

  return {
    purchaseReadiness: Math.min(100, Math.round(pr)),
    urgency: pick({ a: "low", b: "low", c: "medium", d: "high" } as const, ans.q6, "medium"),
    budgetTier: pick({ a: "value", b: "mid", c: "premium", d: "luxury" } as const, ans.q8, "mid"),
    frameStyle: pick(
      { a: "Classic & Polished", b: "Modern & Bold", c: "Relaxed & Practical", d: "Creative & Unique" },
      ans.q2,
      "Classic & Polished",
    ),
    faceShape: pick({ a: "Round", b: "Oval", c: "Square", d: "Heart/Diamond" }, ans.q9, "Oval"),
    colorPref: pick(
      { a: "Classic blacks & darks", b: "Warm browns & tortoise", c: "Metallics", d: "Bold & bright" },
      ans.q10,
      "Classic blacks & darks",
    ),
    usageEnv: pick(
      { a: "Office/screens", b: "Outdoors & active", c: "Everywhere", d: "Formal/professional" },
      ans.q12,
      "Everywhere",
    ),
    lensFlags,
  };
}
