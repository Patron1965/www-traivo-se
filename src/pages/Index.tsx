import { motion } from "framer-motion";

import BrainHero from "@/components/BrainHero";
import AIInput from "@/components/AIInput";
import HowItWorks from "@/components/HowItWorks";
import TeamSection from "@/components/TeamSection";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      

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
          Mänsklig erfarenhet · AI-stöd
        </motion.span>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section className="flex flex-col items-center pt-8 pb-12 px-6">
          <BrainHero />




          <AIInput />
        </section>

        <TeamSection />
        <HowItWorks />

        {/* Footer */}
        <footer className="relative z-10 text-center py-12 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2026 Traivo · Mänsklig erfarenhet förstärkt med AI
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
