import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Brain, Wrench, Globe, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const values = [
  {
    icon: Users,
    title: "Erfarenhet från fältet",
    desc: "Vårt team har arbetat i fältservicebranschen. Vi förstår verkligheten — inte bara tekniken.",
  },
  {
    icon: Brain,
    title: "AI som förstärker",
    desc: "Vi bygger inte teknik som ersätter människor. Vi förstärker dem med data, mönster och prognoser.",
  },
  {
    icon: Wrench,
    title: "Byggt med kunderna",
    desc: "Traivo utvecklas tillsammans med riktiga fältserviceföretag — inte i ett labb.",
  },
  {
    icon: Globe,
    title: "Nordisk design",
    desc: "Byggd för skandinaviska villkor, regelverk och arbetskulturer. Lokalt språk, lokal logik.",
  },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Mänsklig erfarenhet,
              <br />
              <span className="text-gradient-ocean">förstärkt med AI</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Traivo är byggt av människor som levt i fältservicens vardag. Vi kombinerar 
              årtionden av branscherfarenhet med modern AI för att skapa en plattform som 
              verkligen fungerar — i fält, på kontoret och däremellan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-6 bg-section-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Vår vision</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Vi tror att framtidens fältservice inte handlar om att ersätta erfarna tekniker 
              med maskiner — utan om att ge dem verktygen att bli ännu bättre. Traivo är 
              superhjärnan som gör ett rutinerat team till en oövervinnerlig kraft.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Norden focus */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold mb-4">Varför Norden?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Skandinavisk fältservice har unika utmaningar: extremt väder, långa avstånd, 
              höga lönekostnader och krav på dokumentation. Traivo är byggt från grunden 
              för dessa villkor — inte anpassat i efterhand.
            </p>
            <Button size="lg" asChild>
              <Link to="/kontakt">
                Prata med oss <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
