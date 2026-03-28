import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Route, MapPin, Smartphone, Zap,
  Calendar, CheckCircle2, WifiOff, Brain, Receipt, Users, BarChart3
} from "lucide-react";

const Index = () => {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-noise">
        {/* Ambient light */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                AI-driven fältservice · Norden
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
            >
              <span className="text-gradient-ice">Sluta</span>
              <br />
              <span className="text-gradient-ice">planera.</span>
              <br />
              <span className="text-gradient-aurora">Börja optimera.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              Traivo ersätter Excel, pappersprotokoll och telefonkaos med 
              intelligent automation för fältserviceföretag som vill växa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="h-12 px-8 font-display font-semibold text-sm tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/kontakt">
                  Boka demo <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 font-display text-sm tracking-wide uppercase text-muted-foreground hover:text-foreground border border-border hover:border-primary/30"
                asChild
              >
                <Link to="/traivo-one">Utforska plattformen</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Side accent line */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground [writing-mode:vertical-lr]">
            scroll
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="relative border-y border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "30%", sub: "Kortare körsträckor", icon: Route },
            { value: "Real-time", sub: "GPS-övervakning", icon: MapPin },
            { value: "AI", sub: "Som lär sig", icon: Zap },
            { value: "Offline", sub: "Fungerar utan nät", icon: WifiOff },
          ].map((s, i) => (
            <motion.div
              key={s.sub}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`py-10 px-4 text-center ${i < 3 ? "border-r border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : i === 2 ? "border-b md:border-b-0 border-border" : ""}`}
            >
              <s.icon className="w-5 h-5 text-primary mx-auto mb-3 opacity-60" />
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── BENTO: TWO PRODUCTS ─── */}
      <section className="py-28 px-6 relative bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
              Plattformen
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Två produkter.
              <br />
              <span className="text-muted-foreground">En superhjärna.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Traivo One */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl glass p-8 md:p-10 hover:glow-teal transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/[0.05] blur-[60px] group-hover:bg-primary/[0.1] transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Traivo One</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Webben · Planerare</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Kontrollcentret där arbetsledare schemalägger, optimerar och 
                  övervakar hela fältoperationen i realtid.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {["AI-schemaläggning", "Ruttoptimering", "Live GPS-karta", "Fakturering"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/traivo-one"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Utforska One <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Traivo Go */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl glass p-8 md:p-10 hover:glow-aurora transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-accent/[0.05] blur-[60px] group-hover:bg-accent/[0.1] transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Traivo Go</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Mobil · Tekniker</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Teknikerns digitala arbetsverktyg. Fungerar i fält — 
                  även utan uppkoppling.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {["Jobb & navigation", "Foto & signatur", "Offline-first", "Push-notiser"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1 h-1 rounded-full bg-accent" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/traivo-go"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Utforska Go <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
              Före & efter
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Varför Traivo?
            </h2>
          </motion.div>

          <div className="space-y-2">
            {[
              { before: "Planering i Excel", after: "AI-optimerade scheman med ett klick" },
              { before: "Telefonsamtal vid ändringar", after: "Realtidsuppdateringar direkt" },
              { before: "Körning kors och tvärs", after: "Ruttoptimerade dagar" },
              { before: "Pappersprotokoll", after: "Digital dokumentation med foto & signatur" },
              { before: "Kunder frågar 'när kommer ni?'", after: "Automatiskt SMS med ETA" },
              { before: "Akutjobb via telefon", after: "Närmaste tekniker med ett klick" },
              { before: "Separata system", after: "Allt i en plattform" },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 glass-subtle rounded-lg px-6 py-4"
              >
                <span className="text-sm text-muted-foreground line-through decoration-destructive/30">{row.before}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{row.after}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section className="py-28 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
              Branscher
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Byggt för nordisk
              <br />
              <span className="text-muted-foreground">fältservice</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "Avfallshantering", "Fastighetsskötsel", "Teknisk fältservice",
              "Snöröjning & markskötsel", "Miljö & Energi", "VVS & Rör",
              "El & Installation", "Hissservice", "Brandskydd",
            ].map((ind) => (
              <span
                key={ind}
                className="px-5 py-2.5 rounded-full glass text-sm font-medium text-foreground/80 hover:text-primary hover:border-primary/30 transition-colors cursor-default"
              >
                {ind}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6 overflow-hidden border-t border-border">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Redo att sluta
              <br />
              <span className="text-gradient-aurora">improvisera?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
              Boka en kostnadsfri demo och se hur Traivo kan förändra er fältservice.
            </p>
            <Button
              size="lg"
              className="h-14 px-10 font-display font-semibold text-sm tracking-wide uppercase"
              asChild
            >
              <Link to="/kontakt">
                Boka demo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
