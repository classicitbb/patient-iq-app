import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { changeAdminPassword } from "@/lib/auth.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, isHydrated, logout } = useAuth();
  const changePassword = useServerFn(changeAdminPassword);
  const isAdmin = user?.role === "admin" || user?.role === "dev";

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: "/login", search: { redirect: "/admin" } });
    }
  }, [isHydrated, isAuthenticated, isAdmin, navigate]);

  const passwordHelp = useMemo(() => {
    if (!form.newPassword) return "Use at least 8 characters.";
    if (form.newPassword.length < 8) return "Password must be at least 8 characters.";
    if (form.confirmPassword && form.newPassword !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "Password is ready to save.";
  }, [form.newPassword, form.confirmPassword]);

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!token) {
      setStatus({ kind: "error", message: "Please sign in again." });
      return;
    }
    if (form.newPassword.length < 8) {
      setStatus({ kind: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ kind: "error", message: "New passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        data: {
          token,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStatus({ kind: "success", message: "Admin password updated." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update password.";
      setStatus({
        kind: "error",
        message:
          message === "Invalid credentials"
            ? "Current password is incorrect."
            : message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (!isHydrated || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Admin Console</p>
            <h1 className="mt-1 text-2xl font-bold">Patient IQ Administration</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {user.displayName || "Admin"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Public Page
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">Access Status</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium uppercase">{user.role}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email || "Not set"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Session</dt>
                <dd className="font-medium text-green-700">Active</dd>
              </div>
            </dl>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-border bg-background p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold">Change Admin Password</h2>
              <p className="text-sm text-muted-foreground">
                This updates the stored host-admin password used after the initial environment secret login.
              </p>
            </div>

            {status && (
              <div
                className={`rounded-md px-4 py-3 text-sm border ${
                  status.kind === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-1">Current password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm((current) => ({ ...current, currentPassword: e.target.value }))}
                autoComplete="current-password"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">New password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm((current) => ({ ...current, newPassword: e.target.value }))}
                autoComplete="new-password"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Confirm new password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                autoComplete="new-password"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
              />
              <p className="mt-2 text-xs text-muted-foreground">{passwordHelp}</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
