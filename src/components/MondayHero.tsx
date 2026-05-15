import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowDown, Brain, Lock,
  Recycle, Wrench, Building2, Truck, HeartPulse,
} from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type Level = "business" | "tech";
const LEVEL_STORAGE_KEY = "traivo-answer-level";

const MondayHero = () => {
  const t = useT();
  const [level, setLevel] = useState<Level>("business");
  const [chosen, setChosen] = useState(false);

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

  const industries = [
    { icon: Recycle, label: t({ sv: "Miljö & avfall", en: "Environment & waste" }), to: "/#branscher" },
    { icon: Wrench, label: t({ sv: "Teknisk service", en: "Technical service" }), to: "/#branscher" },
    { icon: Building2, label: t({ sv: "Fastighet & FM", en: "Property & FM" }), to: "/#branscher" },
    { icon: Truck, label: t({ sv: "Transport & last mile", en: "Transport & last mile" }), to: "/#branscher" },
    { icon: HeartPulse, label: t({ sv: "Hemtjänst & mobil vård", en: "Home care & mobile health" }), to: "/#branscher" },
  ];

  return (
    <section className="relative overflow-hidden bg-noise px-4 sm:px-6 pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="absolute top-0 right-0 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full bg-primary/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(300px,80vw)] h-[min(300px,80vw)] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
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
              sv: "En plattform för hela fältoperationen —",
              en: "One platform for the entire field operation —",
            })}
          </span>
          <br />
          <span className="text-gradient-ice">
            {t({
              sv: "från planering till faktura.",
              en: "from planning to invoice.",
            })}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3"
        >
          {t({
            sv: "Traivo samlar schemaläggning, ruttoptimering, mobilapp för fält och kundportal i ett system.",
            en: "Traivo brings scheduling, route optimization, a mobile app for the field and a customer portal into one system.",
          })}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {t({
            sv: "Byggt för verksamheter med många stopp per dag — där geografi, tid och kompetens måste pussla ihop.",
            en: "Built for operations with many stops per day — where geography, time and skills have to fit together.",
          })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground/80 mb-4">
            {t({ sv: "Vi vänder oss till", en: "Built for" })}
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <Link
                  key={ind.label}
                  to={ind.to}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm text-xs sm:text-sm text-foreground/85 hover:border-primary/50 hover:bg-primary/[0.06] hover:text-foreground transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-3 h-3 text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="font-medium">{ind.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-5"
        >
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t({
              sv: "Boka 20 min — vi visar er vardag",
              en: "Book 20 min — we’ll show your everyday",
            })}
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>

          <div className="flex flex-col items-center gap-2 pt-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              {t({ sv: "Vilken nivå vill du ha svaren på?", en: "Which level do you want answers at?" })}
            </span>
            <div className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-xl glass-subtle">
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
            </div>
            <span className="text-[11px] text-muted-foreground/60">
              {t({ sv: "Hjärnan anpassar svaren efter ditt val.", en: "The brain tailors answers to your choice." })}
            </span>
          </div>

          <Link
            id="ai-chat"
            to="/hjarna#brain-input"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Brain className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" strokeWidth={2.5} />
            <span>
              {t({ sv: "Vill du prova själv först?", en: "Want to try it yourself first?" })}{" "}
              <span className="underline underline-offset-4 decoration-dotted decoration-muted-foreground/40 group-hover:decoration-primary/60">
                {t({
                  sv: "Beskriv din verksamhet anonymt",
                  en: "Describe your business anonymously",
                })}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground/70">
            <Lock className="w-3 h-3" />
            <span>
              {t({
                sv: "Inget loggas · Inga säljsamtal · Helt anonymt",
                en: "Nothing logged · No sales calls · Fully anonymous",
              })}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MondayHero;
