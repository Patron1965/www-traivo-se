import { motion } from "framer-motion";
import NeuralBackground from "@/components/NeuralBackground";
import BrainHero from "@/components/BrainHero";
import AIInput from "@/components/AIInput";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-xl tracking-tight"
        >
          <span className="text-gradient-neural">Traivo</span>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground"
        >
          AI-driven fältservice
        </motion.span>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section className="flex flex-col items-center pt-8 pb-12 px-6">
          <BrainHero />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 mb-10 max-w-xl"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
              Vad kan <span className="text-gradient-neural">Traivo</span> göra
              <br />
              för <span className="text-gradient-synapse">din</span> verksamhet?
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Beskriv din verksamhet nedan. Vår AI analyserar och visar hur
              Traivos plattform kan effektivisera just ditt företag.
            </p>
          </motion.div>

          <AIInput />
        </section>

        <HowItWorks />

        {/* Footer */}
        <footer className="relative z-10 text-center py-12 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2026 Traivo · AI-driven fältserviceplattform för Norden
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
