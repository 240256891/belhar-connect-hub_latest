import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { JobCard, StatCard, Section } from "@/components/ui-kit";
import { jobs } from "@/lib/data";

export const Route = createFileRoute("/worker/dashboard")({
  head: () => ({
    meta: [
      { title: "Worker Dashboard — Connectly" },
      {
        name: "description",
        content: "See recommended jobs near you, your rating and earnings on Connectly.",
      },
      { property: "og:title", content: "Worker Dashboard — Connectly" },
      { property: "og:description", content: "Your work, rating and income in Belhar." },
    ],
  }),
  component: WorkerDashboard,
});

function WorkerDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <AppShell
      role="worker"
      title="Molo, Sipho 👋"
      subtitle="Gardener · Belhar Ext 13"
      action={
        <button
          onClick={() => setAvailable(!available)}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5"
        >
          <span className="text-sm font-semibold">
            {available ? "Available for work" : "Not available"}
          </span>
          <span
            className={`relative h-7 w-12 rounded-full transition-colors ${
              available ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-surface transition-all ${
                available ? "left-6" : "left-1"
              }`}
            />
          </span>
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Completed jobs" value="47" hint="8 this month" icon="✅" />
        <StatCard label="Total earned" value="R23 850" hint="R3 630 this week" icon="💰" />
        <StatCard label="Rating" value="4.9★" hint="From 41 reviews" icon="⭐" />
      </div>

      <Section
        title="Recommended for you"
        action={
          <Link to="/worker/find-jobs" className="text-sm font-semibold text-primary">
            See all jobs
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs
            .filter((j) => j.status === "Open")
            .slice(0, 4)
            .map((j) => (
              <JobCard key={j.id} job={j} view="worker" />
            ))}
        </div>
      </Section>

      <Section
        title="My applications"
        action={
          <Link to="/worker/applications" className="text-sm font-semibold text-primary">
            View all
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["Applied", 2],
            ["Shortlisted", 1],
            ["Hired", 1],
            ["Rejected", 1],
          ].map(([label, n]) => (
            <div key={label as string} className="card-surface p-5">
              <div className="font-display text-2xl font-bold">{n}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
