import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect /browse to /courses as the root catalogue
export const Route = createFileRoute("/browse/")({
  beforeLoad: () => {
    throw redirect({ to: "/courses" });
  },
});
