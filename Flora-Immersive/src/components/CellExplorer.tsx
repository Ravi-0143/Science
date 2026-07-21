import { useState } from 'react';
import { CELL_DATA } from '../data';
import { CellData, TissueType } from '../types';
import { Check, Info, ShieldAlert } from 'lucide-react';

interface CellExplorerProps {
  dayMode: boolean;
  selectedTissue: TissueType;
  setSelectedTissue: (tissue: TissueType) => void;
}

export default function CellExplorer({
  dayMode,
  selectedTissue,
  setSelectedTissue,
}: CellExplorerProps) {
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'living' | 'dead'>('all');

  const cells = CELL_DATA[selectedTissue];
  const activeCell = cells.find((c) => c.id === activeCellId);

  // Filter cells based on selection
  const filteredCells = cells.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  // Render a beautiful stylized 2D biology diagram for each cell type!
  const renderCellSvg = (id: string) => {
    const strokeCol = dayMode ? '#374151' : '#F3F4F6';
    const accentCol = selectedTissue === 'xylem' ? '#3B82F6' : '#F59E0B';
    const subCol = selectedTissue === 'xylem' ? '#34D399' : '#C084FC';

    switch (id) {
      case 'vessel':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Cylindrical wide vessel members */}
            <rect x="25" y="10" width="50" height="140" rx="4" fill="none" stroke={strokeCol} strokeWidth="2" />
            <ellipse cx="50" cy="10" rx="25" ry="6" fill={accentCol} fillOpacity="0.15" stroke={strokeCol} strokeWidth="1.5" />
            <ellipse cx="50" cy="150" rx="25" ry="6" fill={accentCol} fillOpacity="0.15" stroke={strokeCol} strokeWidth="1.5" />
            {/* Perforation plate */}
            <ellipse cx="50" cy="80" rx="25" ry="5" fill="none" stroke={accentCol} strokeWidth="3" />
            {/* Perforation pores */}
            <line x1="40" y1="80" x2="60" y2="80" stroke={strokeCol} strokeWidth="2.5" strokeDasharray="2,3" />
            {/* Spiral wall thickening */}
            <path d="M 25 30 C 35 40, 65 20, 75 35 M 25 60 C 35 70, 65 50, 75 65 M 25 100 C 35 110, 65 90, 75 105" fill="none" stroke={accentCol} strokeWidth="2" opacity="0.6" />
          </svg>
        );
      case 'tracheid':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Narrow tapering overlapping spindle */}
            <path d="M 50 10 L 62 40 L 62 120 L 50 150 L 38 120 L 38 40 Z" fill="none" stroke={strokeCol} strokeWidth="2" />
            {/* Overlapping adjacent tracheid */}
            <path d="M 62 40 L 74 65 L 74 135 L 62 155" fill="none" stroke={strokeCol} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />
            {/* Pitted walls */}
            <circle cx="50" cy="40" r="2.5" fill="none" stroke={accentCol} strokeWidth="1.5" />
            <circle cx="50" cy="70" r="2.5" fill="none" stroke={accentCol} strokeWidth="1.5" />
            <circle cx="50" cy="100" r="2.5" fill="none" stroke={accentCol} strokeWidth="1.5" />
            <circle cx="50" cy="120" r="2.5" fill="none" stroke={accentCol} strokeWidth="1.5" />
            {/* Bordered pits lateral indicators */}
            <circle cx="38" cy="55" r="1.5" fill={accentCol} />
            <circle cx="62" cy="85" r="1.5" fill={accentCol} />
          </svg>
        );
      case 'parenchyma':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Rounded living cells stacked */}
            <rect x="30" y="15" width="40" height="40" rx="12" fill="none" stroke={strokeCol} strokeWidth="2" />
            <circle cx="50" cy="35" r="5" fill={subCol} />
            <circle cx="50" cy="35" r="1.5" fill={strokeCol} />

            <rect x="30" y="65" width="40" height="40" rx="12" fill="none" stroke={strokeCol} strokeWidth="2" />
            <circle cx="50" cy="85" r="5" fill={subCol} />
            <circle cx="50" cy="85" r="1.5" fill={strokeCol} />

            <rect x="30" y="115" width="40" height="40" rx="12" fill="none" stroke={strokeCol} strokeWidth="2" />
            {/* Cytoplasm granules */}
            <circle cx="40" cy="25" r="1" fill={subCol} />
            <circle cx="60" cy="30" r="1" fill={subCol} />
            <circle cx="42" cy="75" r="1" fill={subCol} />
            <circle cx="58" cy="95" r="1" fill={subCol} />
          </svg>
        );
      case 'fibres':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Obliterated thick cell walls */}
            <path d="M 50 10 L 60 30 L 60 130 L 50 150 L 40 130 L 40 30 Z" fill="none" stroke={strokeCol} strokeWidth="2" />
            {/* Extremely thick secondary wall shading */}
            <path d="M 50 10 L 60 30 L 60 130 L 50 150 L 40 130 L 40 30 Z" fill={dayMode ? '#E5E7EB' : '#374151'} fillOpacity="0.5" />
            {/* Tiny closed inner lumen line */}
            <line x1="50" y1="35" x2="50" y2="125" stroke={accentCol} strokeWidth="2" />
          </svg>
        );
      case 'sieve-tube':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Sieve tubes connected via plates */}
            <rect x="28" y="10" width="44" height="140" fill="none" stroke={strokeCol} strokeWidth="2" />
            <line x1="28" y1="80" x2="72" y2="80" stroke={accentCol} strokeWidth="4" />
            {/* Sieve pores */}
            <circle cx="35" cy="80" r="2" fill={dayMode ? '#FFF' : '#000'} />
            <circle cx="50" cy="80" r="2" fill={dayMode ? '#FFF' : '#000'} />
            <circle cx="65" cy="80" r="2" fill={dayMode ? '#FFF' : '#000'} />
            {/* Callose plug details */}
            <path d="M 33 60 C 40 70, 60 70, 67 60" fill="none" stroke={accentCol} strokeWidth="1.5" opacity="0.6" />
            {/* Sieve strands */}
            <line x1="40" y1="20" x2="40" y2="140" stroke={accentCol} strokeWidth="1" strokeDasharray="5,10" opacity="0.4" />
            <line x1="60" y1="20" x2="60" y2="140" stroke={accentCol} strokeWidth="1" strokeDasharray="5,10" opacity="0.4" />
          </svg>
        );
      case 'companion':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Small narrow helper cells coupled to phloem sieve */}
            <rect x="15" y="10" width="35" height="140" fill="none" stroke={strokeCol} strokeWidth="1" opacity="0.4" />
            {/* Companion Cell */}
            <rect x="50" y="20" width="35" height="120" rx="6" fill="none" stroke={strokeCol} strokeWidth="2" />
            {/* Large active nucleus */}
            <circle cx="67" cy="80" r="7" fill={subCol} />
            <circle cx="67" cy="80" r="2" fill={strokeCol} />
            {/* Plentiful mitochondria dots */}
            <ellipse cx="60" cy="45" rx="3" ry="1.5" fill={accentCol} />
            <ellipse cx="75" cy="50" rx="1.5" ry="3" fill={accentCol} />
            <ellipse cx="62" cy="115" rx="3" ry="1.5" fill={accentCol} />
            <ellipse cx="73" cy="110" rx="1.5" ry="3" fill={accentCol} />
            {/* Plasmodesmata connections */}
            <line x1="45" y1="50" x2="50" y2="50" stroke={strokeCol} strokeWidth="1.5" />
            <line x1="45" y1="80" x2="50" y2="80" stroke={strokeCol} strokeWidth="1.5" />
            <line x1="45" y1="110" x2="50" y2="110" stroke={strokeCol} strokeWidth="1.5" />
          </svg>
        );
      case 'phloem-parenchyma':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Storage parenchymal stacked cells */}
            <rect x="25" y="15" width="50" height="60" rx="10" fill="none" stroke={strokeCol} strokeWidth="2" />
            <rect x="25" y="85" width="50" height="60" rx="10" fill="none" stroke={strokeCol} strokeWidth="2" />
            {/* Starch grain inclusions */}
            <circle cx="40" cy="45" r="4" fill={accentCol} fillOpacity="0.4" />
            <circle cx="60" cy="35" r="3" fill={accentCol} fillOpacity="0.4" />
            <circle cx="50" cy="50" r="3.5" fill={accentCol} fillOpacity="0.4" />
            <circle cx="42" cy="115" r="4" fill={accentCol} fillOpacity="0.4" />
            <circle cx="58" cy="110" r="3" fill={accentCol} fillOpacity="0.4" />
          </svg>
        );
      case 'phloem-fibres':
        return (
          <svg className="w-full h-40 max-w-[200px] mx-auto overflow-visible" viewBox="0 0 100 160">
            {/* Bast fibres clustered */}
            <path d="M 50 10 L 64 30 L 64 130 L 50 150 L 36 130 L 36 30 Z" fill="none" stroke={strokeCol} strokeWidth="2" />
            <path d="M 64 25 L 78 45 L 78 125 L 64 140" fill="none" stroke={strokeCol} strokeWidth="1" strokeDasharray="2,2" />
            {/* Tough outer cortex shading */}
            <line x1="50" y1="20" x2="50" y2="140" stroke={accentCol} strokeWidth="2" strokeDasharray="4,4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper toggle for primary Xylem vs Phloem focus */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className={`p-1.5 rounded-full border flex ${
          dayMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <button
            onClick={() => { setSelectedTissue('xylem'); setActiveCellId(null); }}
            id="toggle-xylem-btn"
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              selectedTissue === 'xylem'
                ? 'bg-blue-600 text-white shadow-md'
                : dayMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            XYLEM ATLAS
          </button>
          <button
            onClick={() => { setSelectedTissue('phloem'); setActiveCellId(null); }}
            id="toggle-phloem-btn"
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              selectedTissue === 'phloem'
                ? 'bg-amber-500 text-white shadow-md'
                : dayMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            PHLOEM ATLAS
          </button>
        </div>

        {/* Local Filter Chips */}
        <div className="flex gap-2">
          {(['all', 'living', 'dead'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              id={`filter-${t}-btn`}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border tracking-wider uppercase transition-all cursor-pointer ${
                filter === t
                  ? 'bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-950 border-transparent shadow-sm'
                  : dayMode
                    ? 'border-slate-200 text-slate-500 hover:bg-slate-100'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'All Cell Types' : `${t} only`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cell Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCells.map((c) => {
          const isActive = activeCellId === c.id;
          const statusCol = c.status === 'living'
            ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20';

          const accentLine = selectedTissue === 'xylem' ? 'border-l-blue-600' : 'border-l-amber-500';

          return (
            <button
              key={c.id}
              onClick={() => setActiveCellId(isActive ? null : c.id)}
              id={`cell-card-${c.id}`}
              className={`text-left p-5 rounded-2xl border-l-4 border transition-all duration-300 flex flex-col justify-between ${accentLine} ${
                isActive
                  ? dayMode
                    ? 'bg-slate-100 border-slate-300 shadow-md translate-y-[-2px]'
                    : 'bg-slate-800 border-slate-700 shadow-xl translate-y-[-2px]'
                  : dayMode
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div className="w-full flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h4 className="text-base md:text-lg font-bold tracking-tight">{c.name}</h4>
                  <p className="text-xs opacity-60 leading-relaxed font-mono">{c.oneLiner}</p>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded border ${statusCol}`}>
                  {c.status}
                </span>
              </div>

              {/* Expand/Collapse prompt */}
              <div className="mt-4 flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase opacity-40 hover:opacity-80 transition-opacity">
                <Info className="w-3 h-3" />
                <span>{isActive ? 'Click to collapse details' : 'Click to inspect structure'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Interactive Detail Panel */}
      {activeCell && (
        <div className={`p-6 md:p-8 rounded-3xl border animate-fadeIn space-y-6 ${
          dayMode
            ? 'bg-slate-50 border-slate-200 shadow-lg'
            : 'bg-slate-950 border-slate-800 shadow-2xl text-slate-100'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeCell.status === 'living' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                PHYSIOLOGICAL BLUEPRINT &middot; {activeCell.status}
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mt-2">{activeCell.name}</h3>
              <p className="text-sm opacity-60 font-mono mt-1">{activeCell.oneLiner}</p>
            </div>
            <button
              onClick={() => setActiveCellId(null)}
              id="close-cell-explorer-btn"
              className={`px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                dayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              CLOSE Atlas ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visualizer Column */}
            <div className={`md:col-span-4 p-4 rounded-2xl border flex items-center justify-center ${
              dayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              {renderCellSvg(activeCell.id)}
            </div>

            {/* Structured Stats Table Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCell.stats.map(([label, val], idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    dayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">{label}</span>
                    <span className="text-sm font-semibold tracking-tight mt-1">{val}</span>
                  </div>
                ))}
              </div>

              {/* Descriptive details */}
              <div className="space-y-3 pt-2">
                <div>
                  <h5 className="text-xs font-mono tracking-widest uppercase opacity-50 mb-1">Cellular Anatomy &amp; Structure</h5>
                  <p className="text-sm md:text-base leading-relaxed opacity-90">{activeCell.structure}</p>
                </div>
                <div>
                  <h5 className="text-xs font-mono tracking-widest uppercase opacity-50 mb-1">Key Diagnostic Fact</h5>
                  <p className="text-sm md:text-base leading-relaxed font-medium text-emerald-500 dark:text-emerald-400">
                    {activeCell.keyFact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
