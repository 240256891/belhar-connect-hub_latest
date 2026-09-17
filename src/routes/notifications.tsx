import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { notifications } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Connectly" },
      {
        name: "description",
        content: "Applications, messages, reviews and payments — everything happening on your jobs.",
      },
      { property: "og:title", content: "Notifications — Connectly" },
      { property: "og:description", content: "Stay on top of your Connectly activity." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <AppShell
      role="member"
      title="Notifications"
      subtitle="3 unread"
      action={<button className="btn-secondary !h-10 !px-4 !text-sm">Mark all as read</button>}
    >
      <div className="card-surface divide-y divide-border overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.title}
            className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-4 ${
              n.unread ? "bg-accent/40" : ""
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted">
              {n.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{n.title}</span>
              <span className="block truncate text-sm text-muted-foreground">{n.body}</span>
              <span className="block text-xs text-muted-foreground">{n.time}</span>
            </span>
            {n.unread && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
