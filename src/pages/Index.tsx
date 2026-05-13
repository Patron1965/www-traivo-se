import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar, Smartphone, Route, MapPin, Brain,
  ArrowRight, Users, CreditCard, X, ChevronDown,
  Recycle, Wrench, Building2, Truck, HeartPulse,
  Check, Minus
} from "lucide-react";
import MondayHero from "@/components/MondayHero";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useT } from "@/i18n/LanguageContext";

const Index = () => {
  const t = useT();
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const features = [
    { icon: Calendar, title: t({ sv: "Schemaläggning", en: "Scheduling" }),       desc: t({ sv: "Automatisk planering som tar hänsyn till kompetens, geografi och kapacitet.", en: "Automatic planning that accounts for skills, geography and capacity." }) },
    { icon: Route,    title: t({ sv: "Smartare rutter", en: "Smarter routes" }),  desc: t({ sv: "Ruttoptimering baserad på riktiga vägar – inte fågelvägen.",                  en: "Route optimization based on real roads — not as the crow flies." }) },
    { icon: Smartphone,title:t({ sv: "Mobilapp offline", en: "Offline mobile app" }),desc:t({ sv: "Fungerar utan nät, med protokoll och foto. Synkar automatiskt.",            en: "Works without coverage, with checklists and photos. Syncs automatically." }) },
    { icon: MapPin,   title: t({ sv: "GPS & akuttilldelning", en: "GPS & urgent dispatch" }), desc: t({ sv: "Realtidskarta med positioner. Akutjobb till närmaste tekniker.", en: "Real-time map with positions. Urgent jobs to the nearest technician." }) },
    { icon: Brain,    title: t({ sv: "AI-analys", en: "AI analysis" }),           desc: t({ sv: "Hittar avvikelser innan de blir problem. Prediktivt underhåll.",             en: "Finds anomalies before they become problems. Predictive maintenance." }) },
    { icon: CreditCard,title:t({ sv: "Fakturering & kundportal", en: "Invoicing & customer portal" }), desc: t({ sv: "Faktura, bokning och besökshistorik – i samma system.", en: "Invoicing, booking and visit history — in one system." }) },
  ];

  const industries = [
    {
      id: "miljo",
      icon: Recycle,
      title: t({ sv: "Miljö, återvinning & avfall", en: "Environment, recycling & waste" }),
      desc:  t({ sv: "Geofencing av tömningsställen, ruttoptimering för tunga fordon, snabb hantering av budningar och extratömningar.", en: "Geofencing of pickup points, route optimization for heavy vehicles, fast handling of on-demand and extra collections." }),
      examples: [
        t({ sv: "Automatisk omplanering när en kund bokar extratömning kl 09:14", en: "Automatic re-planning when a customer books an extra pickup at 09:14" }),
        t({ sv: "Geofence runt varje tömningsställe – verifierar att jobbet faktiskt utfördes", en: "Geofence around every pickup point — verifies the job was actually done" }),
        t({ sv: "Ruttcache för tunga fordon som tar hänsyn till broar, vikt och vändzoner", en: "Route cache for heavy vehicles that respects bridges, weight and turning zones" }),
      ],
    },
    {
      id: "teknisk-service",
      icon: Wrench,
      title: t({ sv: "Tekniska installationer & service", en: "Technical installations & service" }),
      desc:  t({ sv: "Vitvaror, fiber, hiss, kyla. Koppling mellan avtal, artiklar och teknikerns kompetens – med snabb dokumentation i fält.", en: "Appliances, fiber, elevators, cooling. Linking contracts, articles and technician skills — with fast field documentation." }),
      examples: [
        t({ sv: "Matchar jobbet mot tekniker med rätt certifikat och reservdelar i bilen", en: "Matches the job to a technician with the right certifications and spare parts in the van" }),
        t({ sv: "Protokoll med foto signeras i appen – även utan täckning i källaren", en: "Reports with photos are signed in the app — even without coverage in the basement" }),
        t({ sv: "Avtalskoppling: rätt artikel, rätt pris, rätt garanti automatiskt på fakturan", en: "Contract linking: right article, right price, right warranty — automatically on the invoice" }),
      ],
    },
    {
      id: "fastighet",
      icon: Building2,
      title: t({ sv: "Fastighet & facility management", en: "Property & facility management" }),
      desc:  t({ sv: "Yttre skötsel, trappstädning, snöröjning, rondering. Årsplanering, QR-kvitto på utfört arbete och prediktivt underhåll.", en: "Grounds maintenance, stairwell cleaning, snow clearing, rounds. Annual planning, QR receipt of completed work and predictive maintenance." }),
      examples: [
        t({ sv: "Årshjul för rondering – systemet skapar veckans jobb automatiskt", en: "Annual cycle for rounds — the system creates the week’s jobs automatically" }),
        t({ sv: "QR-kod vid varje objekt: skanna för att kvittera utfört arbete", en: "QR code at every site: scan to confirm completed work" }),
        t({ sv: "Snöröjning aktiveras av väderdata – jobb pushas innan kunden hinner ringa", en: "Snow clearing is triggered by weather data — jobs go out before the customer calls" }),
      ],
    },
    {
      id: "transport",
      icon: Truck,
      title: t({ sv: "Transport & last mile", en: "Transport & last mile" }),
      desc:  t({ sv: "Distribution där rutter ändras dagligen. What-if-analys, automatisk omplanering och kundportal med live-leveransstatus.", en: "Distribution where routes change daily. What-if analysis, automatic re-planning and a customer portal with live delivery status." }),
      examples: [
        t({ sv: "What-if: \"Vad händer om bil 4 går sönder kl 11?\" – ny plan på sekunder", en: "What-if: \"What happens if van 4 breaks down at 11?\" — new plan in seconds" }),
        t({ sv: "Live-spårning för slutkund med ETA – färre samtal till kundtjänst", en: "Live tracking for end customers with ETA — fewer calls to customer service" }),
        t({ sv: "Optimering tar hänsyn till lossningstid, inte bara körsträcka", en: "Optimization accounts for unloading time, not just driving distance" }),
      ],
    },
    {
      id: "hemtjanst",
      icon: HeartPulse,
      title: t({ sv: "Hemtjänst & mobil vård", en: "Home care & mobile health" }),
      desc:  t({ sv: "Hårda tidsfönster och slotpreferenser per brukare. Heatmaps som visar belastning per område innan personalen blir överkörd.", en: "Hard time windows and slot preferences per resident. Heatmaps that show area load before staff get overwhelmed." }),
      examples: [
        t({ sv: "Slotpreferenser per brukare respekteras – samma personal så långt det går", en: "Slot preferences per resident are respected — same staff as far as possible" }),
        t({ sv: "Heatmap visar överbelastade områden innan schemat publiceras", en: "Heatmaps show overloaded areas before the schedule is published" }),
        t({ sv: "Akut sjukfrånvaro: AI föreslår omfördelning som håller tidsfönstren", en: "Sudden sick leave: AI proposes a redistribution that keeps the time windows" }),
      ],
    },
  ];

  type Industry = (typeof industries)[number];

  const IndustryCard = ({ ind, index }: { ind: Industry; index: number }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={`glass-subtle rounded-xl p-6 group hover:border-primary/15 transition-all duration-300 ${
          expanded ? "border-primary/25" : ""
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <ind.icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold mb-1.5">{ind.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{ind.desc}</p>

            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary/80 hover:text-primary transition-colors"
            >
              {expanded
                ? t({ sv: "Dölj exempel", en: "Hide examples" })
                : t({ sv: "Visa alla exempel", en: "Show all examples" })}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </button>

            {expanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="mt-3 pt-3 border-t border-border/60 space-y-2.5 overflow-hidden"
              >
                {ind.examples.map((ex) => (
                  <li
                    key={ex}
                    className="flex items-start gap-2.5 text-xs text-foreground/85 leading-relaxed"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const isItems = [
    t({ sv: "Planering, ruttoptimering och daglig schemaläggning för fält.", en: "Planning, route optimization and daily field scheduling." }),
    t({ sv: "Mobilapp för tekniker som funkar offline – protokoll, foto, signatur.", en: "Mobile app for technicians that works offline — checklists, photos, signature." }),
    t({ sv: "Kund- och objektregister med karta och serviceområden.", en: "Customer and site registry with map and service areas." }),
    t({ sv: "Kundportal med automatiska SMS, bokning och historik.", en: "Customer portal with automatic SMS, booking and history." }),
    t({ sv: "Fakturering med färdig Fortnox-koppling – integrationer mot andra ekonomisystem byggs på begäran.", en: "Invoicing with native Fortnox integration — other accounting systems built on request." }),
    t({ sv: "AI som föreslår omplanering, akuttilldelning och prediktivt underhåll.", en: "AI that suggests re-planning, urgent dispatch and predictive maintenance." }),
  ];
  const isNotItems = [
    t({ sv: "Inget bokföringssystem – behåll Fortnox, Visma eller motsvarande.", en: "Not an accounting system — keep Fortnox, Visma or equivalent." }),
    t({ sv: "Inget HR- eller lönesystem – vi exporterar underlag, ni kör lön.", en: "Not an HR or payroll system — we export the data, you run payroll." }),
    t({ sv: "Inget CRM för säljpipelines – vi hanterar kunder, inte leads.", en: "Not a CRM for sales pipelines — we manage customers, not leads." }),
    t({ sv: "Ingen konsumentbokning à la Bokadirekt – vår portal är B2B.", en: "Not a consumer booking site — our portal is B2B." }),
    t({ sv: "Inget ERP – vi täcker fältoperationen, inte hela ekonomin.", en: "Not an ERP — we cover field operations, not full finance." }),
    t({ sv: "Ingen white-label-app till era slutkunder – kundportalen är webbaserad.", en: "No white-label app for your end customers — the portal is web-based." }),
  ];

  return (
    <>
      <MondayHero />

      {/* IS / IS NOT */}
      <section className="py-20 md:py-24 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mb-10"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Ärligt om Traivo", en: "Honest about Traivo" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              {t({ sv: "Det här är vi. Det här är vi inte.", en: "This is what we are. This is what we’re not." })}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t({
                sv: "Vi vet att ni redan har system. Här är exakt vad Traivo täcker — och vad ni ska fortsätta göra någon annanstans.",
                en: "We know you already have systems. Here’s exactly what Traivo covers — and what you should keep doing elsewhere.",
              })}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-2xl border border-primary/20 bg-card/40 p-6 md:p-7"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground">
                  {t({ sv: "Det här är Traivo", en: "This is Traivo" })}
                </h3>
              </div>
              <ul className="space-y-3">
                {isItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card/20 p-6 md:p-7"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
                  <Minus className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground/90">
                  {t({ sv: "Det här är vi inte", en: "This is what we’re not" })}
                </h3>
              </div>
              <ul className="space-y-3">
                {isNotItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <Minus className="w-4 h-4 text-muted-foreground/70 mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 md:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Låter det bekant?", en: "Sound familiar?" })}
            </span>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
              {t({
                sv: "Du har redan system – kanske flera. Ett för planering, ett för fakturering, ett för kundkontakt. Problemet är att inget av dem täcker hela kedjan. Så du hoppar mellan plattformar, dubbelregistrerar och tappar tid varje dag.",
                en: "You already have systems — maybe several. One for planning, one for invoicing, one for customer contact. The problem is that none of them cover the full chain. So you jump between platforms, double-enter data and lose time every day.",
              })}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t({
                sv: "Resultatet: information faller mellan stolarna, tekniker väntar på besked, och du lägger kvällarna på att rätta till det som systemen borde ha löst.",
                en: "The result: information falls through the cracks, technicians wait for answers, and you spend evenings fixing what the systems should have solved.",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="branscher" className="py-24 md:py-28 px-4 sm:px-6 border-t border-border scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mb-10">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Branscher", en: "Industries" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">
              {t({ sv: "Byggt för verksamheter med många stopp", en: "Built for operations with many stops" })}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t({
                sv: "Traivo passar bäst där geografi, tid och kompetens måste pussla ihop varje dag. Här är branscherna där vi gör störst skillnad.",
                en: "Traivo fits best where geography, time and skills have to fit together every day. Here are the industries where we make the biggest difference.",
              })}
            </p>
          </motion.div>

          <div aria-live="polite" className="mb-4 flex items-center gap-3 rounded-lg border border-primary/15 bg-primary/[0.04] px-4 py-3">
            {(() => {
              const selected = industries.find((i) => i.id === activeIndustry);
              const Icon = selected?.icon;
              return (
                <>
                  {Icon ? <Icon className="w-4 h-4 text-primary shrink-0" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  <span className="text-xs text-muted-foreground">
                    {t({ sv: "Visar:", en: "Showing:" })}{" "}
                    <span className="text-foreground font-semibold">
                      {selected ? selected.title : t({ sv: "Alla branscher", en: "All industries" })}
                    </span>
                  </span>
                </>
              );
            })()}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveIndustry(null)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                activeIndustry === null
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/[0.04]"
              }`}
            >
              {t({ sv: "Alla branscher", en: "All industries" })}
            </button>
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isActive = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(isActive ? null : ind.id)}
                  aria-pressed={isActive}
                  className={`relative inline-flex items-center gap-2 rounded-full text-xs font-medium border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.22)] scale-[1.04] pl-2 pr-4 py-2"
                      : "border-primary/25 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-primary/[0.04] hover:scale-[1.02] px-4 py-2"
                  }`}
                >
                  <span className={`flex items-center justify-center rounded-full transition-all ${isActive ? "w-7 h-7 bg-primary-foreground text-primary ring-2 ring-primary-foreground/30" : "w-5 h-5 bg-primary/10"}`}>
                    <Icon className={`${isActive ? "w-4 h-4 text-primary" : "w-3 h-3 text-primary"}`} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className={isActive ? "font-semibold" : ""}>{ind.title}</span>
                  {isActive && (
                    <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-foreground/25">
                      <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
            {activeIndustry !== null && (
              <button
                onClick={() => setActiveIndustry(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={t({ sv: "Återställ filter", en: "Reset filter" })}
              >
                <X className="w-3.5 h-3.5" />
                {t({ sv: "Återställ", en: "Reset" })}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-10">
            {industries
              .filter((ind) => activeIndustry === null || ind.id === activeIndustry)
              .map((ind, i) => (
                <IndustryCard key={ind.id} ind={ind} index={i} />
              ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm md:text-base text-foreground/80 max-w-2xl leading-relaxed">
            {t({
              sv: "Det som gör skillnad är kombinationen geografi och AI. Klustervalidering hindrar att jobb säljs där de inte kan utföras lönsamt. Ruttoptimering med riktiga vägdata sparar bränsle och timmar varje dag. Och beslutsstödet förklarar varför AI:n placerade jobbet just där – så planeraren behåller kontrollen.",
              en: "What makes the difference is the combination of geography and AI. Cluster validation prevents jobs being sold where they can’t be done profitably. Route optimization with real road data saves fuel and hours every day. And the decision support explains why the AI placed a job where it did — so the planner stays in control.",
            })}
          </motion.p>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="py-24 md:py-28 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Vår bakgrund", en: "Our background" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
              {t({ sv: "Byggt av folk som suttit i bilen", en: "Built by people who’ve sat in the van" })}
            </h2>
            <div className="space-y-5 text-sm md:text-base text-foreground/85 leading-[1.8]">
              <p>{t({ sv: "De flesta planeringssystem är byggda av folk som aldrig suttit i en servicebil en hel dag.", en: "Most planning systems are built by people who’ve never sat in a service van for a full day." })}</p>
              <p>{t({ sv: "Vi har. Vi har planerat rutter för hand i Excel, ringt tekniker mitt i lunchen för att flytta om jobb och försökt fakturera från handskrivna protokoll. Vi vet exakt var det brister – för vi har levt med bristerna.", en: "We have. We’ve planned routes by hand in Excel, called technicians during lunch to move jobs around and tried to invoice from handwritten reports. We know exactly where it breaks — because we’ve lived with the breaks." })}</p>
              <p>{t({ sv: "Vi startade Traivo för att vi själva var frustrerade. Vi visste att AI kunde lösa planering, optimering och analys på ett sätt som inte var möjligt för fem år sedan. Men vi visste också att tekniken är värdelös om den inte förstår verkligheten: att en tekniker inte kan vara på två ställen samtidigt, att akutjobb inte väntar, och att en app som kräver 4G i ett garage är meningslös.", en: "We started Traivo because we were frustrated ourselves. We knew AI could solve planning, optimization and analysis in ways that weren’t possible five years ago. But we also knew the tech is useless if it doesn’t understand reality: a technician can’t be in two places at once, urgent jobs don’t wait, and an app that needs 4G in a basement is pointless." })}</p>
              <p>{t({ sv: "Traivo är inte byggt för demos. Det är byggt för måndag morgon kl 06:30.", en: "Traivo isn’t built for demos. It’s built for Monday morning at 06:30." })}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TARGET POPUP */}
      <section className="py-16 md:py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-primary/20 text-sm font-medium text-foreground/90 hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-300">
                  <Users className="w-4 h-4 text-primary/60" />
                  {t({ sv: "Vem är Traivo till för?", en: "Who is Traivo for?" })}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold">
                    {t({ sv: "Vem är Traivo till för?", en: "Who is Traivo for?" })}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>{t({ sv: "Traivo är till för dig som driver serviceverksamhet där tekniker åker ut till kund – VVS, el, kyla, hissar, fastighet, IT, säkerhet, vitvaror, maskinservice eller sophantering.", en: "Traivo is for you if you run a service operation where technicians go out to customers — plumbing, electrical, cooling, elevators, property, IT, security, appliances, machinery or waste." })}</p>
                  <p>{t({ sv: "Om dina tekniker kör rutter och du schemalägger uppdrag varje dag, är Traivo byggt för dig.", en: "If your technicians drive routes and you schedule jobs every day, Traivo is built for you." })}</p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 md:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mb-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Plattformen", en: "The platform" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">
              {t({ sv: "En plattform. Hela kedjan.", en: "One platform. The whole chain." })}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t({
                sv: "Ett system som håller hela dagen – från första jobbet kl 07:00 till sista fakturan kl 17:00. Byggt på operativ erfarenhet, inte på demos.",
                en: "One system that holds up all day — from the first job at 07:00 to the last invoice at 17:00. Built on operational experience, not on demos.",
              })}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300"
              >
                <f.icon className="w-4 h-4 text-primary mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm md:text-base text-foreground/80 font-medium max-w-2xl leading-relaxed">
            {t({
              sv: "Slut på att jaga information mellan fem system. Planering, rutt, jobb, protokoll, faktura, analys – samma plattform, samma data, samma sanning.",
              en: "No more chasing information between five systems. Planning, route, job, report, invoice, analysis — same platform, same data, same truth.",
            })}
          </motion.p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="py-20 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-4">
              {t({ sv: "Det är ingen magi. Det är 15 års vardag, översatt till mjukvara.", en: "It’s not magic. It’s 15 years of everyday work, translated into software." })}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {t({
                sv: "Operativ fältserviceerfarenhet kombinerad med djup AI-kompetens. Inte för att revolutionera en bransch – utan för att äntligen ge den ett verktyg som håller hela dagen.",
                en: "Operational field service experience combined with deep AI know-how. Not to disrupt an industry — but to finally give it a tool that holds up all day.",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative py-28 px-4 sm:px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,90vw)] h-[min(400px,90vw)] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-display text-2xl md:text-3xl font-medium leading-relaxed mb-8">
              {t({ sv: "Nyfiken? Hör av dig –", en: "Curious? Get in touch —" })}<br />{t({ sv: "vi lyssnar.", en: "we’re listening." })}
            </p>

            <Link to="/kontakt" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mb-8">
              {t({ sv: "Hör av dig när det passar", en: "Reach out when it suits you" })} <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-muted-foreground">
              {t({
                sv: "Vi loggar ingenting. Vi ringer aldrig. Hör av dig när du själv vill.",
                en: "We log nothing. We never cold-call. Reach out when you want to.",
              })}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
