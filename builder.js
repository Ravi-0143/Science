/**
 * Procedural 3D Hydrocarbon & Functional Group Builder
 * Calculates positions, IUPAC names, formulas, and mass dynamically.
 */

const WORD_ROOTS = ['', 'Meth-', 'Eth-', 'Prop-', 'But-', 'Pent-', 'Hex-'];

function generateCustomMolecule(carbonCount, bondType, functionalGroup) {
  let name = '';
  let formula = '';
  let wordRoot = WORD_ROOTS[carbonCount] || `C${carbonCount}-`;
  let suffix1 = '-ane';
  let suffix2 = 'None';
  let prefix = 'None';
  let genFormula = 'CₙH₂ₙ₊₂';

  const atoms = [];
  const bonds = [];

  // Carbon chain placement geometry (zigzag backbone)
  const cPositions = [];
  const bondLength = 1.35;
  const angle = 0.35; // zigzag offset

  for (let i = 0; i < carbonCount; i++) {
    const x = (i - (carbonCount - 1) / 2) * bondLength;
    const y = (i % 2 === 0 ? 0.2 : -0.2);
    const z = 0;
    cPositions.push([x, y, z]);
    atoms.push({ elem: 'C', pos: [x, y, z] });
  }

  // Connect C backbone bonds
  for (let i = 0; i < carbonCount - 1; i++) {
    let bType = 1;
    if (i === 0) {
      if (bondType === 'double') bType = 2;
      else if (bondType === 'triple') bType = 3;
    }
    bonds.push({ from: i, to: i + 1, type: bType });
  }

  // Derive IUPAC naming parameters & formulas
  if (bondType === 'double') {
    suffix1 = '-ene';
    genFormula = 'CₙH₂ₙ';
  } else if (bondType === 'triple') {
    suffix1 = '-yne';
    genFormula = 'CₙH₂ₙ₋₂';
  }

  // Attach hydrogens & functional groups
  let hydrogenCount = 0;
  let oxygenCount = 0;
  let chloroCount = 0;
  let bromoCount = 0;

  for (let i = 0; i < carbonCount; i++) {
    let usedBonds = 0;
    bonds.forEach(b => {
      if (b.from === i || b.to === i) usedBonds += b.type;
    });

    // Check if this carbon carries a functional group
    let isTerminal = (i === carbonCount - 1);
    let isSecond = (i === 1 || (carbonCount === 3 && i === 1));

    if (functionalGroup === 'alcohol' && isTerminal) {
      // Add -O-H to last carbon
      const oIdx = atoms.length;
      const cPos = cPositions[i];
      const oPos = [cPos[0] + 0.7, cPos[1] + 0.8, 0];
      atoms.push({ elem: 'O', pos: oPos });
      bonds.push({ from: i, to: oIdx, type: 1 });
      oxygenCount++;

      const hIdx = atoms.length;
      atoms.push({ elem: 'H', pos: [oPos[0] + 0.6, oPos[1] - 0.2, 0] });
      bonds.push({ from: oIdx, to: hIdx, type: 1 });
      hydrogenCount++;
      usedBonds += 1;
      suffix2 = '-ol';
      if (suffix1 === '-ane') suffix1 = '-an';
    } else if (functionalGroup === 'aldehyde' && isTerminal) {
      // Add =O and -H to last carbon
      const oIdx = atoms.length;
      const cPos = cPositions[i];
      atoms.push({ elem: 'O', pos: [cPos[0] + 0.6, cPos[1] + 0.9, 0] });
      bonds.push({ from: i, to: oIdx, type: 2 });
      oxygenCount++;
      usedBonds += 2;
      suffix2 = '-al';
      if (suffix1 === '-ane') suffix1 = '-an';
    } else if (functionalGroup === 'carboxylic' && isTerminal) {
      // Add =O and -O-H to last carbon
      const cPos = cPositions[i];
      const o1Idx = atoms.length;
      atoms.push({ elem: 'O', pos: [cPos[0] + 0.2, cPos[1] + 1.1, 0] });
      bonds.push({ from: i, to: o1Idx, type: 2 });

      const o2Idx = atoms.length;
      const o2Pos = [cPos[0] + 0.9, cPos[1] - 0.6, 0];
      atoms.push({ elem: 'O', pos: o2Pos });
      bonds.push({ from: i, to: o2Idx, type: 1 });

      const hIdx = atoms.length;
      atoms.push({ elem: 'H', pos: [o2Pos[0] + 0.6, o2Pos[1], 0] });
      bonds.push({ from: o2Idx, to: hIdx, type: 1 });
      
      oxygenCount += 2;
      hydrogenCount++;
      usedBonds += 3;
      suffix2 = '-oic acid';
      if (suffix1 === '-ane') suffix1 = '-an';
    } else if (functionalGroup === 'ketone' && isSecond && carbonCount >= 3) {
      // Add =O to middle carbon
      const oIdx = atoms.length;
      const cPos = cPositions[i];
      atoms.push({ elem: 'O', pos: [cPos[0], cPos[1] + 1.1, 0] });
      bonds.push({ from: i, to: oIdx, type: 2 });
      oxygenCount++;
      usedBonds += 2;
      suffix2 = '-one';
      if (suffix1 === '-ane') suffix1 = '-an';
    } else if (functionalGroup === 'chloro' && isTerminal) {
      const clIdx = atoms.length;
      const cPos = cPositions[i];
      atoms.push({ elem: 'Cl', pos: [cPos[0] + 0.8, cPos[1] + 0.8, 0] });
      bonds.push({ from: i, to: clIdx, type: 1 });
      chloroCount++;
      usedBonds += 1;
      prefix = 'Chloro-';
    } else if (functionalGroup === 'bromo' && isTerminal) {
      const brIdx = atoms.length;
      const cPos = cPositions[i];
      atoms.push({ elem: 'Br', pos: [cPos[0] + 0.8, cPos[1] + 0.8, 0] });
      bonds.push({ from: i, to: brIdx, type: 1 });
      bromoCount++;
      usedBonds += 1;
      prefix = 'Bromo-';
    }

    // Fill remaining valencies with Hydrogens
    let remainingValency = 4 - usedBonds;
    const hAngles = [
      [0, 0.9, 0],
      [0, -0.9, 0],
      [0, 0, 0.9],
      [0, 0, -0.9],
      [-0.8, 0, 0],
      [0.8, 0, 0]
    ];

    let hOffsetIndex = 0;
    while (remainingValency > 0) {
      const hIdx = atoms.length;
      const dir = hAngles[hOffsetIndex % hAngles.length];
      const cPos = cPositions[i];
      atoms.push({ elem: 'H', pos: [cPos[0] + dir[0], cPos[1] + dir[1], cPos[2] + dir[2]] });
      bonds.push({ from: i, to: hIdx, type: 1 });
      hydrogenCount++;
      remainingValency--;
      hOffsetIndex++;
    }
  }

  // Construct final IUPAC Name
  let nameRoot = wordRoot.toLowerCase();
  if (prefix !== 'None') {
    name = prefix + nameRoot + (suffix1 === '-an' ? 'ane' : suffix1);
  } else {
    name = wordRoot + (suffix1.startsWith('-') ? suffix1.slice(1) : suffix1);
    if (suffix2 !== 'None') {
      name += (suffix2.startsWith('-') ? suffix2.slice(1) : suffix2);
    }
  }

  // Format chemical formula string
  formula = `C${carbonCount > 1 ? carbonCount : ''}H${hydrogenCount > 1 ? hydrogenCount : ''}`;
  if (oxygenCount > 0) formula += `O${oxygenCount > 1 ? oxygenCount : ''}`;
  if (chloroCount > 0) formula += `Cl${chloroCount > 1 ? chloroCount : ''}`;
  if (bromoCount > 0) formula += `Br${bromoCount > 1 ? bromoCount : ''}`;

  // Molecular mass calculation
  const mass = Math.round((carbonCount * 12 + hydrogenCount * 1 + oxygenCount * 16 + chloroCount * 35.5 + bromoCount * 80) * 10) / 10;

  return {
    id: 'custom_builder',
    name: name,
    formula: formula,
    category: functionalGroup !== 'none' ? 'functional' : (bondType === 'single' ? 'alkane' : (bondType === 'double' ? 'alkene' : 'alkyne')),
    wordRoot,
    suffix1,
    suffix2,
    prefix,
    mass,
    genFormula,
    description: `Custom generated compound containing ${carbonCount} carbon(s) with ${bondType} bond(s) and ${functionalGroup} group.`,
    atoms,
    bonds
  };
}
