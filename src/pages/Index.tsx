import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIInput from "@/components/AIInput";
import {
  Calendar, Smartphone, Route, MapPin, Brain, WifiOff,
  ArrowRight, Users
} from "lucide-react";

const Index = () => {
  return (
    <>
      {/* ─── HERO: AI-centered ─── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-noise px-6">
        {/* Ambient */}
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
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              AI-plattform för fältservice · Norden
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5"
          >
            <span className="text-gradient-ice">Smartare fältservice.</span>
            <br />
            <span className="text-muted-foreground text-2xl sm:text-3xl md:text-4xl font-medium">
              Beskriv era utmaningar — vi visar lösningen.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10"
          >
            Traivo är byggt av ett team med djup erfarenhet av verkligheten i fält — 
            inte av folk som bara sett den på avstånd. Nu med AI:s nya möjligheter 
            kan vi äntligen lösa det som inte gick förut. Berätta om era utmaningar.
          </motion.p>

          <AIInput />

        </div>
      </section>

      {/* ─── WHAT IS TRAIVO (subtle) ─── */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-20"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Plattformen
            </span>
            <p className="font-display text-2xl md:text-3xl font-medium leading-relaxed text-foreground/90">
              Traivo ersätter Excel-planering, pappersprotokoll och separata system med 
              <span className="text-primary"> en sammanhållen plattform</span> för fältservice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* One */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl glass p-8 hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Traivo One</h3>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Webb · Planerare</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Schemaläggning, ruttoptimering, GPS-karta, fakturering och AI-analys — 
                för den som planerar och leder.
              </p>
              <Link
                to="/traivo-one"
                className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:gap-3 transition-all uppercase tracking-wider"
              >
                Läs mer <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Go */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl glass p-8 hover:border-accent/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Traivo Go</h3>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Mobil · Tekniker</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Jobb, navigation, protokoll, foton och signatur — 
                fungerar offline.
              </p>
              <Link
                to="/traivo-go"
                className="inline-flex items-center gap-2 text-xs font-medium text-accent hover:gap-3 transition-all uppercase tracking-wider"
              >
                Läs mer <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section className="py-28 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Kapacitet
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Vad plattformen hanterar
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Calendar, title: "AI-schemaläggning", desc: "Kompetens, geografi, väder och kapacitet i varje beslut." },
              { icon: Route, title: "Ruttoptimering", desc: "Klusterbaserad planering. Riktiga vägavstånd, inte fågelvägen." },
              { icon: MapPin, title: "GPS i realtid", desc: "Live-karta med förarpositioner. Akutjobb till närmaste tekniker." },
              { icon: Brain, title: "AI-analys", desc: "Avvikelsedetektering, prediktivt underhåll, ROI-rapportering." },
              { icon: WifiOff, title: "Offline-first", desc: "Mobilappen fungerar utan nät. Synkar automatiskt." },
              { icon: Users, title: "Kundportal", desc: "Bokning, chatt och besökshistorik för era kunder." },
            ].map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300"
              >
                <cap.icon className="w-4 h-4 text-primary mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-sm font-semibold mb-1.5">{cap.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM: Soft invitation ─── */}
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
            <p className="font-display text-2xl md:text-3xl font-medium leading-relaxed mb-6">
              Vi loggar ingenting. Vi ringer aldrig.
              <br />
              <span className="text-muted-foreground">Hör av dig när du själv vill.</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
              Utforska plattformen i lugn och ro. När du känner att det finns något vi kan hjälpa er med — 
              kontakta oss på dina villkor.
            </p>
            <Link 
              to="/kontakt" 
              className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:gap-3 transition-all uppercase tracking-wider"
            >
              Kontakta oss när du är redo <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
