import { motion } from "framer-motion";
import { Users, Brain, Wrench, TrendingUp } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const TeamSection = () => {
  const t = useT();
  const values = [
    {
      icon: Users,
      title: t({ sv: "Erfaret team", en: "Experienced team" }),
      desc: t({
        sv: "Vårt team kommer från fältservicebranschen. Vi förstår verkligheten — inte bara tekniken.",
        en: "Our team comes from the field service industry. We understand the reality — not just the tech.",
      }),
    },
    {
      icon: Brain,
      title: t({ sv: "Mänsklig intelligens först", en: "Human intelligence first" }),
      desc: t({
        sv: "AI ersätter inte era beslut. Den förstärker dem med data, mönster och prognoser.",
        en: "AI doesn't replace your decisions. It amplifies them with data, patterns and forecasts.",
      }),
    },
    {
      icon: Wrench,
      title: t({ sv: "Byggt i fält", en: "Built in the field" }),
      desc: t({
        sv: "Traivo är utvecklat tillsammans med riktiga fältserviceföretag — inte i ett labb.",
        en: "Traivo is developed together with real field service companies — not in a lab.",
      }),
    },
    {
      icon: TrendingUp,
      title: t({ sv: "AI som lyfter teamet", en: "AI that lifts the team" }),
      desc: t({
        sv: "Smart schemaläggning, ruttoptimering och anomalidetektering — så era medarbetare kan fokusera på det som räknas.",
        en: "Smart scheduling, route optimization and anomaly detection — so your people can focus on what matters.",
      }),
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            <span className="text-gradient-synapse">
              {t({ sv: "Erfarenhet", en: "Experience" })}
            </span>{" "}
            {t({ sv: "möter", en: "meets" })}{" "}
            <span className="text-gradient-neural">
              {t({ sv: "intelligens", en: "intelligence" })}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t({
              sv: "Vi tror inte på teknik utan förståelse. Traivo är byggt av människor som levt i fältservicens vardag.",
              en: "We don't believe in tech without understanding. Traivo is built by people who have lived field service every day.",
            })}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 hover:glow-neural transition-shadow duration-500 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {v.title}
                  </h3>
                  <p className="text-base text-foreground/85 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
