import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AuthUser = {
  userId: number;
  role: "csr" | "admin" | "dev";
  tenantId: number | null;
  displayName: string;
  email: string;
};

export type AuthTenant = {
  id: number;
  name: string;
  address: string;
  welcomeMsg: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
} | null;

export type LoginResponse = {
  token: string;
  user: AuthUser;
  tenant: AuthTenant;
};

function signToken(payload: Omit<AuthUser, "email">): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export const loginWithPin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email().max(255),
        pin: z.string().min(4).max(8).regex(/^\d+$/),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<LoginResponse> => {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, tenant_id, role, pin_hash, display_name, username, email, is_active")
      .ilike("email", data.email.trim())
      .eq("is_active", 1)
      .maybeSingle();

    if (error || !user) {
      throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(data.pin, user.pin_hash);
    if (!ok) throw new Error("Invalid credentials");

    let tenant: AuthTenant = null;
    if (user.tenant_id) {
      const { data: t } = await supabaseAdmin
        .from("tenants")
        .select("id, name, address, welcome_msg, primary_color, accent_color, logo_url, status")
        .eq("id", user.tenant_id)
        .maybeSingle();

      if (!t) throw new Error("Tenant not found");
      if (t.status !== "active") throw new Error(`Account is ${t.status}`);

      tenant = {
        id: t.id,
        name: t.name,
        address: t.address ?? "",
        welcomeMsg: t.welcome_msg ?? "",
        primaryColor: t.primary_color ?? "#003087",
        accentColor: t.accent_color ?? "#CC0000",
        logoUrl: t.logo_url ?? "",
      };
    }

    const payload = {
      userId: Number(user.id),
      role: user.role as AuthUser["role"],
      tenantId: user.tenant_id ? Number(user.tenant_id) : null,
      displayName: user.display_name || user.username || "User",
    };

    return {
      token: signToken(payload),
      user: { ...payload, email: user.email ?? "" },
      tenant,
    };
  });

export const verifyTokenFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(10) }).parse(input),
  )
  .handler(async ({ data }): Promise<AuthUser | null> => {
    try {
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as Omit<AuthUser, "email">;
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("email, is_active")
        .eq("id", decoded.userId)
        .maybeSingle();
      if (!user || user.is_active !== 1) return null;
      return { ...decoded, email: user.email ?? "" };
    } catch {
      return null;
    }
  });
