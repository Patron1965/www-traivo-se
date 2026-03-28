import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import brainImage from "@/assets/brain-hero.png";

const BrainHero = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-glow animate-pulse-glow" />
      
      {/* Brain image */}
      <motion.img
        src={brainImage}
        alt="Traivo AI-hjärna"
        width={420}
        height={420}
        className="relative z-10 drop-shadow-[0_0_40px_hsla(180,70%,50%,0.3)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      />

      {/* Speech bubble with arrow */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="absolute right-[-260px] top-[40%] -translate-y-1/2 z-20 hidden lg:block"
      >
        {/* Arrow (SVG curved line from brain to bubble) */}
        <svg
          className="absolute left-[-60px] top-1/2 -translate-y-1/2"
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
        >
          <path
            d="M0 20 Q15 5, 30 12 T55 20"
            stroke="hsl(180 70% 50% / 0.5)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />
          <polygon
            points="50,16 58,20 50,24"
            fill="hsl(180 70% 50% / 0.5)"
          />
        </svg>

        <div className="w-[240px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-4 shadow-lg shadow-primary/5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Det du gör här loggas inte och leder inte till säljsamtal. 
              <span className="text-foreground/80 font-medium"> Du hör av dig till oss — om och när du vill.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile version below brain */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20 lg:hidden"
      >
        <div className="w-[280px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-3 shadow-lg shadow-primary/5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Det du gör här loggas inte och leder inte till säljsamtal. 
              <span className="text-foreground/80 font-medium"> Du hör av dig till oss — om och när du vill.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrainHero;
