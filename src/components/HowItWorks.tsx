import { motion } from "framer-motion";
import { MessageSquare, Brain, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const HowItWorks = () => {
  const t = useT();
  const steps = [
    {
      icon: MessageSquare,
      title: t({ sv: "Beskriv din verksamhet", en: "Describe your operation" }),
      desc: t({
        sv: "Skriv fritt om vad ni gör. Ingen inloggning krävs.",
        en: "Write freely about what you do. No sign-in required.",
      }),
    },
    {
      icon: Brain,
      title: t({ sv: "AI analyserar", en: "AI analyzes" }),
      desc: t({
        sv: "Traivos AI matchar era behov mot plattformens kapacitet.",
        en: "Traivo's AI matches your needs against the platform's capabilities.",
      }),
    },
    {
      icon: Sparkles,
      title: t({ sv: "Få insikter", en: "Get insights" }),
      desc: t({
        sv: "Se konkret hur Traivo kan effektivisera just er verksamhet.",
        en: "See concretely how Traivo can streamline your operation.",
      }),
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-semibold text-center mb-16 text-gradient-neural"
        >
          {t({ sv: "Hur det fungerar", en: "How it works" })}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto mb-5 group-hover:glow-neural transition-shadow duration-500">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
