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

type AdminUserRow = {
  id: number | string;
  username: string;
  email: string | null;
  password_hash: string | null;
  display_name: string | null;
  is_active: number;
};

function adminUsername(): string {
  const username = process.env.PATIENT_IQ_ADMIN_USERNAME?.trim();
  if (!username) throw new Error("Admin login is not configured");
  return username;
}

function adminPassword(): string {
  const password = process.env.PATIENT_IQ_ADMIN_PASSWORD;
  if (!password) throw new Error("Admin login is not configured");
  return password;
}

function usernameMatches(value: string, expected: string): boolean {
  return value.trim().toLowerCase() === expected.trim().toLowerCase();
}

async function findConfiguredAdminUser(username = adminUsername()): Promise<AdminUserRow | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, username, email, password_hash, display_name, is_active")
    .eq("role", "dev")
    .eq("is_active", 1)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Admin login failed");

  return (
    (data ?? []).find(
      (row) =>
        usernameMatches(row.username ?? "", username) ||
        usernameMatches(row.email ?? "", username),
    ) ?? null
  );
}

async function saveConfiguredAdminPassword(passwordHash: string): Promise<AdminUserRow> {
  const username = adminUsername();
  const existing = await findConfiguredAdminUser(username);
  const email = username.includes("@") ? username.toLowerCase() : "";

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", existing.id)
      .select("id, username, email, password_hash, display_name, is_active")
      .single();

    if (error || !data) throw new Error("Could not save admin password");
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      tenant_id: null,
      username,
      role: "dev",
      pin_hash: "",
      password_hash: passwordHash,
      display_name: "Host Admin",
      email,
      is_active: 1,
    })
    .select("id, username, email, password_hash, display_name, is_active")
    .single();

  if (error || !data) throw new Error("Could not save admin password");
  return data;
}

async function verifyConfiguredAdminPassword(password: string): Promise<AdminUserRow> {
  const existing = await findConfiguredAdminUser();

  if (existing?.password_hash) {
    const ok = await bcrypt.compare(password, existing.password_hash);
    if (!ok) throw new Error("Invalid credentials");
    return existing;
  }

  if (password !== adminPassword()) throw new Error("Invalid credentials");

  const passwordHash = await bcrypt.hash(password, 10);
  return saveConfiguredAdminPassword(passwordHash);
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

export const loginAdminWithPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        username: z.string().trim().min(1).max(255),
        password: z.string().min(1).max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<LoginResponse> => {
    if (!usernameMatches(data.username, adminUsername())) {
      throw new Error("Invalid credentials");
    }

    const admin = await verifyConfiguredAdminPassword(data.password);
    const payload = {
      userId: Number(admin.id),
      role: "dev" as const,
      tenantId: null,
      displayName: admin.display_name || "Host Admin",
    };

    return {
      token: signToken(payload),
      user: { ...payload, email: admin.email ?? "" },
      tenant: null,
    };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().min(10),
        currentPassword: z.string().min(1).max(255),
        newPassword: z.string().min(8).max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: true }> => {
    let decoded: Omit<AuthUser, "email">;
    try {
      decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as Omit<AuthUser, "email">;
    } catch {
      throw new Error("Not authenticated");
    }

    if (decoded.role !== "dev") throw new Error("Forbidden");

    await verifyConfiguredAdminPassword(data.currentPassword);
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await saveConfiguredAdminPassword(passwordHash);

    return { ok: true };
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
