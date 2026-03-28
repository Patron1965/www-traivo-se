import { useEffect, useRef } from "react";

const QUESTIONS = [
  "Hur minskar vi restider?",
  "Rätt tekniker på rätt jobb?",
  "Kan vi förutse fel innan de händer?",
  "Hur optimerar vi rutter?",
  "Vad kostar stillestånd egentligen?",
  "Hur ökar vi first-time-fix?",
  "Kan AI planera schemat?",
  "Vilka delar behövs imorgon?",
  "Hur mäter vi kundnöjdhet?",
  "Vem har rätt kompetens?",
  "Hur förkortar vi svarstider?",
  "Kan vi digitalisera checklistan?",
  "Vad säger datan om våra stopp?",
  "Hur delar vi kunskap i teamet?",
  "Behöver vi fler tekniker?",
  "Vilka jobb kan automatiseras?",
  "Hur hanterar vi akutärenden?",
  "Kan sensorer varna i förväg?",
];

interface FloatingQuestion {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  timer: number;
  timerMax: number;
  fontSize: number;
}

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const items: FloatingQuestion[] = [];
    const count = 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      const fontSize = 11 + Math.random() * 4;
      items.push({
        text: shuffled[i % shuffled.length],
        x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: 0,
        targetAlpha: 0,
        fadeSpeed: 0.003 + Math.random() * 0.005,
        timer: Math.random() * 400,
        timerMax: 250 + Math.random() * 300,
        fontSize,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const q of items) {
        q.x += q.vx;
        q.y += q.vy;

        // Bounce off edges with padding
        if (q.x < 40 || q.x > canvas.width - 40) q.vx *= -1;
        if (q.y < 30 || q.y > canvas.height - 30) q.vy *= -1;

        // Timer controls fade in/out cycle
        q.timer += 1;
        if (q.timer > q.timerMax) {
          q.timer = 0;
          if (q.targetAlpha > 0) {
            q.targetAlpha = 0;
          } else {
            q.targetAlpha = 0.12 + Math.random() * 0.18;
            // Pick a new question
            q.text = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
          }
        }

        // Smooth fade
        if (q.alpha < q.targetAlpha) {
          q.alpha = Math.min(q.alpha + q.fadeSpeed, q.targetAlpha);
        } else if (q.alpha > q.targetAlpha) {
          q.alpha = Math.max(q.alpha - q.fadeSpeed, q.targetAlpha);
        }

        if (q.alpha > 0.005) {
          ctx.save();
          ctx.globalAlpha = q.alpha;
          ctx.font = `300 ${q.fontSize}px 'Space Grotesk', system-ui, sans-serif`;
          ctx.fillStyle = "hsl(175, 65%, 60%)";
          ctx.textAlign = "center";
          ctx.fillText(q.text, q.x, q.y);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default NeuralBackground;
