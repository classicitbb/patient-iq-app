import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !pin) {
      setError("Please enter your email and PIN.");
      return;
    }
    setLoading(true);
    try {
      // TODO: wire to server function for PIN verification once Phase 4 lands
      setError("Staff login is being wired up to your Supabase users table — coming in the next phase.");
    } finally {
      setLoading(false);
    }
    void navigate;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-muted/30">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>

        <div className="text-center mt-6 mb-8">
          <span className="text-3xl">👓</span>
          <h1 className="text-2xl font-bold mt-2">Patient Smart App</h1>
          <p className="text-sm text-muted-foreground">Staff Login</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <h2 className="text-xl font-semibold">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground">Enter your email and PIN to access your clinic's app.</p>

          {error && (
            <div className="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">{error}</div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-border px-3 py-2 bg-background"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
              autoComplete="current-password"
              placeholder="Enter your PIN"
              className="w-full rounded-md border border-border px-3 py-2 bg-background"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2.5 font-medium disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
