import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { categories } from "@/lib/data";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Connectly Belhar" },
      {
        name: "description",
        content:
          "Create a free Connectly account as a Community Member to post jobs, or as a Worker to find paid work in Belhar, Cape Town.",
      },
      { property: "og:title", content: "Sign up for Connectly" },
      { property: "og:description", content: "Join Belhar's community job marketplace — free." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const [role, setRole] = useState<"member" | "worker">("member");
  const [skills, setSkills] = useState<string[]>(["Gardener"]);
  const navigate = useNavigate();

  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Free to join. It takes about two minutes.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <RoleTab active={role === "member"} onClick={() => setRole("member")}>
            🙋🏽 I need help
          </RoleTab>
          <RoleTab active={role === "worker"} onClick={() => setRole("worker")}>
            🧰 I want to work
          </RoleTab>
        </div>

        <form
          className="card-surface mt-6 space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: role === "member" ? "/member/dashboard" : "/worker/dashboard" });
          }}
        >
          <Field label="Full name">
            <input className="field" placeholder="e.g. Fatima Adams" defaultValue="" />
          </Field>
          <Field label="Email address">
            <input className="field" type="email" placeholder="you@example.co.za" />
          </Field>
          <Field label="Phone number">
            <input className="field" type="tel" placeholder="072 123 4567" />
          </Field>
          <Field label="Password">
            <input className="field" type="password" placeholder="At least 8 characters" />
          </Field>
          <Field label="Location">
            <input className="field" defaultValue="Belhar, Cape Town" />
          </Field>

          {role === "worker" && (
            <>
              <Field label="Your skills">
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = skills.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleSkill(c)}
                        className={`pill border ${
                          on
                            ? "border-primary bg-accent text-primary"
                            : "border-border bg-surface text-muted-foreground"
                        }`}
                      >
                        {on ? "✓ " : "+ "}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Experience level">
                <select className="field">
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </Field>
            </>
          )}

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>
              I agree to the Connectly Terms of Service and Community Guidelines for Belhar members.
            </span>
          </label>

          <button type="submit" className="btn-primary w-full">
            Create {role === "member" ? "Community Member" : "Worker"} account
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </MarketingLayout>
  );
}

function RoleTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-lg text-sm font-semibold transition-colors ${
        active ? "bg-surface text-primary shadow-[var(--shadow-card)]" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
