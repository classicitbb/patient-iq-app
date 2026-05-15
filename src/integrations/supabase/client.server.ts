import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vzbuhwjcozsvloukdfwp.supabase.co";

export const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.PATIENT_IQ_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
