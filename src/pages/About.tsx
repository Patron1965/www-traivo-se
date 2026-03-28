import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Brain, Wrench, Globe, ArrowRight } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const values = [
  {
    icon: Users,
    title: "Erfarenhet från fältet",
    desc: "Vi har arbetat i fältservicebranschen. Vi förstår verkligheten — inte bara tekniken.",
  },
  {
    icon: Brain,
    title: "AI som förstärker",
    desc: "Vi ersätter inte människor. Vi förstärker dem med data, mönster och prognoser.",
  },
  {
    icon: Wrench,
    title: "Byggt med kunderna",
    desc: "Traivo utvecklas i nära samarbete med riktiga fältserviceföretag.",
  },
  {
    icon: Globe,
    title: "Nordisk design",
    desc: "Byggd för skandinaviska villkor, regelverk och arbetskulturer.",
  },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Om Traivo</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6 max-w-3xl"
          >
            <span className="text-gradient-ice">Mänsklig erfarenhet</span>
            <br />
            <span className="text-gradient-aurora">förstärkt med AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            Traivo kombinerar årtionden av branscherfarenhet med modern AI — 
            för att skapa en plattform som verkligen fungerar i fält.
          </motion.p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeIn} className="max-w-2xl mb-20">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">Vision</span>
            <p className="text-2xl md:text-3xl font-display font-medium leading-relaxed text-foreground/90">
              Framtidens fältservice handlar inte om att ersätta erfarna tekniker 
              med maskiner — utan om att ge dem verktygen att bli{" "}
              <span className="text-primary">ännu bättre</span>.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="glass-subtle rounded-xl p-6 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nordics */}
      <section className="py-28 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div {...fadeIn}>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
              Varför Norden?
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
              Byggd för skandinaviska
              <br />
              <span className="text-muted-foreground">villkor</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Skandinavisk fältservice har unika utmaningar: extremt väder, 
                långa avstånd, höga lönekostnader och strikta krav på dokumentation.
              </p>
              <p>
                Traivo är byggt från grunden för dessa villkor — inte anpassat i efterhand 
                från en amerikansk eller europeisk produkt. Lokalt språk, lokal logik, 
                lokala integrationer.
              </p>
            </div>
            <Button size="lg" className="mt-10 h-12 px-8 font-display font-semibold text-sm tracking-wide uppercase" asChild>
              <Link to="/kontakt">Prata med oss <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
