import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Monitor, Smartphone,
  Database, CalendarClock, Route, Receipt,
} from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const HowItWorksSection = () => {
  const t = useT();

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        {/* Så funkar det */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
            {t({ sv: "Så funkar det", en: "How it works" })}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 max-w-2xl mx-auto">
            {t({
              sv: "Från planering till faktura — i ett flöde.",
              en: "From planning to invoice — in one flow.",
            })}
          </h2>

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

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 mb-3">
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
            <p className="text-[12px] text-muted-foreground/70 mt-4 italic">
              {t({
                sv: "Traivo håller grunddatan levande — så att rätt rutt kan rullas ut varje morgon.",
                en: "Traivo keeps the base data alive — so the right route can roll out every morning.",
              })}
            </p>
          </div>
        </motion.div>

        {/* Två appar — ett system */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          <div className="text-center mb-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Två appar — ett system", en: "Two apps — one system" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold max-w-2xl mx-auto">
              {t({
                sv: "Kontoret styr. Fältet rapporterar.",
                en: "The office steers. The field reports.",
              })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
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
                  className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/[0.05] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={2.25} />
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
      </div>
    </section>
  );
};

export default HowItWorksSection;
