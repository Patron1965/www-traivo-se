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
    const count = 4;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);

    const readToken = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const primaryColor = `hsl(${readToken("--primary")})`;
    const glowColor = `hsl(${readToken("--neural-glow")})`;

    for (let i = 0; i < count; i++) {
      const fontSize = 12 + Math.random() * 4;
      items.push({
        text: shuffled[i % shuffled.length],
        x: Math.random() * canvas.width * 0.1 + 10,
        y: Math.random() * 350 + 80,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.04,
        alpha: 0,
        targetAlpha: 0,
        fadeSpeed: 0.0006 + Math.random() * 0.0008,
        timer: i * 250,
        timerMax: 900 + Math.random() * 600,
        fontSize,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const q of items) {
        q.x += q.vx;
        q.y += q.vy;

        if (q.x < 10 || q.x > canvas.width * 0.13) q.vx *= -1;
        if (q.y < 80 || q.y > 430) q.vy *= -1;

        q.timer += 1;
        if (q.timer > q.timerMax) {
          q.timer = 0;
          if (q.targetAlpha > 0) {
            q.targetAlpha = 0;
          } else {
            q.targetAlpha = 0.35 + Math.random() * 0.15;
            q.text = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
          }
        }

        if (q.alpha < q.targetAlpha) {
          q.alpha = Math.min(q.alpha + q.fadeSpeed, q.targetAlpha);
        } else if (q.alpha > q.targetAlpha) {
          q.alpha = Math.max(q.alpha - q.fadeSpeed, q.targetAlpha);
        }

        if (q.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = q.alpha;
          ctx.font = `500 ${q.fontSize}px 'Space Grotesk', system-ui, sans-serif`;
          ctx.textAlign = "left";
          ctx.shadowBlur = 18;
          ctx.shadowColor = glowColor;
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 0.75;
          ctx.strokeText(q.text, q.x, q.y);
          ctx.fillStyle = glowColor;
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
      style={{ zIndex: 20 }}
    />
  );
};

export default NeuralBackground;
