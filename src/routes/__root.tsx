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
    ],
  }),
  shellComponent: RootShell,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404</h1>
      <Link to="/" className="text-primary underline">Back home</Link>
    </div>
  ),
});

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
