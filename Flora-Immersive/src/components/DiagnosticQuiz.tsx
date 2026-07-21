import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data';

interface DiagnosticQuizProps {
  dayMode: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export default function DiagnosticQuiz({ dayMode }: DiagnosticQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  const q = QUIZ_QUESTIONS[currentIdx];

  // Particle explosion loop for celebration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerCelebration = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ['#10B981', '#34D399', '#60A5FA', '#FBBF24', '#F472B6'];
    const count = 40;
    const list: Particle[] = [];

    // Burst particles from the middle of the canvas
    const startX = canvas.width / 2;
    const startY = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      list.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slightly upwards
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        alpha: 1.0,
      });
    }

    particlesRef.current = list;
  };

  const handleOptionClick = (optIdx: number) => {
    if (isAnswered) return;

    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === q.correct) {
      setScore((s) => s + 1);
      triggerCelebration();
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  // Achievement Badge details
  const getAchievementTier = () => {
    const ratio = score / QUIZ_QUESTIONS.length;
    if (ratio === 1) return { title: 'Vascular Mastermind', color: 'text-amber-400 bg-amber-500/10 border-amber-400', desc: 'Flawless score! You bypassed every distractor and master the physical transport mechanisms completely.' };
    if (ratio >= 0.6) return { title: 'Plant Physiologist', color: 'text-slate-200 bg-slate-500/10 border-slate-300', desc: 'Splendid job! You possess a robust understanding of complex plant tissues.' };
    return { title: 'Junior Botanist', color: 'text-amber-700 bg-amber-700/10 border-amber-600', desc: 'Keep learning! Study the diagnostic panels and give it another pass.' };
  };

  const tier = getAchievementTier();

  return (
    <div className={`p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 ${
      dayMode
        ? 'bg-white border-slate-200 shadow-xl'
        : 'bg-slate-900 border-slate-800 shadow-2xl text-white'
    }`} id="diagnostic-quiz-section">
      
      {/* Absolute Confetti Particle Canvas overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30 w-full h-full" />

      {!isFinished ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full ${
              dayMode ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-mono font-semibold opacity-80">
              Current Score: {score} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${dayMode ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-lg md:text-xl font-medium tracking-tight leading-snug">
            {q.q}
          </h3>

          {/* Choice Options */}
          <div className="grid gap-3 pt-2">
            {q.options.map((opt, oIdx) => {
              let btnStyle = dayMode
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-200';

              if (isAnswered) {
                if (oIdx === q.correct) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-medium';
                } else if (selectedOpt === oIdx) {
                  btnStyle = 'bg-red-500/10 border-red-500 text-red-500';
                } else {
                  btnStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleOptionClick(oIdx)}
                  id={`quiz-option-${oIdx}`}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border text-sm md:text-base transition-all duration-200 flex justify-between items-center ${btnStyle} ${
                    !isAnswered ? 'hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer' : ''
                  }`}
                >
                  <span>{opt}</span>
                  {isAnswered && oIdx === q.correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-3" />
                  )}
                  {isAnswered && selectedOpt === oIdx && oIdx !== q.correct && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-3" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Diagnostic Explanatory Text Panel */}
          {isAnswered && (
            <div className={`p-5 rounded-2xl border transition-all duration-300 animate-fadeIn ${
              dayMode
                ? 'bg-slate-50 border-slate-100 text-slate-600 text-sm'
                : 'bg-slate-950/80 border-slate-800/50 text-slate-300 text-sm'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${
                  selectedOpt === q.correct ? 'text-emerald-500' : 'text-amber-500'
                }`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    {selectedOpt === q.correct ? 'Correct Diagnosis!' : 'Misdiagnosed.'}
                  </p>
                  <p className="leading-relaxed">{q.explain}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                id="next-quiz-btn"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white hover:opacity-90 active:scale-95 transition-all font-semibold text-sm cursor-pointer"
              >
                <span>{currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Challenge' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Finished Results Screen */
        <div className="text-center py-8 space-y-6 animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
            <Award className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight">Challenge Completed!</h3>
            <p className="text-sm opacity-60">You scored {score} out of {QUIZ_QUESTIONS.length} on plant vascular anatomy.</p>
          </div>

          {/* Big Score Board */}
          <div className="inline-block px-8 py-6 rounded-3xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-5xl font-mono font-bold text-emerald-400">{score}</span>
            <span className="text-2xl font-mono text-slate-500"> / {QUIZ_QUESTIONS.length}</span>
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mt-2">DIAGNOSTIC ACCURACY</div>
          </div>

          {/* Achievement Badge Banner */}
          <div className={`max-w-md mx-auto p-5 rounded-2xl border ${tier.color}`}>
            <p className="text-xs font-mono uppercase tracking-widest mb-1 opacity-70">UNLOCKED TIER</p>
            <h4 className="text-lg font-bold tracking-tight mb-2">{tier.title}</h4>
            <p className="text-xs leading-relaxed opacity-90">{tier.desc}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={resetQuiz}
              id="retry-quiz-btn"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                dayMode
                  ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
