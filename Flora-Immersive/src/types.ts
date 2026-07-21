export type TissueType = 'xylem' | 'phloem';

export interface CellData {
  id: string;
  name: string;
  status: 'living' | 'dead';
  oneLiner: string;
  structure: string;
  keyFact: string;
  stats: [string, string][];
}

export interface StoryStep {
  id: number;
  title: string;
  subtitle: string;
  narration: string;
  focus: 'stem' | 'xylem' | 'phloem' | 'transpiration' | 'translocation' | 'comparison' | 'quiz';
  xylemVal: number;
  phloemVal: number;
  cameraZoom?: number;
  cameraRotateX?: number;
  cameraRotateY?: number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface ExamTrap {
  term: string;
  belongs: string;
  text: string;
}
