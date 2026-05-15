import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Lock, ChevronDown, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type Level = "business" | "tech";
const LEVEL_STORAGE_KEY = "traivo-answer-level";

const MondayHero = () => {
  const t = useT();
  const [level, setLevel] = useState<Level>("business");
  const [chosen, setChosen] = useState(false);
  const [showLevel, setShowLevel] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LEVEL_STORAGE_KEY);
    if (stored === "tech" || stored === "business") {
      setLevel(stored);
      setChosen(true);
    }
  }, []);

  const chooseLevel = (l: Level) => {
    setLevel(l);
    setChosen(true);
    localStorage.setItem(LEVEL_STORAGE_KEY, l);
  };

  return (
    <section className="relative overflow-hidden bg-noise px-4 sm:px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="absolute top-0 right-0 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full bg-primary/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(300px,80vw)] h-[min(300px,80vw)] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          <span className="font-medium uppercase tracking-[0.25em] text-muted-foreground text-xs sm:text-sm">
            {t({
              sv: "Plattform för fältservice · Norden",
              en: "Field service platform · Nordics",
            })}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto"
        >
          <span className="text-gradient-ice">
            {t({
              sv: "Planera dagen, kör rutten,",
              en: "Plan the day, run the route,",
            })}
          </span>
          <br />
          <span className="text-gradient-ice">
            {t({
              sv: "fakturera samma kväll.",
              en: "invoice the same evening.",
            })}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12"
        >
          {t({
            sv: "Ett system för fältarbetet — schemaläggning, ruttoptimering, mobilapp och kundportal i samma plattform.",
            en: "One system for field work — scheduling, route optimization, mobile app and customer portal in one platform.",
          })}
        </motion.p>

        {/* Primär CTA: Hjärnan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mx-auto max-w-2xl"
        >
          <div className="relative rounded-2xl border border-primary/30 bg-card/40 backdrop-blur-sm p-6 sm:p-8 shadow-[0_0_40px_hsl(var(--primary)/0.08)]">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                {t({ sv: "Börja här", en: "Start here" })}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight">
              {t({
                sv: "Beskriv din verksamhet — få ett konkret svar direkt.",
                en: "Describe your operation — get a concrete answer right away.",
              })}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
              {t({
                sv: "Hjärnan är vår AI-rådgivare. Berätta hur ni jobbar idag, så får du en analys av vad Traivo skulle göra för just er — anonymt och utan säljsamtal.",
                en: "The Brain is our AI advisor. Tell it how you work today and get an analysis of what Traivo would do for you — anonymously and without sales calls.",
              })}
            </p>
            <Link
              id="ai-chat"
              to="/hjarna#brain-input"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-[0_4px_24px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_32px_hsl(var(--primary)/0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <span className="relative inline-flex items-center justify-center w-5 h-5">
                <span className="absolute inset-0 rounded-full bg-primary-foreground/30 animate-ping [animation-duration:1.5s]" />
                <Brain className="relative w-4 h-4 animate-pulse [animation-duration:3s]" strokeWidth={2.5} />
              </span>
              {t({ sv: "Öppna Hjärnan", en: "Open the Brain" })}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
              <Lock className="w-3 h-3" />
              <span>
                {t({
                  sv: "Inget loggas · Inga säljsamtal · Helt anonymt",
                  en: "Nothing logged · No sales calls · Fully anonymous",
                })}
              </span>
            </div>
          </div>

          {/* Diskret nivå-väljare */}
          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowLevel((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 hover:text-foreground transition-colors"
              aria-expanded={showLevel}
            >
              <span>
                {chosen
                  ? level === "tech"
                    ? t({ sv: "Svarsnivå: teknisk", en: "Answer level: technical" })
                    : t({ sv: "Svarsnivå: vardagligt språk", en: "Answer level: everyday language" })
                  : t({ sv: "Anpassa svarsnivå", en: "Adjust answer level" })}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showLevel ? "rotate-180" : ""}`} strokeWidth={2.5} />
            </button>

            {showLevel && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-xl glass-subtle"
              >
                {([
                  { id: "business", label: t({ sv: "IT bra — AI används", en: "IT solid — AI in use" }) },
                  { id: "tech", label: t({ sv: "Rutinerat IT — på väg med AI", en: "Seasoned IT — getting into AI" }) },
                ] as { id: Level; label: string }[]).map((opt) => {
                  const active = level === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => chooseLevel(opt.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        active
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-muted-foreground border border-transparent hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <Link
        to="/kontakt"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t({ sv: "Boka demo", en: "Book demo" })}
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </Link>
    </section>
  );
};

export default MondayHero;
