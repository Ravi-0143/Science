import { CellData, StoryStep, QuizQuestion, ExamTrap } from './types';

export const CELL_DATA: Record<'xylem' | 'phloem', CellData[]> = {
  xylem: [
    {
      id: 'vessel',
      name: 'Vessel Elements',
      status: 'dead',
      oneLiner: 'Highly efficient, wide-diameter water conduits',
      structure: 'Short, wide cylindrical cells joined end-to-end to form long continuous tubes. Their end-walls are perforated (perforation plates) or completely dissolved, minimizing resistance.',
      keyFact: 'Unique to angiosperms (flowering plants). They represent an evolutionary leap in water transport efficiency compared to the older tracheids.',
      stats: [
        ['Cellular State', 'Dead at maturity (hollow)'],
        ['Conduction Mode', 'Mass flow under tension'],
        ['End-Walls', 'Perforated / open plates'],
        ['Wall reinforcement', 'Thick lignified rings/spirals']
      ]
    },
    {
      id: 'tracheid',
      name: 'Tracheids',
      status: 'dead',
      oneLiner: 'Primitive, narrow conduits with pitted end-walls',
      structure: 'Elongated, spindle-shaped cells with tapering ends that overlap. Water flows laterally from cell to cell through thin, non-lignified membrane regions called pits.',
      keyFact: 'The sole water-conducting cells in gymnosperms (conifers) and ferns. Their narrower diameter makes them highly resistant to cavitation (gas bubbles).',
      stats: [
        ['Cellular State', 'Dead at maturity (hollow)'],
        ['Conduction Mode', 'Lateral pit-to-pit flow'],
        ['End-Walls', 'Intact, overlapping ends'],
        ['Wall reinforcement', 'Uniformly lignified with pits']
      ]
    },
    {
      id: 'parenchyma',
      name: 'Xylem Parenchyma',
      status: 'living',
      oneLiner: 'The metabolic heart and storage of the xylem',
      structure: 'Thin-walled, non-lignified cellulosic cells distributed among the hollow conduits. They are packed with starch granules, oil droplets, and active cytoplasm.',
      keyFact: 'The ONLY living cells in xylem tissue. They facilitate short-distance lateral transport of solutes and are critical for repairing air embolisms in vessels.',
      stats: [
        ['Cellular State', 'Living, highly active'],
        ['Primary Function', 'Starch storage & lateral transport'],
        ['Cell Wall', 'Thin, primary cellulosic wall'],
        ['Organelles', 'Full complement, active nucleus']
      ]
    },
    {
      id: 'fibres',
      name: 'Xylem Fibres',
      status: 'dead',
      oneLiner: 'Ultra-dense mechanical reinforcement columns',
      structure: 'Extremely elongated cells with thick, heavily lignified secondary walls and highly reduced (obliterated) internal lumens. They have almost no conduction capability.',
      keyFact: 'They provide the mechanical strength that allows trees to grow hundreds of feet tall. Commercially, they form the primary component of wood (secondary xylem).',
      stats: [
        ['Cellular State', 'Dead at maturity'],
        ['Primary Function', 'Structural support & stiffness'],
        ['Lumen Size', 'Obliterated / closed'],
        ['Wall Thickness', 'Extremely thick & lignified']
      ]
    }
  ],
  phloem: [
    {
      id: 'sieve-tube',
      name: 'Sieve-Tube Elements',
      status: 'living',
      oneLiner: 'Living, enucleate channels for bulk sugar flow',
      structure: 'Long, tube-like cells arranged end-to-end. At maturity, they lose their nucleus, ribosomes, vacuoles, and cytoskeleton to create an unobstructed pathway for sugar sap.',
      keyFact: 'They are living cells yet lack a nucleus and ribosomes. Their end-walls are modified into sieve plates with large pores, allowing cytoplasmic continuity.',
      stats: [
        ['Cellular State', 'Living, enucleate (no nucleus)'],
        ['Conduction Mode', 'Pressure-driven bulk flow'],
        ['End-Walls', 'Porous sieve plates'],
        ['Dependency', 'Requires Companion Cells']
      ]
    },
    {
      id: 'companion',
      name: 'Companion Cells',
      status: 'living',
      oneLiner: 'The metabolic engine powering phloem loading',
      structure: 'Highly specialized, nucleated parenchyma cells tightly coupled to sieve-tube elements via dense plasmodesmata. Packed with mitochondria and transport proteins.',
      keyFact: 'They perform all necessary transcription, translation, and energy generation for the sieve-tube elements, actively loading sucrose against concentration gradients.',
      stats: [
        ['Cellular State', 'Living, hyper-metabolic'],
        ['Primary Function', 'Active sucrose loading & unloading'],
        ['Mitochondria', 'Abundant (high ATP production)'],
        ['Connection', 'Dense plasmodesmatal channels']
      ]
    },
    {
      id: 'phloem-parenchyma',
      name: 'Phloem Parenchyma',
      status: 'living',
      oneLiner: 'Nutrient reservoir and lateral pathway cells',
      structure: 'Elongated, living cells with thin cellulosic walls. They store starch, resins, latex, and organic compounds, and facilitate slow lateral nutrient diffusion.',
      keyFact: 'Absent in monocots, but highly developed in dicots where they play a crucial role in maintaining tissue hydration and pressure flow balances.',
      stats: [
        ['Cellular State', 'Living'],
        ['Primary Function', 'Storage (starch, latex, resins)'],
        ['Cell Wall', 'Thin primary cellulose'],
        ['Occurrence', 'Dicotyledonous stems only']
      ]
    },
    {
      id: 'phloem-fibres',
      name: 'Phloem Fibres (Bast)',
      status: 'dead',
      oneLiner: 'Protective, tough outer mechanical columns',
      structure: 'Highly elongated, thick-walled sclerenchymatous cells. They occur in clusters or bands on the outer periphery of the phloem, providing flexural strength.',
      keyFact: 'The only dead component of phloem. Commercially known as "bast fibres," they are harvested from plants like flax, hemp, and jute to weave high-strength ropes and linens.',
      stats: [
        ['Cellular State', 'Dead at maturity'],
        ['Primary Function', 'Protection & flexural support'],
        ['Commercial Use', 'Linen, hemp, jute cords'],
        ['Cell Wall', 'Extremely thick, lignified']
      ]
    }
  ]
};

export const STORY_STEPS: StoryStep[] = [
  {
    id: 1,
    title: 'The Vascular Stem Architecture',
    subtitle: 'Vascular Bundle Cross-Section',
    narration: 'Step inside the stem of an angiosperm. The vascular bundles are arranged in a ring, acting as the structural columns and primary transport highways of the plant. Inside each bundle, Xylem occupies the inner region, Phloem occupies the outer region, and they are divided by the active, dividing cell layer of the Vascular Cambium.',
    focus: 'stem',
    xylemVal: 40,
    phloemVal: 40,
    cameraZoom: 1.0,
    cameraRotateX: 15,
    cameraRotateY: -20
  },
  {
    id: 2,
    title: 'Xylem: The Water Highway',
    subtitle: 'Hollow, Dead Conduits Operating Under Tension',
    narration: 'Deep within the stem lies the Xylem. To transport massive volumes of water efficiently, its conducting cells (Vessel Elements and Tracheids) undergo programmed cell death, completely digesting their protoplasts to form hollow, continuous microscopic pipelines. Their thick secondary walls are reinforced with rings or spirals of rigid lignin.',
    focus: 'xylem',
    xylemVal: 55,
    phloemVal: 20,
    cameraZoom: 1.6,
    cameraRotateX: 30,
    cameraRotateY: -35
  },
  {
    id: 3,
    title: 'The Transpiration Pull Engine',
    subtitle: 'Cohesion-Tension Theory in Action',
    narration: 'How does water reach the top of a 300-foot tree without a pump? It is pulled by the sun! Water vapor evaporates out of leaf stomata (Transpiration), creating negative pressure. Thanks to the hydrogen bonding of water, water molecules exhibit strong Cohesion (sticking together) and Adhesion (sticking to hydrophilic xylem walls), forming an unbroken liquid column that is sucked upward.',
    focus: 'transpiration',
    xylemVal: 85,
    phloemVal: 15,
    cameraZoom: 1.8,
    cameraRotateX: 0,
    cameraRotateY: 0
  },
  {
    id: 4,
    title: 'Phloem: The Nutrient Pipeline',
    subtitle: 'Living, Highly Regulated Bidirectional Translocation',
    narration: 'On the outer side of the bundle, the Phloem distributes the rich organic sugars made during photosynthesis. Unlike xylem, phloem elements (Sieve-Tube Elements) must remain alive to maintain active plasma membranes, allowing them to regulate osmotic pressure. Sieve-tube elements lose their nuclei to open the pathway, relying completely on metabolic support from adjacent Companion Cells.',
    focus: 'phloem',
    xylemVal: 20,
    phloemVal: 60,
    cameraZoom: 1.5,
    cameraRotateX: -20,
    cameraRotateY: 25
  },
  {
    id: 5,
    title: 'The Pressure-Flow Engine',
    subtitle: 'Active Loading at Source, Unloading at Sink',
    narration: 'Sugar transport operates via the Munch Pressure-Flow Hypothesis. Companion cells actively load sucrose into the sieve-tubes at the Source (leaves). This hypertonic state draws water from the nearby xylem by osmosis, building extremely high turgor pressure. This high pressure pushes the sugary sap down toward the Sink (roots or developing fruits), where sugar is unloaded, and water recycles back.',
    focus: 'translocation',
    xylemVal: 35,
    phloemVal: 90,
    cameraZoom: 1.7,
    cameraRotateX: -10,
    cameraRotateY: 10
  },
  {
    id: 6,
    title: 'Dual Hydraulic Integration',
    subtitle: 'Observe the Coupled Ecosystem in Real-Time',
    narration: 'Xylem and Phloem are not separate; they form a coupled hydraulic system. High transpiration speeds up xylem conduction, which in turn feeds water into the Phloem source for sugar loading. Adjust the sliders to see how environmental variables, stomatal openings, and leaf photosynthetic rates influence the dual highway flow speeds.',
    focus: 'comparison',
    xylemVal: 60,
    phloemVal: 60,
    cameraZoom: 1.2,
    cameraRotateX: 5,
    cameraRotateY: -5
  },
  {
    id: 7,
    title: 'Diagnostic Knowledge Challenge',
    subtitle: 'Test Your Mastery',
    narration: 'You have completed the visual exploration of plant vascular anatomy! Let us put your understanding to the test. Our interactive diagnostic board challenges your ability to spot classic examiner traps, structural differences, and the physical principles governing xylem and phloem transport.',
    focus: 'quiz',
    xylemVal: 30,
    phloemVal: 30,
    cameraZoom: 1.0,
    cameraRotateX: 0,
    cameraRotateY: 0
  }
];

export const EXAM_TRAPS: ExamTrap[] = [
  {
    term: 'Companion Cells',
    belongs: 'Phloem Sieve Support',
    text: 'A favorite "xylem component" distractor in MCQs because of their support role. They are highly active, living, nucleated cells that belong strictly to the Phloem, doing the metabolic work for enucleate sieve tubes.'
  },
  {
    term: 'Collenchyma',
    belongs: 'Simple Permanent Tissue',
    text: 'Frequently placed in vascular tissue options. Collenchyma is a simple tissue (one cell type) providing flexible support to young stems and petioles. Xylem is a complex tissue, and its support role is filled by Xylem Fibres.'
  },
  {
    term: 'Tracheids vs Vessels',
    belongs: 'Gymnosperm vs Angiosperm',
    text: 'Examiners often claim vessels conduct in conifers. Gymnosperms lack vessel elements entirely; they rely solely on Tracheids for water transport. Angiosperms have BOTH vessels (highly efficient) and tracheids.'
  },
  {
    term: 'Living vs Dead Conduction',
    belongs: 'Thermodynamics of Flow',
    text: 'Students often assume living cells conduct better. Xylem conduits MUST be dead; living cytoplasm would offer too much friction and resistance to water being sucked up under negative pressures of up to -30 atm!'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: 'Which xylem cell type remains fully alive at functional maturity to carry out storage and lateral transport?',
    options: ['Tracheids', 'Vessel Elements', 'Xylem Parenchyma', 'Xylem Fibres'],
    correct: 2,
    explain: 'Xylem Parenchyma is the ONLY living component of xylem tissue. They have thin, cellulosic cell walls and active cytoplasm, helping in lateral conduction of water and food storage, whereas the others undergo programmed cell death to function.'
  },
  {
    q: 'Why are xylem vessel elements and tracheids dead at functional maturity?',
    options: [
      'To allow them to divide actively for secondary growth',
      'To eliminate cell contents, creating a hollow, low-friction pipeline for water',
      'Because they lack water and dehydrated themselves',
      'To prevent the plant from wasting sugars on respiration'
    ],
    correct: 1,
    explain: 'If water conducting tubes contained living cytoplasm, organelles, and membranes, the friction would make it physically impossible to pull water columns hundreds of feet. programmed cell death creates hollow, low-resistance micro-pipes.'
  },
  {
    q: 'Which cellular component of Phloem is living, yet completely lacks a nucleus, ribosomes, and vacuoles at maturity?',
    options: ['Companion Cells', 'Phloem Parenchyma', 'Phloem Fibres', 'Sieve-Tube Elements'],
    correct: 3,
    explain: 'Sieve-Tube Elements are living conducting channels but lose their nucleus, vacuoles, and ribosomes to keep the path clear for bulk flow of sucrose. They are metabolically sustained by adjacent Companion Cells.'
  },
  {
    q: 'What is the primary driving physical force for Xylem transport, according to the Cohesion-Tension theory?',
    options: [
      'Positive hydrostatic pressure from roots (Root Pressure)',
      'Active transport of water molecules by vessel ATPases',
      'Negative tension pulled from the leaves due to transpiration of water vapor',
      'Capillary action alone in narrow vessels'
    ],
    correct: 2,
    explain: 'Transpiration (evaporation of water from leaf stomata) creates an immense negative tension (pull) that sucks water up. Cohesion keeps the water column from breaking, and adhesion keeps it stuck to xylem walls.'
  },
  {
    q: 'How does the Phloem build the high turgor pressure needed to push sugar sap from source to sink?',
    options: [
      'By pumping water actively through sieve plates using ATP',
      'By active loading of sucrose into sieve tubes, which draws water from xylem via osmosis',
      'By mechanical contraction of phloem fibers (bast)',
      'By atmospheric pressure pushing down on the leaves'
    ],
    correct: 1,
    explain: 'Active loading of sucrose into sieve-tubes at the source lowers the water potential. Water from the adjacent xylem immediately rushes in by osmosis, building a high hydrostatic (turgor) pressure that drives the bulk flow to the sink.'
  },
  {
    q: 'Gymnosperms (non-flowering conifers) differ fundamentally in their vascular anatomy because they lack which two cell types?',
    options: [
      'Vessels (xylem) and Companion Cells (phloem)',
      'Tracheids (xylem) and Sieve-Tube Elements (phloem)',
      'Xylem Parenchyma and Phloem Parenchyma',
      'Xylem Fibres and Phloem Fibres'
    ],
    correct: 0,
    explain: 'Gymnosperms are evolutionarily older and simpler: they lack wide vessel elements (relying solely on tracheids) and lack companion cells (relying instead on albuminous cells to support their simpler sieve cells).'
  }
];
