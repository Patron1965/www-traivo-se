import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  ExternalLink,
  CreditCard,
  ShieldCheck,
  KeyRound,
  PackageCheck,
  Sparkles,
  RotateCcw,
} from "lucide-react";

type StepStatus = "todo" | "in_progress" | "done";

interface Step {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
  manualConfirm: boolean; // user can tick this off themselves
  automated?: boolean; // happens without user action
}

const STEPS: Step[] = [
  {
    id: "claim_account",
    title: "Anslut Stripe-kontot",
    description: "Koppla sandbox till ett nytt eller befintligt Stripe-konto.",
    details:
      "Klicka på 'Claim'-länken i Payments-fliken. Skapa ett konto eller logga in med ett befintligt. Bekräfta din e-post via mejlet från Stripe.",
    icon: CreditCard,
    manualConfirm: true,
  },
  {
    id: "setup_live_account",
    title: "Slutför go-live-formuläret hos Stripe",
    description: "Verifiera företag, person, bankkonto och 2FA i Stripes dashboard.",
    details:
      "Stripe visar en aktiveringsguide i 5 delar: verifiera verksamhet, lägg till bank, säkra kontot med 2FA, extras (skattekoder) och granska/skicka in. Välj 'Choose what to copy' och ta med Lovable-appen när du växlar till live.",
    icon: ShieldCheck,
    manualConfirm: true,
  },
  {
    id: "install_app",
    title: "Installera Lovable-appen på live-kontot",
    description: "Krävs om du inte kopierade appen i föregående steg.",
    details:
      "Klicka 'Open Stripe' i Payments-fliken. Stripe leder dig till installationsflödet på ditt LIVE-konto. Detta steg låses upp först när steg 2 är inskickat.",
    icon: PackageCheck,
    manualConfirm: true,
  },
  {
    id: "provision_live_keys",
    title: "Live API-nycklar provisioneras",
    description: "Lovable skapar automatiskt live-nycklar och webhooks.",
    details:
      "Detta sker helt automatiskt när Lovable-appen är installerad på live-kontot. Du behöver inte göra något - vänta upp till någon minut och sidan uppdateras.",
    icon: KeyRound,
    manualConfirm: false,
    automated: true,
  },
  {
    id: "readiness_check",
    title: "Readiness check",
    description: "Lovable verifierar att produkter, priser och webhooks är redo.",
    details:
      "Kör readiness-checken från Payments-fliken. Vid varningar/fel kan du be Lovable fixa dem direkt. När den är grön är checkout live på traivo.se.",
    icon: Sparkles,
    manualConfirm: true,
  },
];

const STORAGE_KEY = "traivo.golive.confirmed.v1";

function loadConfirmed(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveConfirmed(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const GoLiveChecklist = () => {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setConfirmed(loadConfirmed());
  }, []);

  const getStatus = (index: number): StepStatus => {
    const step = STEPS[index];
    const isConfirmed = !!confirmed[step.id];
    const prevDone = index === 0 || getStatus(index - 1) === "done";

    if (isConfirmed) return "done";
    if (!prevDone) return "todo";
    return "in_progress";
  };

  const toggle = (id: string) => {
    const next = { ...confirmed, [id]: !confirmed[id] };
    setConfirmed(next);
    saveConfirmed(next);
  };

  const reset = () => {
    setConfirmed({});
    saveConfirmed({});
  };

  const completedCount = STEPS.filter((s) => confirmed[s.id]).length;
  const allDone = completedCount === STEPS.length;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  return (
    <section className="relative min-h-screen pt-28 pb-24 px-6 bg-noise">
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
            Följ stegen nedan för att gå från testläge till live på{" "}
            <strong className="text-foreground">traivo.se</strong>. Bocka av varje steg när du
            slutfört det - sidan kommer ihåg din progress lokalt.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8 p-5 rounded-2xl glass">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {completedCount} av {STEPS.length} klara
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

        {/* Steps */}
        <ol className="space-y-4">
          {STEPS.map((step, index) => {
            const status = getStatus(index);
            const Icon = step.icon;
            const isLocked = status === "todo";
            const isDone = status === "done";

            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative rounded-2xl border p-5 md:p-6 transition-all ${
                  isDone
                    ? "border-primary/40 bg-primary/[0.04]"
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
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-primary" />
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
                      {isDone && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                          Klart
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-base md:text-lg font-bold mb-1">
                      {step.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      {step.details}
                    </p>

                    {/* Confirm action */}
                    {!isLocked && step.manualConfirm && (
                      <button
                        onClick={() => toggle(step.id)}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Markerad som klar - klicka för att ångra
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />
                            Markera som klar
                          </>
                        )}
                      </button>
                    )}
                    {!isLocked && step.automated && !isDone && (
                      <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        Väntar på att Lovable provisionerar nycklarna...
                        <button
                          onClick={() => toggle(step.id)}
                          className="ml-2 underline hover:text-foreground"
                        >
                          Markera som klar
                        </button>
                      </div>
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
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Den faktiska statusen för varje steg syns i Payments-fliken i Lovable. Där hittar du
            också länkar till Stripe-dashboarden och kan köra readiness-checken.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Återställ checklistan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoLiveChecklist;
