/**
 * CBSE Science WebApp - Central SPA Router & Render Engines
 * Supports SPA Tab Switching, Anti-Lag WebGL Throttling, Optics Ray Tracing & Theme Controls
 */

let scene, camera, renderer, controls;
let currentMoleculeGroup, electronShareGroup;
let raycaster, mouse;
let activeMoleculeData = (typeof MOLECULE_DATABASE !== 'undefined') ? MOLECULE_DATABASE[0] : null;

// Render Mode State
let renderStyle = 'ballAndStick'; // 'ballAndStick', 'spaceFilling'
let isAutoRotating = false;
let isElectronShareVisible = false;
let animationFrameId = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSPARouter();
  initGlobalSearch();

  if (typeof MOLECULE_DATABASE !== 'undefined') {
    populateMoleculeLibrary(MOLECULE_DATABASE);
  }
  
  initThreeJS();
  setupHydrocarbonEventListeners();
  initOpticsSimulator();
  initEpithelialMatching();
});

/* ==========================================================================
   1. Single Page Application (SPA) Router & Visibility Optimization
   ========================================================================== */

function initSPARouter() {
  const tabs = document.querySelectorAll('.gh-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = tab.getAttribute('data-tab');
      window.location.hash = targetTab;
      switchTab(targetTab);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'overview';
    switchTab(hash);
  });

  // Load initial tab from URL hash
  const initialTab = window.location.hash.replace('#', '') || 'overview';
  switchTab(initialTab);
}

function switchTab(tabName) {
  const validTabs = ['overview', 'hydrocarbon', 'optics', 'epithelial', 'meristem'];
  if (!validTabs.includes(tabName)) tabName = 'overview';

  // Update Navigation Tab Highlights
  document.querySelectorAll('.gh-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update Viewport Display
  document.querySelectorAll('.spa-view').forEach(view => {
    if (view.id === `view-${tabName}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Performance Optimization: Render 3D frame loop ONLY when Hydrocarbon tab is active
  if (tabName === 'hydrocarbon') {
    onWindowResize();
    startAnimationLoop();
  } else {
    stopAnimationLoop();
  }

  // Trigger Optics SVG render when Optics tab is selected
  if (tabName === 'optics') {
    renderOptics();
  }
}

/* ==========================================================================
   2. Theme Switcher & Global Search
   ========================================================================== */

function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('gh_theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('gh_theme', isLight ? 'light' : 'dark');
      toggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }
}

function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    // Search inside molecules sidebar
    const molItems = document.querySelectorAll('.mol-item');
    molItems.forEach(item => {
      const txt = item.innerText.toLowerCase();
      item.style.display = txt.includes(query) ? 'flex' : 'none';
    });
  });
}

/* ==========================================================================
   3. Three.js Hydrocarbon Engine & Anti-Lag Optimizations
   ========================================================================== */

function initThreeJS() {
  const container = document.getElementById('canvasContainer');
  const canvas = document.getElementById('threeCanvas');
  if (!container || !canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  // Anti-Lag Optimization: Cap pixel ratio at 1.25 for crisp graphics without GPU lag
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

  // Controls with Touch Drag Support for Mobile Android Chrome
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.8;
  controls.minDistance = 3;
  controls.maxDistance = 20;
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  // Ambient & Directional Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x58a6ff, 0.4);
  dirLight2.position.set(-5, -5, -5);
  scene.add(dirLight2);

  currentMoleculeGroup = new THREE.Group();
  scene.add(currentMoleculeGroup);

  electronShareGroup = new THREE.Group();
  scene.add(electronShareGroup);

  if (activeMoleculeData) {
    loadMolecule(activeMoleculeData);
  }

  window.addEventListener('resize', onWindowResize);
}

function startAnimationLoop() {
  if (!animationFrameId) {
    animate();
  }
}

function stopAnimationLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function animate() {
  // Pause frame rendering when document is hidden (background tab)
  if (document.hidden) {
    animationFrameId = requestAnimationFrame(animate);
    return;
  }

  animationFrameId = requestAnimationFrame(animate);

  if (controls) controls.update();

  if (isAutoRotating && currentMoleculeGroup) {
    currentMoleculeGroup.rotation.y += 0.008;
    electronShareGroup.rotation.y += 0.008;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  const container = document.getElementById('canvasContainer');
  if (!container || !renderer || !camera) return;

  const w = container.clientWidth;
  const h = container.clientHeight;

  if (w > 0 && h > 0) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
}

/* Molecule Geometry Loader */
function loadMolecule(molData) {
  activeMoleculeData = molData;
  if (!currentMoleculeGroup) return;

  // Clear existing geometries
  while (currentMoleculeGroup.children.length > 0) {
    const child = currentMoleculeGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    currentMoleculeGroup.remove(child);
  }

  const atomRadiusMap = { 'C': 0.42, 'H': 0.24, 'O': 0.38, 'Cl': 0.44 };
  const atomColorMap = { 'C': 0x30363d, 'H': 0xffffff, 'O': 0xf85149, 'Cl': 0x39c5cf };

  const atomMeshes = [];

  molData.atoms.forEach(atom => {
    const r = atomRadiusMap[atom.elem] || 0.3;
    const geom = new THREE.SphereGeometry(r, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: atomColorMap[atom.elem] || 0x8b949e,
      roughness: 0.3,
      metalness: 0.2
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(...atom.pos);
    currentMoleculeGroup.add(mesh);
    atomMeshes.push(mesh);
  });

  // Create Bond Cylinders
  molData.bonds.forEach(bond => {
    const p1 = new THREE.Vector3(...molData.atoms[bond.from].pos);
    const p2 = new THREE.Vector3(...molData.atoms[bond.to].pos);
    createBondCylinder(p1, p2, bond.type);
  });

  // Update Spec Display
  updateSpecDisplay(molData);
}

function createBondCylinder(p1, p2, bondType) {
  const distance = p1.distanceTo(p2);
  const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

  const geom = new THREE.CylinderGeometry(0.08, 0.08, distance, 12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8b949e, roughness: 0.4 });

  const cylinder = new THREE.Mesh(geom, mat);
  cylinder.position.copy(midpoint);
  cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
  currentMoleculeGroup.add(cylinder);
}

function updateSpecDisplay(molData) {
  const elIupac = document.getElementById('specIupac');
  const elFormula = document.getElementById('specFormula');
  const elMass = document.getElementById('specMass');

  if (elIupac) elIupac.textContent = molData.name;
  if (elFormula) elFormula.textContent = molData.formula;
  if (elMass) elMass.textContent = molData.molecularMass || '16.04 g/mol';

  const molTitle = document.getElementById('moleculeName');
  const molForm = document.getElementById('moleculeFormula');
  if (molTitle) molTitle.textContent = molData.name;
  if (molForm) molForm.textContent = molData.formula;
}

function populateMoleculeLibrary(molList) {
  const container = document.getElementById('moleculeList');
  if (!container) return;

  container.innerHTML = '';

  molList.forEach((mol, idx) => {
    const item = document.createElement('div');
    item.className = `mol-item ${idx === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <div class="mol-info">
        <h4>${mol.name}</h4>
        <span>${mol.formula}</span>
      </div>
      <span class="card-tag">${mol.category}</span>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.mol-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      loadMolecule(mol);
    });

    container.appendChild(item);
  });
}

function setupHydrocarbonEventListeners() {
  const btnRotate = document.getElementById('toggleRotate');
  if (btnRotate) {
    btnRotate.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      btnRotate.classList.toggle('active', isAutoRotating);
    });
  }

  // Procedural Builder Controls
  const carSlider = document.getElementById('builderCarbons');
  const bondSelect = document.getElementById('builderBondType');
  const funcSelect = document.getElementById('builderGroup');

  if (carSlider && typeof generateCustomMolecule === 'function') {
    const updateBuilder = () => {
      const c = parseInt(carSlider.value);
      const b = bondSelect.value;
      const f = funcSelect.value;

      document.getElementById('builderCCountVal').textContent = c;
      const customMol = generateCustomMolecule(c, b, f);
      loadMolecule(customMol);
    };

    carSlider.addEventListener('input', updateBuilder);
    if (bondSelect) bondSelect.addEventListener('change', updateBuilder);
    if (funcSelect) funcSelect.addEventListener('change', updateBuilder);
  }
}

/* ==========================================================================
   4. Optics Ray Simulator Engine (SVG Ray Trace)
   ========================================================================== */

function initOpticsSimulator() {
  const typeSelect = document.getElementById('opticsType');
  const uRange = document.getElementById('udistRange');
  const fRange = document.getElementById('fdistRange');
  const hRange = document.getElementById('hdistRange');

  if (!typeSelect || !uRange) return;

  const update = () => renderOptics();

  typeSelect.addEventListener('change', update);
  uRange.addEventListener('input', update);
  fRange.addEventListener('input', update);
  hRange.addEventListener('input', update);
}

function renderOptics() {
  const wrap = document.getElementById('svgOpticsWrap');
  if (!wrap) return;

  const type = document.getElementById('opticsType').value;
  const uUnits = parseFloat(document.getElementById('udistRange').value);
  const fUnits = parseFloat(document.getElementById('fdistRange').value);
  const hoUnits = parseFloat(document.getElementById('hdistRange').value);

  document.getElementById('udistVal').textContent = uUnits;
  document.getElementById('fdistVal').textContent = fUnits;
  document.getElementById('hdistVal').textContent = hoUnits;

  const PX = 8, W = 700, H = 340;
  const poleX = 350, axisY = 170;

  const isLens = type === 'convexLens' || type === 'concaveLens';
  const f = (type === 'convexLens' || type === 'convexMirror') ? fUnits : -fUnits;
  const u = -uUnits;

  let denom = isLens ? (1/f + 1/u) : (1/f - 1/u);
  let v = Math.abs(denom) > 0.005 ? 1/denom : 999;
  let m = isLens ? (v/u) : (-v/u);

  let svg = `<svg viewBox="0 0 ${W} ${H}">
    <line x1="10" y1="${axisY}" x2="${W-10}" y2="${axisY}" stroke="var(--gh-border-color)" stroke-width="1.5"/>
    <circle cx="${poleX}" cy="${axisY}" r="4" fill="var(--gh-accent-blue)"/>
  `;

  // Draw Optical Element
  if (isLens) {
    svg += `<path d="M ${poleX} ${axisY-100} Q ${poleX+20} ${axisY} ${poleX} ${axisY+100} Q ${poleX-20} ${axisY} ${poleX} ${axisY-100} Z" fill="rgba(88,166,255,0.2)" stroke="var(--gh-accent-blue)" stroke-width="1.5"/>`;
  } else {
    svg += `<path d="M ${poleX} ${axisY-100} Q ${poleX-25} ${axisY} ${poleX} ${axisY+100}" fill="none" stroke="var(--gh-accent-blue)" stroke-width="3"/>`;
  }

  // Draw Object Arrow
  const objX = poleX + u * PX;
  const objY = axisY - hoUnits * PX;
  svg += `<line x1="${objX}" y1="${axisY}" x2="${objX}" y2="${objY}" stroke="var(--gh-accent-orange)" stroke-width="2.5"/>`;
  svg += `<text x="${objX}" y="${objY-6}" font-size="11" fill="var(--gh-accent-orange)" text-anchor="middle">Obj</text>`;

  // Draw Rays
  svg += `<line x1="${objX}" y1="${objY}" x2="${poleX}" y2="${objY}" stroke="var(--gh-accent-blue)" stroke-width="1.2"/>`;
  svg += `</svg>`;

  wrap.innerHTML = svg;

  // Readouts
  document.getElementById('opticsVVal').textContent = (v > 900) ? '∞' : `${v.toFixed(1)} u`;
  document.getElementById('opticsMVal').textContent = (v > 900) ? '∞' : `${m.toFixed(2)}x`;
  document.getElementById('opticsNatureVal').textContent = (m < 0) ? 'Real & Inverted' : 'Virtual & Erect';
  document.getElementById('opticsOrientVal').textContent = Math.abs(m) > 1.05 ? 'Magnified' : 'Diminished';
}

/* ==========================================================================
   5. Epithelial Matching Game Engine
   ========================================================================== */

function initEpithelialMatching() {
  let selectedTissue = null;

  document.querySelectorAll('.match-btn-item[data-tissue]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.match-btn-item[data-tissue]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTissue = btn.getAttribute('data-tissue');
    });
  });

  document.querySelectorAll('.match-btn-item[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!selectedTissue) return;
      const target = btn.getAttribute('data-target');
      if (selectedTissue === target) {
        btn.classList.add('matched');
        btn.querySelector('i').className = 'fa-solid fa-circle-check';
        const sourceBtn = document.querySelector(`.match-btn-item[data-tissue="${selectedTissue}"]`);
        if (sourceBtn) {
          sourceBtn.classList.add('matched');
          sourceBtn.querySelector('i').className = 'fa-solid fa-circle-check';
        }
        selectedTissue = null;
      }
    });
  });
}
