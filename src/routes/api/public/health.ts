import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          ok: true,
          service: "patient-iq",
          time: new Date().toISOString(),
          uptimeMs: Math.floor(performance.now()),
        });
      },
    },
  },
});
