/**
 * Hydrocarbon 3D Lab - Main Application Logic
 * Integrates Three.js 3D rendering, OrbitControls, UI interaction, and Quiz.
 */

let scene, camera, renderer, controls;
let currentMoleculeGroup;
let electronShareGroup;
let raycaster, mouse;
let activeMoleculeData = MOLECULE_DATABASE[0];

// Render Mode State
let renderStyle = 'ballAndStick'; // 'ballAndStick', 'spaceFilling', 'wireframe'
let isAutoRotating = false;
let isElectronShareVisible = false;

// Quiz Instance
const quiz = new QuizEngine();

document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  populateMoleculeLibrary(MOLECULE_DATABASE);
  loadMolecule(MOLECULE_DATABASE[0]);
  setupEventListeners();
  renderQuizQuestion();
  animate();
});

/* -------------------------------------------------------------
 * 1. Three.js Scene Setup & Initialization
 * ------------------------------------------------------------- */
function initThreeJS() {
  const container = document.getElementById('canvasContainer');
  const canvas = document.getElementById('threeCanvas');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 8);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.8;
  controls.minDistance = 3;
  controls.maxDistance = 20;

  // Lighting setup for realistic 3D appearance
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight1.position.set(5, 10, 7);
  dirLight1.castShadow = true;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x00e5ff, 0.4);
  dirLight2.position.set(-5, -5, -5);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0x9d4edd, 0.5, 10);
  pointLight.position.set(0, 2, 4);
  scene.add(pointLight);

  // Groups
  currentMoleculeGroup = new THREE.Group();
  scene.add(currentMoleculeGroup);

  electronShareGroup = new THREE.Group();
  scene.add(electronShareGroup);

  // Raycaster for hover interactions
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
}

/* -------------------------------------------------------------
 * 2. 3D Molecule Mesh Construction
 * ------------------------------------------------------------- */
function loadMolecule(molData) {
  activeMoleculeData = molData;
  updateMoleculeUIInfo(molData);

  // Clear existing 3D objects
  while (currentMoleculeGroup.children.length > 0) {
    const obj = currentMoleculeGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    currentMoleculeGroup.remove(obj);
  }

  while (electronShareGroup.children.length > 0) {
    const obj = electronShareGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    electronShareGroup.remove(obj);
  }

  const atomMeshes = [];

  // Build Atoms (Spheres)
  molData.atoms.forEach((atom, index) => {
    const spec = ATOM_TYPES[atom.elem] || ATOM_TYPES.C;
    let radius = spec.radius;
    if (renderStyle === 'spaceFilling') radius *= 1.8;

    const geom = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: 0.25,
      metalness: 0.2,
      wireframe: (renderStyle === 'wireframe')
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(...atom.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { atom, spec, index };

    currentMoleculeGroup.add(mesh);
    atomMeshes.push(mesh);
  });

  // Build Bonds (Cylinders)
  if (renderStyle !== 'spaceFilling') {
    molData.bonds.forEach(bond => {
      const posA = new THREE.Vector3(...molData.atoms[bond.from].pos);
      const posB = new THREE.Vector3(...molData.atoms[bond.to].pos);
      createBondMesh(posA, posB, bond.type);
      createElectronDotPairs(posA, posB, bond.type);
    });
  }

  // Adjust Camera Focus
  const box = new THREE.Box3().setFromObject(currentMoleculeGroup);
  const center = box.getCenter(new THREE.Vector3());
  currentMoleculeGroup.position.sub(center);
  electronShareGroup.position.sub(center);

  electronShareGroup.visible = isElectronShareVisible;
}

function createBondMesh(posA, posB, bondType) {
  const direction = new THREE.Vector3().subVectors(posB, posA);
  const length = direction.length();
  const orientation = new THREE.Matrix4();
  orientation.lookAt(posA, posB, new THREE.Object3D().up);

  const bondMat = new THREE.MeshStandardMaterial({
    color: 0xd8dee9,
    roughness: 0.3,
    metalness: 0.1,
    wireframe: (renderStyle === 'wireframe')
  });

  const offsets = getBondOffsets(bondType, direction);

  offsets.forEach(offset => {
    const bondRadius = bondType === 1 ? 0.08 : (bondType === 2 ? 0.06 : 0.05);
    const geom = new THREE.CylinderGeometry(bondRadius, bondRadius, length, 16);
    geom.translate(0, length / 2, 0);
    geom.rotateX(Math.PI / 2);

    const mesh = new THREE.Mesh(geom, bondMat);
    mesh.position.copy(posA).add(offset);
    mesh.lookAt(posB.clone().add(offset));

    currentMoleculeGroup.add(mesh);
  });
}

function getBondOffsets(bondType, direction) {
  if (bondType === 1) return [new THREE.Vector3(0, 0, 0)];

  // Calculate perpendicular vector for multi-bond separation
  const perp = new THREE.Vector3();
  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    perp.set(-direction.z, 0, direction.x).normalize();
  } else {
    perp.set(0, -direction.z, direction.y).normalize();
  }

  const offsetDist = 0.14;

  if (bondType === 2) {
    return [
      perp.clone().multiplyScalar(offsetDist),
      perp.clone().multiplyScalar(-offsetDist)
    ];
  } else if (bondType === 3) {
    const perp2 = new THREE.Vector3().crossVectors(direction, perp).normalize();
    return [
      new THREE.Vector3(0, 0, 0),
      perp.clone().multiplyScalar(offsetDist * 1.2),
      perp2.clone().multiplyScalar(offsetDist * 1.2)
    ];
  }
  return [new THREE.Vector3(0, 0, 0)];
}

function createElectronDotPairs(posA, posB, bondType) {
  // Shared covalent electrons (2 per bond type)
  const dotCount = bondType * 2;
  const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

  const dotMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: false
  });

  for (let i = 0; i < dotCount; i++) {
    const dotGeom = new THREE.SphereGeometry(0.09, 16, 16);
    const dotMesh = new THREE.Mesh(dotGeom, dotMat);
    
    // Spread electrons slightly around bond midpoint
    const spread = (i - (dotCount - 1) / 2) * 0.15;
    dotMesh.position.copy(midPoint).add(new THREE.Vector3(spread, (i % 2 === 0 ? 0.1 : -0.1), 0));
    
    electronShareGroup.add(dotMesh);
  }
}

/* -------------------------------------------------------------
 * 3. UI Update Logic & Event Handlers
 * ------------------------------------------------------------- */
function updateMoleculeUIInfo(mol) {
  document.getElementById('moleculeName').textContent = mol.name;
  document.getElementById('moleculeFormula').textContent = mol.formula;
  document.getElementById('moleculeCategoryTag').textContent = mol.category.toUpperCase();

  document.getElementById('breakdownPrefix').textContent = mol.prefix || 'None';
  document.getElementById('breakdownPrefixDesc').textContent = mol.prefix !== 'None' ? 'Halogen Substituent' : 'No substituents';

  document.getElementById('breakdownRoot').textContent = mol.wordRoot || 'Meth-';
  document.getElementById('breakdownRootDesc').textContent = `${mol.atoms.filter(a => a.elem === 'C').length} Carbon Atom(s)`;

  document.getElementById('breakdownSuffix1').textContent = mol.suffix1 || '-ane';
  document.getElementById('breakdownSuffix1Desc').textContent = mol.category === 'alkene' ? 'One C=C Double Bond' : (mol.category === 'alkyne' ? 'One C≡C Triple Bond' : 'All C-C Single Bonds');

  document.getElementById('breakdownSuffix2').textContent = mol.suffix2 || 'None';
  document.getElementById('breakdownSuffix2Desc').textContent = mol.suffix2 !== 'None' ? 'Functional Group Suffix' : 'Hydrocarbon only';

  // Builder stats sync
  document.getElementById('genFormulaDisplay').textContent = mol.genFormula || 'CₙH₂ₙ₊₂';
  document.getElementById('molMassDisplay').textContent = `${mol.mass} g/mol`;
}

function populateMoleculeLibrary(list) {
  const container = document.getElementById('moleculeList');
  container.innerHTML = '';

  list.forEach(mol => {
    const card = document.createElement('div');
    card.className = `mol-card ${mol.id === activeMoleculeData.id ? 'active' : ''}`;
    card.dataset.id = mol.id;
    card.dataset.category = mol.category;

    card.innerHTML = `
      <div class="mol-info">
        <h4>${mol.name}</h4>
        <p>${mol.description.substring(0, 45)}...</p>
      </div>
      <span class="mol-tag">${mol.formula}</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.mol-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      loadMolecule(mol);
    });

    container.appendChild(card);
  });
}

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.panel-tab-content').forEach(content => {
        content.classList.remove('active');
      });

      if (targetTab === 'builder') {
        document.getElementById('tabContentBuilder').classList.add('active');
        triggerBuilderUpdate();
      } else if (targetTab === 'theory') {
        document.getElementById('tabContentTheory').classList.add('active');
      } else if (targetTab === 'quiz') {
        document.getElementById('tabContentQuiz').classList.add('active');
      } else {
        document.getElementById('tabContentBuilder').classList.add('active');
      }
    });
  });

  // Filter Pills
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.category;
      document.querySelectorAll('.mol-card').forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Search Input
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.mol-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  // Toolbar Buttons
  document.getElementById('btnToggleRotate').addEventListener('click', (e) => {
    isAutoRotating = !isAutoRotating;
    e.currentTarget.classList.toggle('active', isAutoRotating);
  });

  document.getElementById('btnToggleStyle').addEventListener('click', () => {
    if (renderStyle === 'ballAndStick') renderStyle = 'spaceFilling';
    else if (renderStyle === 'spaceFilling') renderStyle = 'wireframe';
    else renderStyle = 'ballAndStick';

    document.getElementById('styleName').textContent =
      renderStyle === 'ballAndStick' ? 'Ball & Stick' : (renderStyle === 'spaceFilling' ? 'Space Filling' : 'Wireframe');

    loadMolecule(activeMoleculeData);
  });

  document.getElementById('btnElectronDot').addEventListener('click', (e) => {
    isElectronShareVisible = !isElectronShareVisible;
    electronShareGroup.visible = isElectronShareVisible;
    e.currentTarget.classList.toggle('active', isElectronShareVisible);
  });

  document.getElementById('btnResetCam').addEventListener('click', () => {
    camera.position.set(0, 0, 8);
    controls.reset();
  });

  // Interactive Builder Controls
  const carbonRange = document.getElementById('carbonRange');
  const functionalSelect = document.getElementById('functionalSelect');
  const bondToggleBtns = document.querySelectorAll('.btn-group-toggle .toggle-btn');

  let currentBondType = 'single';

  carbonRange.addEventListener('input', triggerBuilderUpdate);
  functionalSelect.addEventListener('change', triggerBuilderUpdate);

  bondToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bondToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBondType = btn.dataset.bond;
      triggerBuilderUpdate();
    });
  });

  function triggerBuilderUpdate() {
    const cCount = parseInt(carbonRange.value);
    const funcGroup = functionalSelect.value;
    const customMol = generateCustomMolecule(cCount, currentBondType, funcGroup);
    loadMolecule(customMol);
  }
}

/* -------------------------------------------------------------
 * 4. Raycasting Hover Tooltip Logic
 * ------------------------------------------------------------- */
function onCanvasMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(currentMoleculeGroup.children);

  const tooltip = document.getElementById('atomTooltip');

  if (intersects.length > 0 && intersects[0].object.userData.atom) {
    const { atom, spec } = intersects[0].object.userData;
    document.getElementById('ttSymbol').textContent = spec.label;
    document.getElementById('ttName').textContent = spec.name;
    document.getElementById('ttValency').textContent = spec.valency;
    document.getElementById('ttShared').textContent = spec.valency;
    document.getElementById('ttRole').textContent = atom.elem === 'C' ? 'Carbon Backbone Chain' : 'Terminal Bonded Atom';

    tooltip.style.left = `${event.clientX - rect.left}px`;
    tooltip.style.top = `${event.clientY - rect.top}px`;
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
}

function onWindowResize() {
  const container = document.getElementById('canvasContainer');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/* -------------------------------------------------------------
 * 5. Animation Loop
 * ------------------------------------------------------------- */
function animate() {
  requestAnimationFrame(animate);

  if (isAutoRotating && currentMoleculeGroup) {
    currentMoleculeGroup.rotation.y += 0.01;
    electronShareGroup.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}

/* -------------------------------------------------------------
 * 6. Practice Quiz Renderer
 * ------------------------------------------------------------- */
function renderQuizQuestion() {
  const q = quiz.getCurrentQuestion();
  document.getElementById('qCurrent').textContent = quiz.currentIndex + 1;
  document.getElementById('qTotal').textContent = QUIZ_QUESTIONS.length;
  document.getElementById('quizProgressFill').style.width = `${((quiz.currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  document.getElementById('quizQuestion').innerHTML = q.question;

  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('btnNextQuiz').style.display = 'none';

  q.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<i class="fa-regular fa-circle"></i> ${optText}`;

    btn.addEventListener('click', () => {
      const result = quiz.submitAnswer(index);
      document.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
        b.disabled = true;
        if (idx === result.correctIndex) b.classList.add('correct');
        else if (idx === index && !result.isCorrect) b.classList.add('incorrect');
      });

      const feedback = document.getElementById('quizFeedback');
      feedback.style.display = 'block';
      feedback.className = `quiz-feedback ${result.isCorrect ? 'success' : 'error'}`;
      feedback.innerHTML = `<strong>${result.isCorrect ? '✨ Correct!' : '❌ Incorrect'}</strong> ${result.explanation}`;

      if (result.isCorrect && typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      document.getElementById('btnNextQuiz').style.display = 'inline-flex';
    });

    optionsContainer.appendChild(btn);
  });
}

document.getElementById('btnNextQuiz').addEventListener('click', () => {
  if (quiz.nextQuestion()) {
    renderQuizQuestion();
  } else {
    // Quiz completed
    document.getElementById('quizCard').innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <i class="fa-solid fa-trophy" style="font-size: 3rem; color: var(--accent-amber); margin-bottom: 12px;"></i>
        <h3>Quiz Complete!</h3>
        <p style="margin: 8px 0 16px 0; color: var(--text-muted);">You scored <strong>${quiz.score} / ${QUIZ_QUESTIONS.length}</strong></p>
        <button class="primary-btn" onclick="quiz.reset(); renderQuizQuestion();">Try Again <i class="fa-solid fa-rotate-right"></i></button>
      </div>
    `;
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }
  }
});
