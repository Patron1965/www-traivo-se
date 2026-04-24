import { motion } from "framer-motion";
import { MessageSquare, Brain, Sparkles } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Beskriv din verksamhet",
    desc: "Skriv fritt om vad ni gör. Ingen inloggning krävs.",
  },
  {
    icon: Brain,
    title: "AI analyserar",
    desc: "Traivos AI matchar era behov mot plattformens kapacitet.",
  },
  {
    icon: Sparkles,
    title: "Få insikter",
    desc: "Se konkret hur Traivo kan effektivisera just er verksamhet.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-semibold text-center mb-16 text-gradient-neural"
        >
          Hur det fungerar
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
