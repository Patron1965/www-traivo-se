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
  { icon: Users, title: "Erfarenhet från fältet", desc: "Vi har arbetat i fältservicebranschen. Vi förstår verkligheten." },
  { icon: Brain, title: "AI som förstärker", desc: "Vi ersätter inte människor. Vi förstärker dem med data och mönster." },
  { icon: Wrench, title: "Byggt med kunderna", desc: "Utvecklat i samarbete med riktiga fältserviceföretag." },
  { icon: Globe, title: "Nordisk design", desc: "Byggt för skandinaviska villkor, regelverk och arbetskultur." },
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
            <span className="text-gradient-ice">Mänsklig erfarenhet</span>
            <br />
            <span className="text-gradient-aurora">förstärkt med AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl leading-relaxed"
          >
            Traivo kombinerar branscherfarenhet med modern AI — för en plattform 
            som fungerar i fält, på kontoret och däremellan.
          </motion.p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn} className="max-w-2xl mb-20">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">Vision</span>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/85">
              Framtidens fältservice handlar inte om att ersätta erfarna tekniker 
              med maskiner — utan om att ge dem verktygen att bli{" "}
              <span className="text-primary">ännu bättre</span>.
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
                Extremt väder, långa avstånd, höga lönekostnader och strikta dokumentationskrav. 
                Traivo är byggt från grunden för dessa utmaningar.
              </p>
              <p>
                Lokalt språk, lokala integrationer, lokal logik. 
                Inte anpassat i efterhand.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="text-muted-foreground text-sm">
            Nyfiken?{" "}
            <Link to="/" className="text-primary hover:underline">Beskriv er verksamhet</Link>
            {" "}och se vad Traivo kan göra för er.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default About;
