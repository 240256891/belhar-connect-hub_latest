import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Stars, Tag } from "@/components/ui-kit";
import { reviews } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Connectly" },
      {
        name: "description",
        content: "Your Connectly profile: skills, rating, reviews and account settings.",
      },
      { property: "og:title", content: "My Profile — Connectly" },
      { property: "og:description", content: "Manage your Connectly profile and reviews." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell role="worker" title="My Profile" subtitle="How the community sees you">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-accent font-display text-2xl font-bold text-primary">
                SM
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold">Sipho Mthembu</h2>
                <p className="text-sm text-muted-foreground">Gardener · Belhar Ext 13</p>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <Stars rating={4.9} />
                  <span className="text-muted-foreground">47 jobs completed</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Gardener", "Handyman", "Painter"].map((s) => (
                <Tag key={s} label={s} className="bg-accent text-primary" />
              ))}
              <Tag label="Intermediate" className="bg-muted text-muted-foreground" />
            </div>
            <h3 className="mt-6 font-display font-bold">About me</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              I've been doing garden and general maintenance work around Belhar and Bellville South
              for eight years. I bring my own tools, I'm on time, and I clean up properly before I
              leave. Available Monday to Saturday.
            </p>
          </div>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold">Reviews ({reviews.length})</h2>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.name} className="card-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-secondary">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">"{r.text}"</p>
                  <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="card-surface h-fit p-5">
          <h3 className="font-display font-bold">Settings</h3>
          <div className="mt-4 space-y-2">
            <button className="btn-secondary w-full">Edit profile</button>
            <button className="btn-secondary w-full">Change password</button>
            <Link to="/notifications" className="btn-ghost w-full">
              Notifications
            </Link>
            <Link to="/settings" className="btn-ghost w-full">
              Language & settings
            </Link>
            <Link to="/" className="btn-ghost w-full !text-destructive">
              Log out
            </Link>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
