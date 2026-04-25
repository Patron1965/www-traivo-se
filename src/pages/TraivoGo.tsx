import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIChatLink from "@/components/AIChatLink";
import FieldVisual from "@/components/FieldVisual";
import {
  Smartphone, CheckSquare, Clock, WifiOff, ArrowRight
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const sections = [
  {
    id: "01", title: "Jobbhantering", icon: Smartphone,
    intro: "Dagens jobb, i ordning, med allt teknikern behöver. Inga papper, inga samtal till kontoret.",
    items: [
      { t: "Dagens uppdrag", d: "Tydlig lista med adresser, kundinfo och instruktioner." },
      { t: "Ett-tryck navigation", d: "GPS-navigation till nästa stopp direkt." },
      { t: "Restid per jobb", d: "Avstånd och beräknad restid synligt." },
      { t: "Akutjobb", d: "Accept/avböj brådskande uppdrag i realtid." },
    ],
  },
  {
    id: "02", title: "Rapportering", icon: CheckSquare,
    intro: "Protokoll fylls i på plats – inte i bilen efter sista jobbet.",
    items: [
      { t: "Digitala protokoll", d: "Checklistor anpassade per jobbtyp." },
      { t: "Fotodokumentation", d: "Bilder bifogas jobbet direkt." },
      { t: "Digital signatur", d: "Kunden signerar på skärmen." },
      { t: "Materiallogg", d: "Registrera förbrukat material." },
    ],
  },
  {
    id: "03", title: "Tidsrapportering", icon: Clock,
    intro: "Tid, pass och löneunderlag – utan att någon behöver räkna timmar i efterhand.",
    items: [
      { t: "In-/utcheckning", d: "Automatisk tidsstämpling." },
      { t: "Arbetspass (Snöret)", d: "Komplett tidslogg per dag." },
      { t: "Löneexport", d: "CSV-export för lönehantering." },
      { t: "AI-kontrollmallar", d: "AI föreslår steg per jobbtyp." },
    ],
  },
  {
    id: "04", title: "Offline & Kommunikation", icon: WifiOff,
    intro: "Fungerar i källaren, i skogen och på taket. Synkar när nätet kommer tillbaka.",
    items: [
      { t: "Offline-first", d: "Sparar allt lokalt, synkar vid uppkoppling." },
      { t: "Push-notiser", d: "Nya jobb och ändringar direkt." },
      { t: "Meddelanden", d: "Kommunicera utan att ringa." },
      { t: "Ruttfeedback", d: "Betygsätt och förbättra planeringen." },
    ],
  },
];

const TraivoGo = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute bottom-0 right-0 w-[min(400px,90vw)] h-[min(400px,90vw)] rounded-full bg-accent/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
                Mobil · Tekniker i fält
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-2xl"
            >
              <span className="text-gradient-ice">Traivo Go</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl leading-relaxed"
            >
              Teknikerns arbetsverktyg. Jobb, rutt, protokoll och signatur i fickan – och allt fungerar även när nätet inte gör det.
            </motion.p>
          </div>
          <div className="hidden lg:flex justify-end">
            <FieldVisual />
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {sections.map((section, si) => (
        <section
          key={section.id}
          className={`py-20 px-4 sm:px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-3 sm:gap-5 mb-6">
              <span className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-border/50 leading-none select-none">
                {section.id}
              </span>
              <div className="flex items-center gap-3 pt-2 sm:pt-3 flex-wrap">
                <section.icon className="w-5 h-5 text-accent opacity-60" />
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold">{section.title}</h2>
              </div>
            </motion.div>

            <motion.p
              {...fadeIn}
              className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            >
              {section.intro}
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.06 }}
                  className="glass-subtle rounded-xl p-5 group hover:border-accent/15 transition-all duration-300"
                >
                  <h3 className="text-sm font-semibold mb-1.5 group-hover:text-accent transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Offline highlight */}
      <section className="py-24 px-4 sm:px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-accent/[0.05] blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <WifiOff className="w-10 h-10 text-accent mx-auto mb-5 opacity-50" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Bygger inte på täckning</h2>
            <p className="text-muted-foreground leading-relaxed">
              Källaren, hisschaktet, skogsvägen utan en stapel – där ute hjälper det inte att appen "borde" fungera. Traivo Go sparar lokalt, jobbar vidare och synkar tyst när nätet kommer tillbaka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bottom */}
      <section className="py-24 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            Byggt för dem som faktiskt jobbar i fält – inte för demos i ett konferensrum.
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            Vill du se hur den skulle fungera för era tekniker?{" "}
            <AIChatLink className="text-accent hover:underline">Beskriv er verksamhet</AIChatLink>
            {" "}eller{" "}
            <Link to="/kontakt" className="text-accent hover:underline">hör av dig</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default TraivoGo;
