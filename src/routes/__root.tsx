import { createRootRouteWithContext, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import "../styles.css";

interface RouterContext { queryClient: QueryClient }

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Patient IQ — Smart Patient Intake for Optical Practices" },
      { name: "description", content: "Patient IQ helps optical practices capture intake, score patients, and route to the right care path." },
      { property: "og:title", content: "Patient IQ — Smart Patient Intake for Optical Practices" },
      { name: "twitter:title", content: "Patient IQ — Smart Patient Intake for Optical Practices" },
      { property: "og:description", content: "Patient IQ helps optical practices capture intake, score patients, and route to the right care path." },
      { name: "twitter:description", content: "Patient IQ helps optical practices capture intake, score patients, and route to the right care path." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5b3923f9-77a9-44f9-b67a-af371b1c3e74/id-preview-d22ca256--67974c79-72e8-4504-992f-a64b315eff87.lovable.app-1778873413631.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5b3923f9-77a9-44f9-b67a-af371b1c3e74/id-preview-d22ca256--67974c79-72e8-4504-992f-a64b315eff87.lovable.app-1778873413631.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  shellComponent: RootShell,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404</h1>
      <Link to="/" className="text-primary underline">Back home</Link>
    </div>
  ),
  errorComponent: ErrorPage,
});

function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  // Log the raw Error so the stack reaches Server Logs / browser console.
  console.error("[root errorComponent]", error);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        We hit an unexpected error. The team has been notified. You can try again, or head back home.
      </p>
      <p className="text-xs font-mono text-muted-foreground/70 max-w-md break-all">
        {error?.message || "Unknown error"}
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-4 py-2 border rounded hover:bg-muted text-sm">Try again</button>
        <Link to="/" className="px-4 py-2 border rounded hover:bg-muted text-sm">Go home</Link>
      </div>
    </div>
  );
}

function RootShell() {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <div id="root"><AuthProvider><Outlet /></AuthProvider></div>
        <Scripts />
      </body>
    </html>
  );
}
