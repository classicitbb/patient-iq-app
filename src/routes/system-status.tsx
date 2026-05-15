import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getSystemStats, type SystemStats } from "@/lib/system.functions";

export const Route = createFileRoute("/system-status")({
  component: SystemStatusPage,
});

function SystemStatusPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/system-status" } });
    }
  }, [hydrated, isAuthenticated, navigate]);

  const fetchStats = useServerFn(getSystemStats);
  const { data, error, isLoading, refetch, isFetching } = useQuery<SystemStats>({
    queryKey: ["system-stats"],
    queryFn: () => fetchStats(),
    enabled: hydrated && isAuthenticated,
    refetchInterval: 15_000,
  });

  if (!hydrated || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">System Status</h1>
          <div className="flex gap-3 text-sm">
            <Link to="/debug" className="text-primary underline">Debug</Link>
            <Link to="/" className="text-primary underline">Home</Link>
          </div>
        </header>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-mono">{user?.email}</span> ({user?.role}).
          Auto-refreshes every 15s.
        </p>

        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 text-sm border rounded hover:bg-muted"
          disabled={isFetching}
        >
          {isFetching ? "Refreshing…" : "Refresh now"}
        </button>

        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {error && (
          <div className="border border-destructive/50 bg-destructive/5 text-destructive rounded p-3 text-sm">
            {(error as Error).message}
          </div>
        )}

        {data && (
          <>
            <Card label="Overall" ok={data.ok} />
            <section className="border rounded-lg p-4 space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Database</h2>
              <KV k="connected" v={String(data.db.ok)} ok={data.db.ok} />
              <KV k="latency" v={`${data.db.latencyMs} ms`} />
              {data.db.error && <KV k="error" v={data.db.error} ok={false} />}
            </section>
            <section className="border rounded-lg p-4 space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Server Environment</h2>
              <KV k="JWT_SECRET" v={data.env.hasJwtSecret ? "present" : "MISSING"} ok={data.env.hasJwtSecret} />
              <KV k="SERVICE_ROLE" v={data.env.hasServiceRole ? "present" : "MISSING"} ok={data.env.hasServiceRole} />
              <KV k="NODE_ENV" v={data.env.nodeEnv} />
              <KV k="server time" v={data.time} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`border rounded-lg p-4 flex items-center justify-between ${ok ? "border-green-500/40 bg-green-500/5" : "border-destructive/50 bg-destructive/5"}`}>
      <span className="font-semibold">{label}</span>
      <span className={`text-sm font-mono ${ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
        {ok ? "● OK" : "● DEGRADED"}
      </span>
    </div>
  );
}

function KV({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex gap-3 text-sm font-mono">
      <span className="text-muted-foreground min-w-[160px]">{k}</span>
      <span className={`break-all ${ok === false ? "text-destructive" : ok === true ? "text-green-600 dark:text-green-400" : ""}`}>{v}</span>
    </div>
  );
}
