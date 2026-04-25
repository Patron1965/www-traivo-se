import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  ExternalLink,
  CreditCard,
  ShieldCheck,
  KeyRound,
  PackageCheck,
  Sparkles,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";

type RemoteStatus =
  | "completed"
  | "in_progress"
  | "not_started"
  | "action_required";

interface RemoteStep {
  id: string;
  status: RemoteStatus;
  detail?: string;
}

interface RemoteResponse {
  steps: RemoteStep[];
  all_completed: boolean;
  environment: "sandbox" | "live";
  checked_at: string;
}

interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  automated?: boolean;
}

const STEPS: StepConfig[] = [
  {
    id: "claim_account",
    title: "Anslut Stripe-kontot",
    description:
      "Koppla sandbox till ett nytt eller befintligt Stripe-konto via Payments-fliken.",
    icon: CreditCard,
  },
  {
    id: "setup_live_account",
    title: "Slutför go-live-formuläret hos Stripe",
    description:
      "Verifiera företag, person, bankkonto och 2FA i Stripes aktiveringsguide.",
    icon: ShieldCheck,
  },
  {
    id: "install_app",
    title: "Installera Lovable-appen på live-kontot",
    description:
      "Krävs om du inte kopierade appen när du växlade från sandbox till live.",
    icon: PackageCheck,
  },
  {
    id: "provision_live_keys",
    title: "Live API-nycklar provisioneras",
    description:
      "Lovable skapar automatiskt live-nycklar och webhooks - inget du behöver göra.",
    icon: KeyRound,
    automated: true,
  },
  {
    id: "readiness_check",
    title: "Readiness check",
    description:
      "Lovable verifierar att produkter, priser och webhooks är redo på live.",
    icon: Sparkles,
  },
];

const POLL_INTERVAL = 10_000;
const STATUS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-stripe-golive-status`;

const statusLabel: Record<RemoteStatus, string> = {
  completed: "Klart",
  in_progress: "Pågår",
  action_required: "Åtgärd krävs",
  not_started: "Låst",
};

const statusBadgeClass: Record<RemoteStatus, string> = {
  completed: "bg-primary/15 text-primary border border-primary/30",
  in_progress: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
  action_required: "bg-destructive/10 text-destructive border border-destructive/30",
  not_started: "bg-muted/30 text-muted-foreground border border-border",
};

const GoLiveChecklist = () => {
  const [remote, setRemote] = useState<RemoteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const resp = await fetch(STATUS_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Kunde inte hämta status");
      setRemote(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = window.setInterval(fetchStatus, POLL_INTERVAL);
    return () => window.clearInterval(id);
  }, [fetchStatus]);

  const stepStatusMap = new Map<string, RemoteStep>(
    (remote?.steps ?? []).map((s) => [s.id, s]),
  );

  const completedCount = (remote?.steps ?? []).filter(
    (s) => s.status === "completed",
  ).length;
  const allDone = remote?.all_completed ?? false;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  return (
    <section className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-noise">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.05] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Stripe go-live
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Aktivera riktiga betalningar
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Statusen nedan hämtas automatiskt från Stripe var 10:e sekund. Slutför stegen i
            Payments-fliken och denna sida uppdaterar sig själv.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8 p-5 rounded-2xl glass">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              {loading && !remote ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Hämtar status...
                </>
              ) : (
                <>
                  {completedCount} av {STEPS.length} klara
                  {remote?.environment === "live" && (
                    <span className="text-primary normal-case font-bold">· LIVE</span>
                  )}
                </>
              )}
            </span>
            <span className="text-xs font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground">
                Senast uppdaterad {lastUpdated.toLocaleTimeString("sv-SE")}
              </span>
            )}
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Uppdatera nu
            </button>
          </div>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-primary flex items-center gap-2 font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Klart - betalningar är live på traivo.se
            </motion.div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm text-destructive">
              Kunde inte hämta live-status: {error}
            </div>
          </div>
        )}

        {/* Steps */}
        <ol className="space-y-4">
          {STEPS.map((step, index) => {
            const remoteStep = stepStatusMap.get(step.id);
            const status: RemoteStatus = remoteStep?.status ?? "not_started";
            const Icon = step.icon;
            const isLocked = status === "not_started";
            const isDone = status === "completed";
            const isAttention = status === "action_required";

            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative rounded-2xl border p-5 md:p-6 transition-all ${
                  isDone
                    ? "border-primary/40 bg-primary/[0.04]"
                    : isAttention
                      ? "border-destructive/40 bg-destructive/[0.04]"
                      : isLocked
                        ? "border-border/40 bg-card/30 opacity-60"
                        : "border-primary/20 bg-card/60 shadow-[0_4px_20px_hsl(var(--primary)/0.08)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isDone ? (
                      <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-primary" strokeWidth={2.5} />
                      </div>
                    ) : isLocked ? (
                      <div className="w-9 h-9 rounded-full bg-muted/30 border border-border flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ) : isAttention ? (
                      <div className="w-9 h-9 rounded-full bg-destructive/15 border border-destructive/40 flex items-center justify-center">
                        <AlertCircle className="w-4.5 h-4.5 text-destructive" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        {step.automated ? (
                          <Loader2 className="w-4.5 h-4.5 text-primary animate-spin" />
                        ) : (
                          <Icon className="w-4.5 h-4.5 text-primary" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Steg {index + 1}
                      </span>
                      {step.automated && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                          Automatiskt
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass[status]}`}
                      >
                        {statusLabel[status]}
                      </span>
                    </div>
                    <h2 className="font-display text-base md:text-lg font-bold mb-1">
                      {step.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    {remoteStep?.detail && (
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">
                        {remoteStep.detail}
                      </p>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Actions */}
        <div className="mt-10 p-6 rounded-2xl glass border border-primary/20">
          <h3 className="font-display text-base font-bold mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            Hantera betalningar
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Stegen utförs i Payments-fliken i Lovable och i Stripes dashboard. Den här sidan
            speglar vad Stripe rapporterar tillbaka.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoLiveChecklist;
