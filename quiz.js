/**
 * CBSE Class 9 & 10 Hydrocarbon & IUPAC Practice Quiz
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the IUPAC word root for a straight-chain hydrocarbon containing 3 carbon atoms?',
    options: ['Meth-', 'Eth-', 'Prop-', 'But-'],
    correct: 2,
    explanation: '3 Carbons correspond to the word root "Prop-". (1=Meth, 2=Eth, 3=Prop, 4=But, 5=Pent, 6=Hex).'
  },
  {
    id: 2,
    question: 'What is the general molecular formula for Alkenes (hydrocarbons with one double bond)?',
    options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
    correct: 1,
    explanation: 'Alkenes have one C=C double bond and follow the general formula CₙH₂ₙ (e.g. Ethene C₂H₄).'
  },
  {
    id: 3,
    question: 'Which functional group causes a compound to end with the IUPAC suffix "-ol"?',
    options: ['Aldehyde (-CHO)', 'Carboxylic Acid (-COOH)', 'Alcohol (-OH)', 'Ketone (>C=O)'],
    correct: 2,
    explanation: 'Alcohols contain the -OH functional group, replacing the terminal "-e" of alkane with "-ol" (e.g., Ethane → Ethanol).'
  },
  {
    id: 4,
    question: 'Carbon forms exceptionally long, stable chains of atoms due to which unique atomic property?',
    options: ['High Electronegativity', 'Catenation', 'Metallic Bonding', 'Ionic Affinity'],
    correct: 1,
    explanation: 'Catenation is the unique property of carbon to form covalent bonds with other carbon atoms, creating long chains or rings.'
  },
  {
    id: 5,
    question: 'What is the correct IUPAC name for CH₃-CH₂-COOH?',
    options: ['Ethanoic acid', 'Propanoic acid', 'Propanal', 'Propanone'],
    correct: 1,
    explanation: 'Counting all carbons in the chain gives 3 carbons (Prop-) with a carboxylic acid group (-COOH), giving Propanoic acid.'
  }
];

class QuizEngine {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
  }

  getCurrentQuestion() {
    return QUIZ_QUESTIONS[this.currentIndex];
  }

  submitAnswer(optionIndex) {
    const q = this.getCurrentQuestion();
    const isCorrect = (optionIndex === q.correct);
    if (isCorrect) this.score++;
    return {
      isCorrect,
      explanation: q.explanation,
      correctIndex: q.correct
    };
  }

  nextQuestion() {
    if (this.currentIndex < QUIZ_QUESTIONS.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
  }
}
