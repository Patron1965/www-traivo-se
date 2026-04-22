import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIInput from "@/components/AIInput";
import {
  Calendar, Smartphone, Route, MapPin, Brain, WifiOff,
  ArrowRight, Users, FileText, CreditCard, X, ChevronDown,
  Recycle, Wrench, Building2, Truck, HeartPulse
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const features = [
  { icon: Calendar, title: "Schemaläggning", desc: "Automatisk planering som tar hänsyn till kompetens, geografi och kapacitet." },
  { icon: Route, title: "Smartare rutter", desc: "Ruttoptimering baserad på riktiga vägar – inte fågelvägen." },
  { icon: Smartphone, title: "Mobilapp offline", desc: "Fungerar utan nät, med protokoll och foto. Synkar automatiskt." },
  { icon: MapPin, title: "GPS & akuttilldelning", desc: "Realtidskarta med positioner. Akutjobb till närmaste tekniker." },
  { icon: Brain, title: "AI-analys", desc: "Hittar avvikelser innan de blir problem. Prediktivt underhåll." },
  { icon: CreditCard, title: "Fakturering & kundportal", desc: "Faktura, bokning och besökshistorik – i samma system." },
];

const industries = [
  {
    id: "miljo",
    icon: Recycle,
    title: "Miljö, återvinning & avfall",
    desc: "Geofencing av tömningsställen, ruttoptimering för tunga fordon, snabb hantering av budningar och extratömningar.",
    examples: [
      "Automatisk omplanering när en kund bokar extratömning kl 09:14",
      "Geofence runt varje tömningsställe – verifierar att jobbet faktiskt utfördes",
      "Ruttcache för tunga fordon som tar hänsyn till broar, vikt och vändzoner",
    ],
  },
  {
    id: "teknisk-service",
    icon: Wrench,
    title: "Tekniska installationer & service",
    desc: "Vitvaror, fiber, hiss, kyla. Koppling mellan avtal, artiklar och teknikerns kompetens – med snabb dokumentation i fält.",
    examples: [
      "Matchar jobbet mot tekniker med rätt certifikat och reservdelar i bilen",
      "Protokoll med foto signeras i appen – även utan täckning i källaren",
      "Avtalskoppling: rätt artikel, rätt pris, rätt garanti automatiskt på fakturan",
    ],
  },
  {
    id: "fastighet",
    icon: Building2,
    title: "Fastighet & facility management",
    desc: "Yttre skötsel, trappstädning, snöröjning, rondering. Årsplanering, QR-kvitto på utfört arbete och prediktivt underhåll.",
    examples: [
      "Årshjul för rondering – systemet skapar veckans jobb automatiskt",
      "QR-kod vid varje objekt: skanna för att kvittera utfört arbete",
      "Snöröjning aktiveras av väderdata – jobb pushas innan kunden hinner ringa",
    ],
  },
  {
    id: "transport",
    icon: Truck,
    title: "Transport & last mile",
    desc: "Distribution där rutter ändras dagligen. What-if-analys, automatisk omplanering och kundportal med live-leveransstatus.",
    examples: [
      "What-if: \"Vad händer om bil 4 går sönder kl 11?\" – ny plan på sekunder",
      "Live-spårning för slutkund med ETA – färre samtal till kundtjänst",
      "Optimering tar hänsyn till lossningstid, inte bara körsträcka",
    ],
  },
  {
    id: "hemtjanst",
    icon: HeartPulse,
    title: "Hemtjänst & mobil vård",
    desc: "Hårda tidsfönster och slotpreferenser per brukare. Heatmaps som visar belastning per område innan personalen blir överkörd.",
    examples: [
      "Slotpreferenser per brukare respekteras – samma personal så långt det går",
      "Heatmap visar överbelastade områden innan schemat publiceras",
      "Akut sjukfrånvaro: AI föreslår omfördelning som håller tidsfönstren",
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
            {expanded ? "Dölj exempel" : "Visa alla exempel"}
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

const Index = () => {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-noise px-6 py-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
            <span className="font-medium uppercase tracking-[0.25em] text-muted-foreground text-sm">
              Plattform för fältservice · Norden
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5"
          >
            <span className="text-gradient-ice">Dina tekniker kör.</span>{" "}
            <span className="text-gradient-ice">Dina planerare släcker bränder.</span>
            <br />
            <span className="text-gradient-ice">Dina kunder väntar.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10"
          >
            Vi byggde det vi själva saknade i 15 år i fält.
          </motion.p>

          <div id="ai-chat" className="w-full max-w-2xl mx-auto">
            <AIInput />
          </div>
        </div>
      </section>

      {/* ─── PROBLEM RECOGNITION ─── */}
      <section className="py-24 md:py-28 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Låter det bekant?
            </span>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
              Du har redan system – kanske flera. Ett för planering, ett för fakturering, ett för kundkontakt. Problemet är att inget av dem täcker hela kedjan. Så du hoppar mellan plattformar, dubbelregistrerar och tappar tid varje dag.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Resultatet: information faller mellan stolarna, tekniker väntar på besked, och du lägger kvällarna på att rätta till det som systemen borde ha löst.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section className="py-24 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-10"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Branscher
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">
              Byggt för verksamheter med många stopp
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Plannix passar bäst där geografi, tid och kompetens måste pussla ihop varje dag. Här är branscherna där vi gör störst skillnad.
            </p>
          </motion.div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveIndustry(null)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                activeIndustry === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Alla branscher
            </button>
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isActive = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(isActive ? null : ind.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {ind.title}
                </button>
              );
            {activeIndustry !== null && (
              <button
                onClick={() => setActiveIndustry(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                aria-label="Återställ filter"
              >
                <X className="w-3.5 h-3.5" />
                Återställ
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

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-foreground/80 max-w-2xl leading-relaxed"
          >
            Det som gör skillnad är kombinationen geografi och AI. Klustervalidering hindrar att jobb säljs där de inte kan utföras lönsamt. Ruttoptimering med riktiga vägdata sparar bränsle och timmar varje dag. Och beslutsstödet förklarar <em>varför</em> AI:n placerade jobbet just där – så planeraren behåller kontrollen.
          </motion.p>
        </div>
      </section>

      {/* ─── CREDIBILITY ─── */}
      <section className="py-24 md:py-28 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Vår bakgrund
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
              Byggt av folk som suttit i bilen
            </h2>
            <div className="space-y-5 text-sm md:text-base text-foreground/85 leading-[1.8]">
              <p>
                De flesta planeringssystem är byggda av folk som aldrig suttit i en servicebil en hel dag.
              </p>
              <p>
                Vi har. Vi har planerat rutter för hand i Excel. Ringt tekniker mitt i lunchen för att flytta om jobb. Försökt fakturera från handskrivna protokoll. Vi vet exakt var det brister – för vi har levt med bristerna.
              </p>
              <p>
                Vi startade Plannix för att vi själva var frustrerade. Vi visste att AI kunde lösa planering, optimering och analys på ett sätt som inte var möjligt för fem år sedan. Men vi visste också att tekniken är värdelös om den inte förstår verkligheten: att en tekniker inte kan vara på två ställen samtidigt, att akutjobb inte väntar, och att en app som kräver 4G i ett garage är meningslös.
              </p>
              <p>
                Plannix är inte byggt för demos. Det är byggt för måndag morgon kl 06:30.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TARGET AUDIENCE POPUP ─── */}
      <section className="py-16 md:py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-primary/20 text-sm font-medium text-foreground/90 hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-300">
                  <Users className="w-4 h-4 text-primary/60" />
                  Vem är Plannix till för?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold">
                    Vem är Plannix till för?
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>
                    Plannix är till för dig som driver serviceverksamhet där tekniker åker ut till kund –
                    VVS, el, kyla, hissar, fastighet, IT, säkerhet, vitvaror, maskinservice eller sophantering.
                  </p>
                  <p>
                    Om dina tekniker kör rutter och du schemalägger uppdrag varje dag, är Plannix byggt för dig.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* ─── SOLUTION / FEATURES ─── */}
      <section className="py-24 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-8"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Plattformen
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">
              En plattform. Hela kedjan.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Ett system som håller hela dagen – från första jobbet kl 07:00 till sista fakturan kl 17:00. Byggt på operativ erfarenhet, inte på demos.
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

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-foreground/80 font-medium max-w-2xl leading-relaxed"
          >
            Slut på att jaga information mellan fem system. Planering, rutt, jobb, protokoll, faktura, analys – samma plattform, samma data, samma sanning.
          </motion.p>
        </div>
      </section>

      {/* ─── CLOSING STATEMENT ─── */}
      <section className="py-20 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-4">
              Det är ingen magi. Det är 15 års vardag, översatt till mjukvara.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Operativ fältserviceerfarenhet kombinerad med djup AI-kompetens. Inte för att revolutionera en bransch – utan för att äntligen ge den ett verktyg som håller hela dagen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="relative py-28 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-2xl md:text-3xl font-medium leading-relaxed mb-8">
              Nyfiken? Hör av dig –<br /> vi lyssnar.
            </p>

            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mb-8"
            >
              Hör av dig när det passar <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-muted-foreground">
              Vi loggar ingenting. Vi ringer aldrig. Hör av dig när du själv vill.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
