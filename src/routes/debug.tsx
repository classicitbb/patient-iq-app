import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/debug")({
  component: DebugPage,
});

function DebugPage() {
  const { token, user, tenant, isAuthenticated, logout } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>("checking…");
  const [healthBody, setHealthBody] = useState<string>("");

  useEffect(() => {
    setHydrated(true);
    fetch("/api/public/health")
      .then(async (r) => {
        setHealthStatus(`${r.status} ${r.statusText}`);
        setHealthBody(await r.text());
      })
      .catch((e) => setHealthStatus(`error: ${String(e)}`));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Debug — Auth State</h1>
          <Link to="/" className="text-sm text-primary underline">Home</Link>
        </header>
        <p className="text-sm text-muted-foreground">
          Internal page. Shows what the client knows about the current session.
          No server calls are made for auth state.
        </p>

        <Section title="Hydration">
          <KV k="ssr-safe hydrated" v={String(hydrated)} />
        </Section>

        <Section title="Authentication">
          <KV k="isAuthenticated" v={String(isAuthenticated)} />
          <KV k="token" v={token ? `${token.slice(0, 16)}… (${token.length} chars)` : "—"} />
        </Section>

        <Section title="User">
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">
            {JSON.stringify(user, null, 2) || "null"}
          </pre>
        </Section>

        <Section title="Tenant">
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">
            {JSON.stringify(tenant, null, 2) || "null"}
          </pre>
        </Section>

        <Section title="Public /api/public/health">
          <KV k="status" v={healthStatus} />
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">{healthBody || "—"}</pre>
        </Section>

        {isAuthenticated && (
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm border rounded hover:bg-muted"
          >
            Clear session
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border rounded-lg p-4 space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3 text-sm font-mono">
      <span className="text-muted-foreground min-w-[160px]">{k}</span>
      <span className="break-all">{v}</span>
    </div>
  );
}
