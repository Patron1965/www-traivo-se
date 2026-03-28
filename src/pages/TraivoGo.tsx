import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smartphone, MapPin, Camera, Clock, WifiOff, Bell,
  CheckSquare, ArrowRight, Navigation, MessageSquare, Star
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const sections = [
  {
    id: "01",
    title: "Jobbhantering",
    icon: Smartphone,
    items: [
      { t: "Dagens uppdrag", d: "Tydlig lista med adresser, kundinfo och instruktioner." },
      { t: "Ett-tryck navigation", d: "GPS-navigation till nästa stopp direkt." },
      { t: "Restid per jobb", d: "Avstånd och beräknad restid synligt." },
      { t: "Akutjobb", d: "Accept/avböj brådskande uppdrag i realtid." },
    ],
  },
  {
    id: "02",
    title: "Rapportering",
    icon: CheckSquare,
    items: [
      { t: "Digitala protokoll", d: "Checklistor anpassade per jobbtyp." },
      { t: "Fotodokumentation", d: "Bilder bifogas jobbet direkt." },
      { t: "Digital signatur", d: "Kunden signerar på skärmen." },
      { t: "Materiallogg", d: "Registrera förbrukat material." },
    ],
  },
  {
    id: "03",
    title: "Tidsrapportering",
    icon: Clock,
    items: [
      { t: "In-/utcheckning", d: "Automatisk tidsstämpling." },
      { t: "Arbetspass (Snöret)", d: "Komplett tidslogg per dag." },
      { t: "Löneexport", d: "CSV-export för lönehantering." },
      { t: "AI-kontrollmallar", d: "AI föreslår steg per jobbtyp." },
    ],
  },
  {
    id: "04",
    title: "Offline & Notiser",
    icon: WifiOff,
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
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Mobilapp · Tekniker i fält
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-gradient-ice">Traivo</span>{" "}
            <span className="text-accent">Go</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-xl mb-8"
          >
            Teknikerns digitala arbetsverktyg. Ersätter pappersprotokoll 
            med en app som fungerar — även utan uppkoppling.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button
              size="lg"
              className="h-12 px-8 font-display font-semibold text-sm tracking-wide uppercase bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature sections */}
      {sections.map((section, si) => (
        <section
          key={section.id}
          className={`py-24 px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-6 mb-12">
              <span className="font-display text-6xl md:text-8xl font-bold text-border/60 leading-none select-none">
                {section.id}
              </span>
              <div className="flex items-center gap-3">
                <section.icon className="w-5 h-5 text-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-bold">{section.title}</h2>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.08 }}
                  className="glass-subtle rounded-xl p-5 hover:border-accent/20 transition-all duration-300 group"
                >
                  <h3 className="text-sm font-semibold mb-2 group-hover:text-accent transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Offline highlight */}
      <section className="py-28 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent/[0.06] blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <WifiOff className="w-12 h-12 text-accent mx-auto mb-6 opacity-60" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Offline-first
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Fungerar i skogen, i källaren och på plats utan mobiltäckning. 
              Allt sparas lokalt och synkas automatiskt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ge era tekniker
              <br />
              <span className="text-gradient-aurora">rätt verktyg</span>
            </h2>
            <p className="text-muted-foreground mb-10">
              Se hur Traivo Go förenklar vardagen i fält.
            </p>
            <Button
              size="lg"
              className="h-14 px-10 font-display font-semibold text-sm tracking-wide uppercase bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TraivoGo;
