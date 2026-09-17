import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Connectly" },
      {
        name: "description",
        content: "Manage your Connectly account, notifications, language and appearance.",
      },
      { property: "og:title", content: "Settings — Connectly" },
      { property: "og:description", content: "Account and notification preferences." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "New job matches": true,
    "Application updates": true,
    "Messages": true,
    "Weekly earnings summary": false,
    "Dark mode": false,
  });

  const flip = (k: string) => {
    const next = !toggles[k];
    setToggles({ ...toggles, [k]: next });
    if (k === "Dark mode" && typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
  };

  return (
    <AppShell role="member" title="Settings" subtitle="Account, notifications and appearance">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-bold">Account</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Name" value="Fatima Adams" />
            <Row label="Email" value="fatima.adams@gmail.com" />
            <Row label="Phone" value="072 418 9032" />
            <Row label="Location" value="Belhar Ext 15, Cape Town" />
          </div>
          <div className="mt-5 space-y-2">
            <button className="btn-secondary w-full">Edit profile</button>
            <button className="btn-secondary w-full">Change password</button>
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-bold">Preferences</h2>
          <div className="mt-4 space-y-1">
            {Object.keys(toggles).map((k) => (
              <button
                key={k}
                onClick={() => flip(k)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-3 text-left text-sm hover:bg-muted"
              >
                <span className="font-medium">{k}</span>
                <span
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    toggles[k] ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-surface transition-all ${
                      toggles[k] ? "left-6" : "left-1"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold">Language</span>
            <select className="field">
              <option>English</option>
              <option>Afrikaans</option>
              <option>isiXhosa</option>
            </select>
          </label>
        </div>

        <div className="card-surface p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Support</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button className="btn-secondary w-full">Help centre</button>
            <button className="btn-secondary w-full">Report a problem</button>
            <button className="btn-secondary w-full">Community guidelines</button>
          </div>
          <Link to="/" className="btn-ghost mt-4 w-full !text-destructive">
            Log out
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
