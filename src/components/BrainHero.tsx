import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import brainImage from "@/assets/brain-ai.png";
import teamImage from "@/assets/team-brain-hero.png";

const BrainHero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Glow backdrop behind brain */}
      <div className="absolute top-[-40px] w-[420px] h-[420px] rounded-full bg-glow animate-pulse-glow" />

      {/* Brain image */}
      <motion.img
        src={brainImage}
        alt="Mänsklig hjärna förstärkt med AI"
        width={300}
        height={300}
        className="relative z-10 drop-shadow-[0_0_60px_hsla(180,70%,50%,0.4)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      />

      {/* Animated connection beams from brain to team */}
      <motion.div
        className="relative z-10 w-[500px] h-[80px] -mt-4 -mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <svg className="w-full h-full" viewBox="0 0 500 80" fill="none">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="beam-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(180 70% 50%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(180 70% 50%)" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines spreading from brain center to team positions */}
          {[
            { x: 80, delay: 0 },
            { x: 170, delay: 0.1 },
            { x: 250, delay: 0.05 },
            { x: 330, delay: 0.1 },
            { x: 420, delay: 0 },
          ].map((beam, i) => (
            <g key={i}>
              <motion.line
                x1={250}
                y1={0}
                x2={beam.x}
                y2={75}
                stroke="url(#beam-grad)"
                strokeWidth="1.5"
                filter="url(#glow-filter)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1 + beam.delay + i * 0.08, duration: 0.6 }}
              />
              {/* Pulsing node at connection point */}
              <motion.circle
                cx={beam.x}
                cy={75}
                r={3}
                fill="hsl(180 70% 50% / 0.5)"
                filter="url(#glow-filter)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.8, 0.4], scale: [0, 1.2, 1] }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Team image */}
      <motion.img
        src={teamImage}
        alt="Erfaret fältserviceteam"
        width={480}
        height={280}
        className="relative z-10 drop-shadow-[0_0_30px_hsla(180,70%,50%,0.15)]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      />

      {/* Subtle label under the visual */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="relative z-10 mt-3 text-[11px] tracking-widest uppercase text-muted-foreground/60 font-display"
      >
        Erfarenhet &middot; Kompetens &middot; AI-stöd
      </motion.p>

      {/* Speech bubble – desktop */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="absolute right-[-270px] top-[20%] -translate-y-1/2 z-20 hidden lg:block"
      >
        <svg
          className="absolute left-[-60px] top-1/2 -translate-y-1/2"
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
        >
          <path
            d="M0 20 Q15 5, 30 12 T55 20"
            stroke="hsl(180 70% 50% / 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />
          <polygon points="50,16 58,20 50,24" fill="hsl(180 70% 50% / 0.4)" />
        </svg>

        <div className="w-[230px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-4 animate-border-pulse">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Det du gör här loggas inte och leder inte till säljsamtal.
              <span className="text-foreground/80 font-medium"> Du hör av dig till oss — om och när du vill.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Speech bubble – mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative z-20 mt-4 lg:hidden"
      >
        <div className="w-[280px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-3 animate-border-pulse">
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
