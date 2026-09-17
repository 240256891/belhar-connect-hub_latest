import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { categories } from "@/lib/data";

export const Route = createFileRoute("/member/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Job — Connectly" },
      {
        name: "description",
        content: "Describe the job, set your budget in Rand and reach workers near Belhar.",
      },
      { property: "og:title", content: "Post a Job — Connectly" },
      { property: "og:description", content: "Post a job to Belhar workers in two minutes." },
    ],
  }),
  component: PostJob,
});

function PostJob() {
  const [desc, setDesc] = useState("");
  const [urgent, setUrgent] = useState(false);
  const navigate = useNavigate();

  return (
    <AppShell role="member" title="Post a New Job" subtitle="Reach workers within 5 km of you">
      <form
        className="card-surface max-w-2xl space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/member/jobs" });
        }}
      >
        <L label="Job title">
          <input className="field" placeholder="e.g. Garden clean-up and hedge trimming" />
        </L>
        <L label="Category">
          <select className="field">
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </L>
        <L label="Description">
          <textarea
            maxLength={200}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="Tell workers exactly what needs doing and what's provided."
            className="w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:border-primary"
          />
          <span className="mt-1 block text-right text-xs text-muted-foreground">
            {desc.length}/200 characters
          </span>
        </L>
        <div className="grid gap-5 sm:grid-cols-2">
          <L label="Budget (R)">
            <input className="field" type="number" placeholder="450" />
          </L>
          <L label="Date & time needed">
            <input className="field" type="datetime-local" />
          </L>
        </div>
        <L label="Location">
          <input className="field" defaultValue="Belhar Ext 15, Cape Town" />
        </L>
        <L label="Photos (optional)">
          <div className="grid h-32 place-items-center rounded-xl border-2 border-dashed border-border text-center text-sm text-muted-foreground">
            <div>
              📷
              <div>Tap to upload photos of the job</div>
              <div className="text-xs">JPG or PNG, up to 5 images</div>
            </div>
          </div>
        </L>

        <button
          type="button"
          onClick={() => setUrgent(!urgent)}
          className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left"
        >
          <span>
            <span className="block text-sm font-semibold">Mark as urgent</span>
            <span className="block text-xs text-muted-foreground">
              Pushes your job to the top of Find Jobs for 24 hours
            </span>
          </span>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              urgent ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-surface transition-all ${
                urgent ? "left-6" : "left-1"
              }`}
            />
          </span>
        </button>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary flex-1">
            Post job
          </button>
          <button type="button" className="btn-secondary">
            Save draft
          </button>
        </div>
      </form>
    </AppShell>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
