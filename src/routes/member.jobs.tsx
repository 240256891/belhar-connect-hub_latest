import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Tag, Stars } from "@/components/ui-kit";
import { jobs, rand, type JobStatus } from "@/lib/data";

export const Route = createFileRoute("/member/jobs")({
  head: () => ({
    meta: [
      { title: "My Jobs — Connectly" },
      {
        name: "description",
        content: "Open, in-progress and completed jobs you've posted on Connectly.",
      },
      { property: "og:title", content: "My Jobs — Connectly" },
      { property: "og:description", content: "Track every job you've posted in Belhar." },
    ],
  }),
  component: MyJobs,
});

const tabs: JobStatus[] = ["Open", "In Progress", "Completed"];

function MyJobs() {
  const [tab, setTab] = useState<JobStatus>("Open");
  const list = jobs.filter((j) => j.status === tab);

  return (
    <AppShell
      role="member"
      title="My Jobs"
      subtitle="Everything you've posted on Connectly"
      action={
        <Link to="/member/post-job" className="btn-primary">
          ➕ Post a New Job
        </Link>
      }
    >
      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({jobs.filter((j) => j.status === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((j) => (
          <div key={j.id} className="card-surface p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag label={j.status} />
                  {j.urgent && <Tag label="Urgent" />}
                </div>
                <h3 className="mt-2 font-display text-base font-bold">{j.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  📍 {j.location} · 🗓 {j.when} · {j.applicants.length} applicant
                  {j.applicants.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="shrink-0 text-right font-display text-lg font-bold text-primary">
                {rand(j.budget)}
              </div>
            </div>
            {j.applicants.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                {j.applicants.slice(0, 3).map((a) => (
                  <span key={a.name} className="inline-flex items-center gap-2 text-xs">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[10px] font-bold text-primary">
                      {a.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    {a.name} <Stars rating={a.rating} className="text-xs" />
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/member/job/$jobId"
                params={{ jobId: j.id }}
                className="btn-primary !h-10 !px-4 !text-sm"
              >
                View details
              </Link>
              {j.status !== "Completed" && (
                <button className="btn-secondary !h-10 !px-4 !text-sm">✓ Mark Complete</button>
              )}
              <Link to="/messages" className="btn-ghost">
                Messages
              </Link>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="card-surface p-8 text-center text-sm text-muted-foreground">
            Nothing here yet — jobs will appear once they move to {tab.toLowerCase()}.
          </p>
        )}
      </div>
    </AppShell>
  );
}
