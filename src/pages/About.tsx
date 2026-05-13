import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Brain, Wrench, Globe } from "lucide-react";
import AIChatLink from "@/components/AIChatLink";
import AboutVisual from "@/components/AboutVisual";
import { useT } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  const t = useT();

  const values = [
    { icon: Users,  title: t({ sv: "Erfarenhet från fältet", en: "Experience from the field" }), desc: t({ sv: "Vi har planerat rutter, kört bilen och fakturerat på kvällen. Vi vet var det skaver.", en: "We’ve planned routes, driven the van and invoiced at night. We know where it chafes." }) },
    { icon: Brain,  title: t({ sv: "AI som förstärker", en: "AI that augments" }),               desc: t({ sv: "AI tar det repetitiva. Människan tar besluten. Inte tvärtom.", en: "AI handles the repetitive. People make the decisions. Not the other way around." }) },
    { icon: Wrench, title: t({ sv: "Byggt med kunderna", en: "Built with customers" }),          desc: t({ sv: "Utvecklat sida vid sida med riktiga fältserviceföretag, inte i en pitchdeck.", en: "Developed side by side with real field service companies, not in a pitch deck." }) },
    { icon: Globe,  title: t({ sv: "Nordiska villkor", en: "Nordic conditions" }),               desc: t({ sv: "Långa avstånd, hård vinter, lokala regelverk – grundförutsättningar, inte tilläggsfunktioner.", en: "Long distances, hard winters, local regulations — baseline assumptions, not add-ons." }) },
  ];

  return (
    <>
      <SEO
        path="/om-oss"
        title={t({ sv: "Om oss – Traivo", en: "About us – Traivo" })}
        description={t({ sv: "Traivo byggs av människor med erfarenhet från fältet. AI som förstärker, byggt med kunder och anpassat för nordiska villkor.", en: "Traivo is built by people with field experience. AI that augments, built with customers and adapted for Nordic conditions." })}
      />
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute top-0 left-1/3 w-[min(400px,90vw)] h-[min(400px,90vw)] rounded-full bg-primary/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                {t({ sv: "Om Traivo", en: "About Traivo" })}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-2xl"
            >
              <span className="text-gradient-ice">{t({ sv: "Vi byggde det", en: "We built what" })}</span>
              <br />
              <span className="text-gradient-aurora">{t({ sv: "vi själva sökte efter.", en: "we were looking for ourselves." })}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-xl leading-relaxed">
              {t({
                sv: "Vi byggde Traivo för att vi själva var trötta på att hoppa mellan system. Idag är det en plattform för dem som driver fältservice på riktigt – i bilen, på kontoret och däremellan.",
                en: "We built Traivo because we were tired of jumping between systems ourselves. Today it’s a platform for those who actually run field service — in the van, in the office and in between.",
              })}
            </motion.p>
          </div>
          <div className="hidden lg:flex justify-end">
            <AboutVisual />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn} className="max-w-2xl mb-20">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Vision", en: "Vision" })}
            </span>
            <p className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/85">
              {t({
                sv: "Framtidens fältservice handlar inte om att ersätta erfarna tekniker med maskiner. Det handlar om att ge dem verktygen att slippa det som aldrig borde vara",
                en: "The future of field service isn’t about replacing experienced technicians with machines. It’s about giving them the tools to avoid what should never have been",
              })}{" "}
              <span className="text-primary">{t({ sv: "deras problem", en: "their problem" })}</span>.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeIn} transition={{ delay: i * 0.08 }} className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300">
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
      <section className="py-28 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div {...fadeIn}>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
              {t({ sv: "Varför Norden?", en: "Why the Nordics?" })}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              {t({ sv: "Byggd för skandinaviska villkor", en: "Built for Scandinavian conditions" })}
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>{t({
                sv: "Hård vinter, långa avstånd mellan jobben, höga lönekostnader och dokumentationskrav som inte tål genvägar. Det är inte specialfall för oss – det är utgångsläget.",
                en: "Hard winters, long distances between jobs, high labor costs and documentation requirements that don’t tolerate shortcuts. For us, those aren’t edge cases — they’re the baseline.",
              })}</p>
              <p>{t({
                sv: "Svenska, norska, finska, danska. Lokala integrationer. Logik som förstår att en plogbil inte fungerar som en hisstekniker. Byggt in från början, inte tillagt i efterhand.",
                en: "Swedish, Norwegian, Finnish, Danish. Local integrations. Logic that understands a plow truck doesn’t work like an elevator technician. Built in from the start, not bolted on later.",
              })}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom */}
      <section className="py-24 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            {t({ sv: "Vi byggde Traivo för folk som oss själva. Förhoppningsvis känner du igen dig.", en: "We built Traivo for people like us. Hopefully you recognize yourself." })}
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            <AIChatLink className="text-primary hover:underline">{t({ sv: "Beskriv er verksamhet", en: "Describe your business" })}</AIChatLink>
            {" "}{t({ sv: "eller", en: "or" })}{" "}
            <Link to="/kontakt" className="text-primary hover:underline">{t({ sv: "hör av dig", en: "get in touch" })}</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default About;
