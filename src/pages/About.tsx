import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Brain, Wrench, Globe } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const values = [
  { icon: Users, title: "Erfarenhet från fältet", desc: "Vi har planerat rutter, kört bilen och fakturerat på kvällen. Vi vet var det skaver." },
  { icon: Brain, title: "AI som förstärker", desc: "AI tar det repetitiva. Människan tar besluten. Inte tvärtom." },
  { icon: Wrench, title: "Byggt med kunderna", desc: "Utvecklat sida vid sida med riktiga fältserviceföretag, inte i en pitchdeck." },
  { icon: Globe, title: "Nordiska villkor", desc: "Långa avstånd, hård vinter, lokala regelverk – grundförutsättningar, inte tilläggsfunktioner." },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">Om Traivo</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-3xl"
          >
            <span className="text-gradient-ice">Vi har suttit</span>
            <br />
            <span className="text-gradient-aurora">i samma bil som du.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl leading-relaxed"
          >
            Vi byggde Traivo för att vi själva var trötta på att hoppa mellan system. Idag är det en plattform för dem som driver fältservice på riktigt – i bilen, på kontoret och däremellan.
          </motion.p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn} className="max-w-2xl mb-20">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">Vision</span>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/85">
              Framtidens fältservice handlar inte om att ersätta erfarna tekniker med maskiner. Det handlar om att ge dem verktygen att slippa det som aldrig borde vara{" "}
              <span className="text-primary">deras problem</span>.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeIn}
                transition={{ delay: i * 0.08 }}
                className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <v.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{v.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nordics */}
      <section className="py-28 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div {...fadeIn}>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              Varför Norden?
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Byggd för skandinaviska villkor
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Hård vinter, långa avstånd mellan jobben, höga lönekostnader och dokumentationskrav som inte tål genvägar. Det är inte specialfall för oss – det är utgångsläget.
              </p>
              <p>
                Svenska, norska, finska, danska. Lokala integrationer. Logik som förstår att en plogbil inte fungerar som en hisstekniker. Byggt in från början, inte tillagt i efterhand.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom */}
      <section className="py-24 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            Vi byggde Traivo för folk som oss själva. Förhoppningsvis känner du igen dig.
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">Beskriv er verksamhet</Link>
            {" "}eller{" "}
            <Link to="/kontakt" className="text-primary hover:underline">hör av dig</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default About;
