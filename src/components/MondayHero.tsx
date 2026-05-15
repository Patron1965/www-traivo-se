import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Brain, Lock, ChevronDown, Monitor,
  Recycle, Wrench, Building2, Truck, HeartPulse,
  Database, CalendarClock, Route, Smartphone, Receipt,
} from "lucide-react";
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
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {t({
            sv: "Ett system för fältarbetet — schemaläggning, ruttoptimering, mobilapp och kundportal i samma plattform.",
            en: "One system for field work — scheduling, route optimization, mobile app and customer portal in one platform.",
          })}
        </motion.p>

        {/* Så funkar det – 4 steg */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-10"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground/80 mb-4">
            {t({ sv: "Så funkar det", en: "How it works" })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {[
              { icon: CalendarClock, label: t({ sv: "Planera", en: "Plan" }) },
              { icon: Database, label: t({ sv: "Förbered grunddata", en: "Prepare data" }) },
              { icon: Route, label: t({ sv: "Optimera rutt", en: "Optimize route" }) },
              { icon: Smartphone, label: t({ sv: "Rapportera i fält", en: "Report in field" }) },
              { icon: Receipt, label: t({ sv: "Fakturera", en: "Invoice" }) },
            ].map((step, i, arr) => {
              const Icon = step.icon;
              const highlight = step.label === t({ sv: "Förbered grunddata", en: "Prepare data" });
              return (
                <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-sm ${
                    highlight
                      ? "border-primary/50 bg-primary/[0.08]"
                      : "border-primary/25 bg-card/40"
                  }`}>
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15">
                      <Icon className="w-3 h-3 text-primary" strokeWidth={2.5} />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-foreground/90">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-primary/50 hidden sm:block" strokeWidth={2.5} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Vad som måste finnas på plats innan optimeraren kan räkna */}
          <div className="mt-5 max-w-3xl mx-auto">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 mb-2">
              {t({
                sv: "Innan optimeraren kan räkna behövs:",
                en: "Before the optimizer can run, you need:",
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                t({ sv: "Objekt & adresser", en: "Sites & addresses" }),
                t({ sv: "Artiklar/tjänster per objekt", en: "Articles/services per site" }),
                t({ sv: "Restider", en: "Travel times" }),
                t({ sv: "Fordon & kapacitet", en: "Vehicles & capacity" }),
                t({ sv: "Kompetenser", en: "Skills" }),
                t({ sv: "Tidsfönster & öppettider", en: "Time windows & hours" }),
                t({ sv: "Tömnings-/serviceintervall", en: "Service intervals" }),
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-2.5 py-1 rounded-full border border-primary/15 bg-card/20 text-[11px] text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-3 italic">
              {t({
                sv: "Traivo håller grunddatan levande — så att rätt rutt kan rullas ut varje morgon.",
                en: "Traivo keeps the base data alive — so the right route can roll out every morning.",
              })}
            </p>
          </div>
        </motion.div>

        {/* Produkt-split: Traivo One + Traivo Go */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground/80 mb-4">
            {t({ sv: "Två appar — ett system", en: "Two apps — one system" })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
            {[
              {
                to: "/traivo-one",
                icon: Monitor,
                name: "Traivo One",
                tag: t({ sv: "För kontoret", en: "For the office" }),
                desc: t({
                  sv: "Schemaläggning, ruttoptimering och realtidskoll på fältet — i en kontrollvy.",
                  en: "Scheduling, route optimization and real-time field tracking — in one control view.",
                }),
                cta: t({ sv: "Läs om Traivo One", en: "Explore Traivo One" }),
              },
              {
                to: "/traivo-go",
                icon: Smartphone,
                name: "Traivo Go",
                tag: t({ sv: "För fältet", en: "For the field" }),
                desc: t({
                  sv: "Mobilapp för tekniker: digitala protokoll, foto, QR och navigation — fungerar offline.",
                  en: "Mobile app for technicians: digital protocols, photo, QR and navigation — works offline.",
                }),
                cta: t({ sv: "Läs om Traivo Go", en: "Explore Traivo Go" }),
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.name}
                  to={p.to}
                  className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/[0.05] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={2.25} />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-display font-semibold text-foreground text-base sm:text-lg leading-tight">
                        {p.name}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-primary/80">
                        {p.tag}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    {p.cta}
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Branscher – kort textrad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
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
          className="flex flex-col items-center gap-4"
        >
          <Link
            id="ai-chat"
            to="/hjarna#brain-input"
            className={`group inline-flex items-center gap-2 text-xs sm:text-sm transition-all rounded-full px-4 py-2 ${
              chosen
                ? "text-foreground border border-primary/40 bg-primary/[0.06] shadow-[0_0_20px_hsl(var(--primary)/0.15)] hover:bg-primary/[0.1]"
                : "text-foreground/90 border border-primary/30 bg-card/30 hover:bg-primary/[0.06] hover:border-primary/50"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            <span>
              {t({ sv: "Vill du prova själv först?", en: "Want to try it yourself first?" })}{" "}
              <span className="underline underline-offset-4 decoration-dotted decoration-primary/40 group-hover:decoration-primary/70">
                {t({
                  sv: "Beskriv din verksamhet anonymt",
                  en: "Describe your business anonymously",
                })}
              </span>
            </span>
          </Link>

          {/* Diskret nivå-väljare, dold som standard */}
          <div className="flex flex-col items-center gap-2">
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
