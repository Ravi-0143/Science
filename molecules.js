/**
 * Hydrocarbon & Organic Compound 3D Library Data
 * CBSE Class 9 & 10 "Carbon and its Compounds"
 */

const ATOM_TYPES = {
  C: { name: 'Carbon', color: 0x3b4252, radius: 0.55, valency: 4, label: 'C' },
  H: { name: 'Hydrogen', color: 0xe5e9f0, radius: 0.32, valency: 1, label: 'H' },
  O: { name: 'Oxygen', color: 0xbf616a, radius: 0.48, valency: 2, label: 'O' },
  Cl: { name: 'Chlorine', color: 0xa3be8c, radius: 0.52, valency: 1, label: 'Cl' },
  Br: { name: 'Bromine', color: 0xd08770, radius: 0.58, valency: 1, label: 'Br' }
};

const MOLECULE_DATABASE = [
  // ALKANES
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    category: 'alkane',
    wordRoot: 'Meth-',
    suffix1: '-ane',
    suffix2: 'None',
    prefix: 'None',
    mass: 16,
    description: 'Simplest alkane with tetrahedral geometry (109.5° bond angle). Main component of Natural Gas & CNG.',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'H', pos: [0, 0.95, 0] },
      { elem: 'H', pos: [0.89, -0.32, 0] },
      { elem: 'H', pos: [-0.45, -0.32, 0.77] },
      { elem: 'H', pos: [-0.45, -0.32, -0.77] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 0, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 }
    ]
  },
  {
    id: 'ethane',
    name: 'Ethane',
    formula: 'C₂H₆',
    category: 'alkane',
    wordRoot: 'Eth-',
    suffix1: '-ane',
    suffix2: 'None',
    prefix: 'None',
    mass: 30,
    description: 'Saturated 2-carbon alkane with single C-C bond (catenation).',
    atoms: [
      { elem: 'C', pos: [-0.75, 0, 0] },
      { elem: 'C', pos: [0.75, 0, 0] },
      { elem: 'H', pos: [-1.2, 0.9, 0] },
      { elem: 'H', pos: [-1.2, -0.45, 0.8] },
      { elem: 'H', pos: [-1.2, -0.45, -0.8] },
      { elem: 'H', pos: [1.2, -0.9, 0] },
      { elem: 'H', pos: [1.2, 0.45, 0.8] },
      { elem: 'H', pos: [1.2, 0.45, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 0, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 },
      { from: 1, to: 5, type: 1 },
      { from: 1, to: 6, type: 1 },
      { from: 1, to: 7, type: 1 }
    ]
  },
  {
    id: 'propane',
    name: 'Propane',
    formula: 'C₃H₈',
    category: 'alkane',
    wordRoot: 'Prop-',
    suffix1: '-ane',
    suffix2: 'None',
    prefix: 'None',
    mass: 44,
    description: '3-carbon saturated alkane. Major fuel component in LPG cylinders.',
    atoms: [
      { elem: 'C', pos: [-1.4, -0.2, 0] },
      { elem: 'C', pos: [0, 0.4, 0] },
      { elem: 'C', pos: [1.4, -0.2, 0] },
      { elem: 'H', pos: [-1.4, -1.2, 0] },
      { elem: 'H', pos: [-1.9, 0.2, 0.8] },
      { elem: 'H', pos: [-1.9, 0.2, -0.8] },
      { elem: 'H', pos: [0, 1.4, 0] },
      { elem: 'H', pos: [0, 0.4, 1.0] },
      { elem: 'H', pos: [1.4, -1.2, 0] },
      { elem: 'H', pos: [1.9, 0.2, 0.8] },
      { elem: 'H', pos: [1.9, 0.2, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 1, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 },
      { from: 0, to: 5, type: 1 },
      { from: 1, to: 6, type: 1 },
      { from: 1, to: 7, type: 1 },
      { from: 2, to: 8, type: 1 },
      { from: 2, to: 9, type: 1 },
      { from: 2, to: 10, type: 1 }
    ]
  },
  {
    id: 'butane',
    name: 'Butane',
    formula: 'C₄H₁₀',
    category: 'alkane',
    wordRoot: 'But-',
    suffix1: '-ane',
    suffix2: 'None',
    prefix: 'None',
    mass: 58,
    description: '4-carbon alkane. Exhibits structural isomerism (n-butane and isobutane).',
    atoms: [
      { elem: 'C', pos: [-2.1, -0.3, 0] },
      { elem: 'C', pos: [-0.7, 0.3, 0] },
      { elem: 'C', pos: [0.7, -0.3, 0] },
      { elem: 'C', pos: [2.1, 0.3, 0] },
      { elem: 'H', pos: [-2.1, -1.3, 0] },
      { elem: 'H', pos: [-2.6, 0.1, 0.8] },
      { elem: 'H', pos: [-2.6, 0.1, -0.8] },
      { elem: 'H', pos: [-0.7, 1.3, 0] },
      { elem: 'H', pos: [-0.7, 0.3, 1.0] },
      { elem: 'H', pos: [0.7, -1.3, 0] },
      { elem: 'H', pos: [0.7, -0.3, -1.0] },
      { elem: 'H', pos: [2.1, 1.3, 0] },
      { elem: 'H', pos: [2.6, -0.1, 0.8] },
      { elem: 'H', pos: [2.6, -0.1, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 1, to: 2, type: 1 },
      { from: 2, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 },
      { from: 0, to: 5, type: 1 },
      { from: 0, to: 6, type: 1 },
      { from: 1, to: 7, type: 1 },
      { from: 1, to: 8, type: 1 },
      { from: 2, to: 9, type: 1 },
      { from: 2, to: 10, type: 1 },
      { from: 3, to: 11, type: 1 },
      { from: 3, to: 12, type: 1 },
      { from: 3, to: 13, type: 1 }
    ]
  },

  // ALKENES
  {
    id: 'ethene',
    name: 'Ethene (Ethylene)',
    formula: 'C₂H₄',
    category: 'alkene',
    wordRoot: 'Eth-',
    suffix1: '-ene',
    suffix2: 'None',
    prefix: 'None',
    mass: 28,
    description: 'Unsaturated hydrocarbon with one C=C double bond (trigonal planar geometry, 120°).',
    atoms: [
      { elem: 'C', pos: [-0.67, 0, 0] },
      { elem: 'C', pos: [0.67, 0, 0] },
      { elem: 'H', pos: [-1.25, 0.9, 0] },
      { elem: 'H', pos: [-1.25, -0.9, 0] },
      { elem: 'H', pos: [1.25, 0.9, 0] },
      { elem: 'H', pos: [1.25, -0.9, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: 2 }, // Double bond!
      { from: 0, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 1, to: 4, type: 1 },
      { from: 1, to: 5, type: 1 }
    ]
  },
  {
    id: 'propene',
    name: 'Propene',
    formula: 'C₃H₆',
    category: 'alkene',
    wordRoot: 'Prop-',
    suffix1: '-ene',
    suffix2: 'None',
    prefix: 'None',
    mass: 42,
    description: '3-carbon alkene with one double bond between C1 and C2.',
    atoms: [
      { elem: 'C', pos: [-1.2, -0.3, 0] },
      { elem: 'C', pos: [0, 0.3, 0] },
      { elem: 'C', pos: [1.3, -0.2, 0] },
      { elem: 'H', pos: [-1.7, 0.6, 0] },
      { elem: 'H', pos: [-1.7, -1.2, 0] },
      { elem: 'H', pos: [0, 1.3, 0] },
      { elem: 'H', pos: [1.3, -1.2, 0] },
      { elem: 'H', pos: [1.8, 0.2, 0.8] },
      { elem: 'H', pos: [1.8, 0.2, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 2 }, // C=C double bond
      { from: 1, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 },
      { from: 1, to: 5, type: 1 },
      { from: 2, to: 6, type: 1 },
      { from: 2, to: 7, type: 1 },
      { from: 2, to: 8, type: 1 }
    ]
  },

  // ALKYNES
  {
    id: 'ethyne',
    name: 'Ethyne (Acetylene)',
    formula: 'C₂H₂',
    category: 'alkyne',
    wordRoot: 'Eth-',
    suffix1: '-yne',
    suffix2: 'None',
    prefix: 'None',
    mass: 26,
    description: 'Unsaturated hydrocarbon with C≡C triple bond (linear 180° geometry). Used in oxy-acetylene welding.',
    atoms: [
      { elem: 'C', pos: [-0.6, 0, 0] },
      { elem: 'C', pos: [0.6, 0, 0] },
      { elem: 'H', pos: [-1.65, 0, 0] },
      { elem: 'H', pos: [1.65, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: 3 }, // Triple bond!
      { from: 0, to: 2, type: 1 },
      { from: 1, to: 3, type: 1 }
    ]
  },

  // FUNCTIONAL GROUPS (Class 10 Extension)
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    category: 'functional',
    wordRoot: 'Eth-',
    suffix1: '-an',
    suffix2: '-ol',
    prefix: 'None',
    mass: 46,
    description: 'Alcohol functional group (-OH). Active ingredient in alcoholic beverages and tincture iodine.',
    atoms: [
      { elem: 'C', pos: [-1.0, 0, 0] },
      { elem: 'C', pos: [0.4, 0, 0] },
      { elem: 'O', pos: [1.1, 1.0, 0] },
      { elem: 'H', pos: [2.0, 0.9, 0] },
      { elem: 'H', pos: [-1.4, 0.9, 0] },
      { elem: 'H', pos: [-1.4, -0.45, 0.8] },
      { elem: 'H', pos: [-1.4, -0.45, -0.8] },
      { elem: 'H', pos: [0.7, -0.5, 0.8] },
      { elem: 'H', pos: [0.7, -0.5, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 1, to: 2, type: 1 },
      { from: 2, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 },
      { from: 0, to: 5, type: 1 },
      { from: 0, to: 6, type: 1 },
      { from: 1, to: 7, type: 1 },
      { from: 1, to: 8, type: 1 }
    ]
  },
  {
    id: 'ethanoic_acid',
    name: 'Ethanoic Acid (Acetic Acid)',
    formula: 'CH₃COOH',
    category: 'functional',
    wordRoot: 'Eth-',
    suffix1: '-an',
    suffix2: '-oic acid',
    prefix: 'None',
    mass: 60,
    description: 'Carboxylic acid group (-COOH). 5-8% solution in water is known as Vinegar.',
    atoms: [
      { elem: 'C', pos: [-1.1, -0.2, 0] },
      { elem: 'C', pos: [0.3, 0.2, 0] },
      { elem: 'O', pos: [0.7, 1.3, 0] }, // carbonyl C=O
      { elem: 'O', pos: [1.2, -0.8, 0] }, // hydroxyl -OH
      { elem: 'H', pos: [2.1, -0.6, 0] },
      { elem: 'H', pos: [-1.5, 0.7, 0] },
      { elem: 'H', pos: [-1.5, -0.7, 0.8] },
      { elem: 'H', pos: [-1.5, -0.7, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 1, to: 2, type: 2 }, // C=O double bond
      { from: 1, to: 3, type: 1 }, // C-O single bond
      { from: 3, to: 4, type: 1 }, // O-H
      { from: 0, to: 5, type: 1 },
      { from: 0, to: 6, type: 1 },
      { from: 0, to: 7, type: 1 }
    ]
  },
  {
    id: 'propanone',
    name: 'Propanone (Acetone)',
    formula: 'CH₃COCH₃',
    category: 'functional',
    wordRoot: 'Prop-',
    suffix1: '-an',
    suffix2: '-one',
    prefix: 'None',
    mass: 58,
    description: 'Simplest Ketone (>C=O group on non-terminal carbon). Common solvent in nail polish remover.',
    atoms: [
      { elem: 'C', pos: [-1.4, -0.4, 0] },
      { elem: 'C', pos: [0, 0.3, 0] },
      { elem: 'C', pos: [1.4, -0.4, 0] },
      { elem: 'O', pos: [0, 1.5, 0] }, // C=O
      { elem: 'H', pos: [-1.4, -1.4, 0] },
      { elem: 'H', pos: [-1.9, -0.1, 0.8] },
      { elem: 'H', pos: [-1.9, -0.1, -0.8] },
      { elem: 'H', pos: [1.4, -1.4, 0] },
      { elem: 'H', pos: [1.9, -0.1, 0.8] },
      { elem: 'H', pos: [1.9, -0.1, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 1, to: 2, type: 1 },
      { from: 1, to: 3, type: 2 }, // C=O
      { from: 0, to: 4, type: 1 },
      { from: 0, to: 5, type: 1 },
      { from: 0, to: 6, type: 1 },
      { from: 2, to: 7, type: 1 },
      { from: 2, to: 8, type: 1 },
      { from: 2, to: 9, type: 1 }
    ]
  },
  {
    id: 'chloromethane',
    name: 'Chloromethane',
    formula: 'CH₃Cl',
    category: 'functional',
    wordRoot: 'Meth-',
    suffix1: '-ane',
    suffix2: 'None',
    prefix: 'Chloro-',
    mass: 50.5,
    description: 'Haloalkane with chlorine halogen substituent replacing one hydrogen atom.',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'Cl', pos: [0, 1.1, 0] },
      { elem: 'H', pos: [0.89, -0.32, 0] },
      { elem: 'H', pos: [-0.45, -0.32, 0.77] },
      { elem: 'H', pos: [-0.45, -0.32, -0.77] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 },
      { from: 0, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 },
      { from: 0, to: 4, type: 1 }
    ]
  }
];
