import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { scoreAnswers, type Score } from "@/lib/scoring";

const RECORD_LIMIT = 1000;

export type PublicTenant = {
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
};

export const getPublicTenant = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ code: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data }): Promise<PublicTenant> => {
    const { data: t, error } = await supabaseAdmin
      .from("tenants")
      .select("name, welcome_msg, primary_color, accent_color, logo_url, status")
      .eq("account_code", data.code)
      .eq("status", "active")
      .maybeSingle();

    if (error || !t) throw new Error("Store not found");

    return {
      name: t.name,
      welcomeMsg: t.welcome_msg ?? "",
      primaryColor: t.primary_color ?? "#003087",
      accentColor: t.accent_color ?? "#CC0000",
      logoUrl: t.logo_url ?? "",
    };
  });

const ContactSchema = z.object({
  name: z.string().max(120).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  email: z.string().max(255).optional().default(""),
});

const AnswerSchema = z.enum(["a", "b", "c", "d"]).optional();
const AnswersSchema = z.object({
  q1: AnswerSchema, q2: AnswerSchema, q3: AnswerSchema, q4: AnswerSchema,
  q5: AnswerSchema, q6: AnswerSchema, q7: AnswerSchema, q8: AnswerSchema,
  q9: AnswerSchema, q10: AnswerSchema, q11: AnswerSchema, q12: AnswerSchema,
});

function generateSessionId(): string {
  return "ps-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

export const submitPublicIntake = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        accountCode: z.string().min(1).max(64),
        isNewPatient: z.boolean().optional().default(false),
        contact: ContactSchema.optional().default({ name: "", phone: "", email: "" }),
        answers: AnswersSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: true; score: Score }> => {
    const { data: tenant, error: tenantErr } = await supabaseAdmin
      .from("tenants")
      .select("id, status")
      .eq("account_code", data.accountCode)
      .eq("status", "active")
      .maybeSingle();

    if (tenantErr || !tenant) throw new Error("Store not found");

    const { count } = await supabaseAdmin
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenant.id)
      .is("deleted_at", null);

    if ((count ?? 0) >= RECORD_LIMIT) {
      throw new Error("Record limit reached. Please speak to a staff member.");
    }

    const score = scoreAnswers(data.answers);
    const now = Math.floor(Date.now() / 1000);

    const { error: insertErr } = await supabaseAdmin.from("sessions").insert({
      id: generateSessionId(),
      tenant_id: tenant.id,
      timestamp: now,
      is_new_patient: data.isNewPatient ? 1 : 0,
      contact_name: data.contact.name ?? "",
      contact_phone: data.contact.phone ?? "",
      contact_email: data.contact.email ?? "",
      answers: JSON.stringify(data.answers),
      purchase_readiness: score.purchaseReadiness,
      urgency: score.urgency,
      budget_tier: score.budgetTier,
      frame_style: score.frameStyle,
      face_shape: score.faceShape,
      color_pref: score.colorPref,
      usage_env: score.usageEnv,
      lens_flags: JSON.stringify(score.lensFlags),
      created_at: now,
      updated_at: now,
    });

    if (insertErr) throw new Error("Could not save your form");

    return { ok: true, score };
  });
