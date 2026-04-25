import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import brainImage from "@/assets/brain-ai.png";
import teamImage from "@/assets/team-brain-hero.png";

const BrainHero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-full overflow-hidden">
      {/* Headline above team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 max-w-2xl px-2"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
          <span className="text-gradient-synapse">Rutinerat team</span>
          {" "}blir{" "}
          <span className="text-gradient-neural">superhjärna</span>
          <br />
          <span className="text-foreground/80 text-xl sm:text-2xl md:text-3xl">
            — erfarenhet förstärkt med AI
          </span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mt-4">
          Traivo kombinerar årtionden av fältserviceerfarenhet med intelligent AI.
          Vi bygger inte teknik som ersätter människor — vi förstärker dem.
          Beskriv din verksamhet nedan och se vad det kan betyda för dig.
        </p>
      </motion.div>

      {/* Team image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center mb-2 w-full max-w-[624px] px-4"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] tracking-widest uppercase text-muted-foreground/60 font-display mb-3"
        >
          Grunden &middot; Erfarna tekniker i fält
        </motion.p>
        <motion.img
          src={teamImage}
          alt="Erfaret fältserviceteam"
          width={624}
          height={364}
          className="relative z-10 w-full h-auto drop-shadow-[0_0_30px_hsla(180,70%,50%,0.15)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Connection beams going UP from team to brain */}
      <motion.div
        className="relative z-10 w-full max-w-[500px] h-[80px] -mt-2 -mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <svg className="w-full h-full" viewBox="0 0 500 80" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="beam-grad-up" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(180 70% 50%)" stopOpacity="0.5" />
              <stop offset="50%" stopColor="hsl(180 70% 60%)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(280 70% 60%)" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lines from team (bottom) converging UP to brain center */}
          {[
            { x: 80, delay: 0 },
            { x: 170, delay: 0.1 },
            { x: 250, delay: 0.05 },
            { x: 330, delay: 0.1 },
            { x: 420, delay: 0 },
          ].map((beam, i) => (
            <g key={i}>
              <motion.line
                x1={beam.x}
                y1={5}
                x2={250}
                y2={75}
                stroke="url(#beam-grad-up)"
                strokeWidth="1.5"
                filter="url(#glow-filter)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1 + beam.delay + i * 0.08, duration: 0.6 }}
              />
              <motion.circle
                cx={beam.x}
                cy={5}
                r={3}
                fill="hsl(180 70% 50% / 0.5)"
                filter="url(#glow-filter)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.8, 0.4], scale: [0, 1.2, 1] }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
              />
              <motion.circle
                cx={250}
                cy={75}
                r={2}
                fill="hsl(180 70% 70% / 0.8)"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [beam.x, 250],
                  cy: [5, 75],
                  opacity: [0.8, 0],
                }}
                transition={{
                  delay: 2 + i * 0.3,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 4 + i * 0.5,
                }}
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Glow backdrop behind brain — constrained to viewport */}
      <div className="absolute bottom-[80px] w-[min(420px,90vw)] h-[min(420px,90vw)] rounded-full bg-glow animate-pulse-glow" />

      {/* Brain — the RESULT of collective experience + AI */}
      <motion.div className="relative z-10 flex flex-col items-center w-full">
        <motion.img
          src={brainImage}
          alt="Superhjärna — teamets erfarenhet förstärkt med AI"
          width={280}
          height={280}
          className="relative z-10 w-[60vw] max-w-[280px] h-auto drop-shadow-[0_0_60px_hsla(180,70%,50%,0.4)]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="relative z-10 mt-2 text-[11px] tracking-widest uppercase text-muted-foreground/60 font-display text-center px-4"
        >
          Erfarenhet + AI = Superhjärna
        </motion.p>
      </motion.div>

      {/* Speech bubble – desktop */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="absolute right-[-270px] bottom-[30%] z-20 hidden lg:block"
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
        className="relative z-20 mt-4 lg:hidden w-full max-w-[280px] mx-auto px-2"
      >
        <div className="w-full rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-3 animate-border-pulse">
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
