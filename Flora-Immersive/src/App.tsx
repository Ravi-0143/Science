import { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Info,
  ShieldAlert,
  Flame,
  Globe,
  Clock
} from 'lucide-react';
import { STORY_STEPS, EXAM_TRAPS } from './data';
import { TissueType } from './types';
import VascularVisualizer from './components/VascularVisualizer';
import CellExplorer from './components/CellExplorer';
import DiagnosticQuiz from './components/DiagnosticQuiz';

export default function App() {
  const [stepIdx, setStepIdx] = useState(0);
  const [xylemVal, setXylemVal] = useState(55);
  const [phloemVal, setPhloemVal] = useState(55);
  const [selectedTissue, setSelectedTissue] = useState<TissueType>('xylem');
  const [dayMode, setDayMode] = useState(true);
  const [isGuided, setIsGuided] = useState(true);
  const [localTimeStr, setLocalTimeStr] = useState('');

  const currentStep = STORY_STEPS[stepIdx];

  // Sync sliders and tissue choices based on the active guided story step
  useEffect(() => {
    if (isGuided) {
      setXylemVal(currentStep.xylemVal);
      setPhloemVal(currentStep.phloemVal);

      if (['xylem', 'transpiration'].includes(currentStep.focus)) {
        setSelectedTissue('xylem');
      } else if (['phloem', 'translocation'].includes(currentStep.focus)) {
        setSelectedTissue('phloem');
      }
    }
  }, [stepIdx, isGuided, currentStep]);

  // Update live clock and listen for parent window theme sync
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleParentMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        if (event.data.theme === 'light') {
          setDayMode(true);
        } else if (event.data.theme === 'dark') {
          setDayMode(false);
        }
      }
    };
    window.addEventListener('message', handleParentMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleParentMessage);
    };
  }, []);

  const handleNextStep = () => {
    if (stepIdx < STORY_STEPS.length - 1) {
      setStepIdx((idx) => idx + 1);
    }
  };

  const handlePrevStep = () => {
    if (stepIdx > 0) {
      setStepIdx((idx) => idx - 1);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ease-in-out ${
      dayMode
        ? 'bg-[#FAF8F3] text-slate-900' // archival parchment paper
        : 'bg-[#0B0F19] text-slate-100' // deep space dark
    }`}>
      
      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Primary Container Wrap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* PREMIUM HEADER */}
        <header className={`flex flex-col md:flex-row md:items-center justify-between pb-6 border-b ${
          dayMode ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              <span>Plant Vascular System &middot; Cinematic Atlas</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight mt-1">
              Vascular Tissue <em className="italic font-serif text-emerald-600 dark:text-emerald-400 font-normal">Atlas</em>
            </h1>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0 items-center font-mono text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>STABILITY: 60FPS</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>LIVE CLOCK: {localTimeStr || '00:00:00'}</span>
            </div>
          </div>
        </header>

        {/* NARRATOR / GUIDED STORY PANEL */}
        <section className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          dayMode
            ? 'bg-white border-slate-200 shadow-xl'
            : 'bg-slate-900 border-slate-800 shadow-2xl text-white'
        }`} id="narration-panel">
          
          {/* Subtle Ambient Background Lighting for narration */}
          <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-75">
                  {isGuided ? `Guided Tour: Milestone ${currentStep.id} of ${STORY_STEPS.length}` : 'Free Exploration Mode'}
                </span>
              </div>

              {/* Mode Switcher Toggle */}
              <button
                onClick={() => setIsGuided(!isGuided)}
                id="toggle-mode-btn"
                className={`text-xs font-mono font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  isGuided
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : dayMode
                      ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isGuided ? 'Switch to Free Play' : 'Resume Guided Tour'}
              </button>
            </div>

            {/* Narration Body with dynamic slide-in animations */}
            <div className="space-y-2 animate-fadeIn key={stepIdx}">
              <span className="text-xs font-mono opacity-50 tracking-wider block">
                {currentStep.subtitle}
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed opacity-80 max-w-4xl pt-1">
                {currentStep.narration}
              </p>
            </div>

            {/* Step navigation actions (only shown when in guided mode) */}
            {isGuided && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/60">
                {/* Progress Indicators dots */}
                <div className="flex gap-1.5">
                  {STORY_STEPS.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => setStepIdx(idx)}
                      id={`narrative-dot-${step.id}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        stepIdx === idx
                          ? 'bg-emerald-500 scale-125'
                          : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                      title={step.title}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrevStep}
                    disabled={stepIdx === 0}
                    id="prev-step-btn"
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      stepIdx === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : dayMode
                          ? 'bg-white border-slate-200 hover:bg-slate-100'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={stepIdx === STORY_STEPS.length - 1}
                    id="next-step-btn"
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      stepIdx === STORY_STEPS.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:opacity-90 active:scale-95'
                    }`}
                  >
                    <span>Next Milestone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TWO-COLUMN CORE VISUAL STAGE */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Canvas 3D & particle visualizer (takes 5 cols) */}
          <section className="lg:col-span-5 h-full">
            <VascularVisualizer
              currentStep={currentStep}
              xylemVal={xylemVal}
              phylemVal={phloemVal}
              setXylemVal={setXylemVal}
              setPhylemVal={setPhloemVal}
              dayMode={dayMode}
              setDayMode={setDayMode}
            />
          </section>

          {/* Right Column: Dynamic explorer, warns, or quiz (takes 7 cols) */}
          <section className="lg:col-span-7 space-y-8">
            
            {/* Condition: if we are at step 7 (focus: 'quiz'), directly render quiz */}
            {currentStep.focus === 'quiz' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>ACTIVE COURSE WORK: INTEGRATED PRACTICE BOARD</span>
                </div>
                <DiagnosticQuiz dayMode={dayMode} />
              </div>
            ) : (
              /* Otherwise, show CellExplorer + Pitfalls Board */
              <div className="space-y-8">
                
                {/* 1. Interactive Cell Explorer Deck */}
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>PHYSIOLOGICAL CELL INVENTORY</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">SELECT TO INSPECT ANATOMY</span>
                  </div>
                  
                  <CellExplorer
                    dayMode={dayMode}
                    selectedTissue={selectedTissue}
                    setSelectedTissue={setSelectedTissue}
                  />
                </div>

                {/* 2. Sclerenchyma and Examiner Traps Warning Deck */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>EXAMINER TRAPS &middot; CRUCIAL BIOLOGY PITFALLS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {EXAM_TRAPS.map((trap, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                          dayMode
                            ? 'bg-rose-50/50 border-rose-100 shadow-sm text-slate-800'
                            : 'bg-rose-500/5 border-rose-500/10 shadow-lg text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-rose-500 font-mono text-[10px] tracking-widest uppercase mb-1">
                          <Flame className="w-3 h-3" />
                          <span>{trap.belongs}</span>
                        </div>
                        <h4 className="text-sm font-bold tracking-tight text-rose-700 dark:text-rose-400 mb-1">{trap.term}</h4>
                        <p className="text-xs leading-relaxed opacity-80">{trap.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </section>
        </main>

        {/* BOTTOM FOOTER CREDITS */}
        <footer className={`flex flex-col sm:flex-row justify-between items-center pt-6 border-t font-mono text-[10px] opacity-50 ${
          dayMode ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
        }`}>
          <span>VASCULAR ANATOMY ATLAS &middot; INTUITIVE SCIENTIFIC INTERACTION</span>
          <span>COMPLEX PERMANENT TISSUE SUITE &middot; 2026</span>
        </footer>

      </div>
    </div>
  );
}
