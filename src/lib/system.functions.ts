import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type SystemStats = {
  ok: boolean;
  time: string;
  db: { ok: boolean; latencyMs: number; error?: string };
  env: {
    hasJwtSecret: boolean;
    hasServiceRole: boolean;
    nodeEnv: string;
  };
};

export const getSystemStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<SystemStats> => {
    const started = Date.now();
    let dbOk = false;
    let dbErr: string | undefined;
    try {
      const { error } = await supabaseAdmin
        .from("tenants")
        .select("id", { count: "exact", head: true })
        .limit(1);
      if (error) dbErr = error.message;
      else dbOk = true;
    } catch (e) {
      dbErr = e instanceof Error ? e.message : String(e);
    }
    return {
      ok: dbOk,
      time: new Date().toISOString(),
      db: { ok: dbOk, latencyMs: Date.now() - started, error: dbErr },
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasServiceRole: !!process.env.PATIENT_IQ_SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV ?? "unknown",
      },
    };
  },
);
