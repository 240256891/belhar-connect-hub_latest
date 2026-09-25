import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/ui-kit";
import { rand, transactions, weeklyEarnings } from "@/lib/data";
import { usePaymentMethods } from "@/lib/hooks";
import { toast } from "sonner";

export const Route = createFileRoute("/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — Connectly" },
      {
        name: "description",
        content: "Track what you've earned this week, view transactions and withdraw on Connectly.",
      },
      { property: "og:title", content: "Earnings — Connectly" },
      { property: "og:description", content: "Your Connectly income in Rand." },
    ],
  }),
  component: Earnings,
});

function Earnings() {
  const max = Math.max(...weeklyEarnings.map((d) => d.amount));
  const week = weeklyEarnings.reduce((s, d) => s + d.amount, 0);
  const { methods, markUsed } = usePaymentMethods();
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const defaultMethod =
    methods.find((method) => method.id === selectedMethodId) ??
    methods.find((method) => method.isDefault) ??
    methods[0];
  const [available, setAvailable] = useState(() => {
    if (typeof window === "undefined") return 1000;
    const testBalanceSeed = localStorage.getItem("availableEarningsSeed");
    if (testBalanceSeed !== "1000") {
      localStorage.setItem("availableEarningsSeed", "1000");
      localStorage.setItem("availableEarnings", "1000");
      return 1000;
    }
    const stored = localStorage.getItem("availableEarnings");
    return stored === null ? 1000 : Number(stored);
  });
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState<
    { job: string; client: string; amount: number; date: string }[]
  >(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("workerWithdrawals");
    return stored ? JSON.parse(stored) : [];
  });

  const handleWithdraw = () => {
    if (!defaultMethod) {
      toast.error("Add a payment method in Settings before withdrawing.");
      return;
    }
    if (available <= 0) {
      toast.info("There are no cleared earnings available to withdraw.");
      return;
    }
    setWithdrawAmount(String(available));
    setSelectedMethodId(defaultMethod.id);
    setShowWithdrawConfirm(true);
  };

  const confirmWithdrawal = () => {
    const amount = Number(withdrawAmount);
    if (!defaultMethod) {
      toast.error("Select a payment method before withdrawing.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter an amount greater than R0.");
      return;
    }
    if (amount > available) {
      toast.error("The withdrawal amount cannot exceed your available earnings.");
      return;
    }
    const remaining = Math.round((available - amount) * 100) / 100;
    setAvailable(remaining);
    localStorage.setItem("availableEarnings", String(remaining));
    localStorage.setItem(
      "lastWithdrawal",
      JSON.stringify({ amount, method: defaultMethod.name, date: new Date().toISOString() }),
    );
    const transaction = {
      job: "Withdrawal to card",
      client: defaultMethod.name,
      amount: -amount,
      date: new Date().toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    setWithdrawals((previous) => {
      const updated = [transaction, ...previous];
      localStorage.setItem("workerWithdrawals", JSON.stringify(updated));
      return updated;
    });
    markUsed(defaultMethod.id);
    setShowWithdrawConfirm(false);
    setWithdrawAmount("");
    toast.success(`${rand(amount)} withdrawn to ${defaultMethod.name}.`);
  };

  return (
    <AppShell
      role="worker"
      title="Earnings"
      subtitle="Paid out every Friday"
      action={<button onClick={handleWithdraw} className="btn-primary">Withdraw Earnings</button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total earned" value="R23 850" hint="Since March 2026" icon="💰" />
        <StatCard label="This week" value={rand(week)} hint="6 jobs" icon="📈" />
        <StatCard label="Available to withdraw" value={rand(available)} hint="Cleared funds" icon="🏦" />
      </div>

      {showWithdrawConfirm && defaultMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card-surface w-full max-w-md space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Confirm withdrawal</h2>
            <label>
              <span className="mb-1.5 block text-sm font-semibold">Amount (maximum {rand(available)})</span>
              <input
                type="number"
                min="1"
                max={available}
                step="0.01"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                className="field"
                placeholder="Enter amount in Rand"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold">Send to</span>
              <select
                value={defaultMethod.id}
                onChange={(event) => setSelectedMethodId(event.target.value)}
                className="field"
              >
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} · {method.details}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-muted-foreground">
              Confirm {withdrawAmount ? rand(Number(withdrawAmount)) : "the entered amount"} to{" "}
              {defaultMethod.name} ({defaultMethod.details}).
            </p>
            <div className="flex gap-3">
              <button onClick={confirmWithdrawal} className="btn-primary flex-1">Confirm withdrawal</button>
              <button onClick={() => setShowWithdrawConfirm(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Payout method</h2>
            <p className="text-sm text-muted-foreground">
              {defaultMethod ? `${defaultMethod.name} · ${defaultMethod.details}` : "No payment method added yet."}
            </p>
          </div>
          <Link to="/settings" className="btn-secondary !h-10 !px-4 !text-sm">
            Manage payment methods
          </Link>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="font-display text-lg font-bold">This week</h2>
        <div className="mt-6 flex h-48 items-end gap-3">
          {weeklyEarnings.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {d.amount ? rand(d.amount) : ""}
              </span>
              <div
                className="w-full rounded-t-lg bg-[linear-gradient(180deg,var(--primary),var(--primary-dark))]"
                style={{ height: `${max ? (d.amount / max) * 100 : 0}%`, minHeight: 4 }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <h2 className="border-b border-border p-5 font-display text-lg font-bold">Transactions</h2>
        <ul className="divide-y divide-border">
          {[...withdrawals, ...transactions].map((t) => (
            <li key={t.job} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 p-4">
              <span className="min-w-0">
                <span className="block truncate font-semibold">{t.job}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.client} · {t.date}
                </span>
              </span>
              <span className={`shrink-0 font-display font-bold ${t.amount < 0 ? "text-destructive" : "text-primary"}`}>
                {t.amount < 0 ? "-" : "+"}{rand(Math.abs(t.amount))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
