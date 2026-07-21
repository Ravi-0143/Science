# 🧪 Science Interactive Hub (CBSE Class 9 & 10)

An interactive, high-performance web suite designed for CBSE Class 9 & 10 Science (Physics, Chemistry & Biology). Features live 3D molecular modeling, real-time optical ray tracing, epithelial tissue functional simulators, and interactive homework activity engines.

---

## 🌟 Interactive Modules

### 1. 🧊 3D Hydrocarbon & IUPAC Lab (`hydrocarbon_3d_lab.html`)
* **3D Molecular Renderer:** Built using Three.js with realistic materials, shadows, and orbit control.
* **Pre-built Library:** Alkanes, Alkenes, Alkynes, Alcohols (-OH), Aldehydes (-CHO), Ketones (>C=O), Carboxylic Acids (-COOH), and Haloalkanes (-Cl, -Br).
* **3D Electron Sharing (Lewis Dot):** Visualizes shared covalent electron pairs between atoms.
* **IUPAC Nomenclature Engine:** Procedurally computes Word Root, Primary Suffix, Secondary Suffix, and molecular formula.
* **Class 10 Practice Quiz:** Interactive revision questions with celebratory confetti animations.

### 2. 👓 Optics Ray Diagram Simulator (`mirror_lens_ray_diagram_simulator.html`)
* **Live Optics Engine:** Live SVG ray tracing for Convex/Concave Lenses & Mirrors.
* **Dynamic Sliders:** Adjust object distance ($u$), focal length ($f$), and object height ($h_o$).
* **Real-time Readouts:** Instant calculation of image distance ($v$), magnification ($m$), image nature (Real/Virtual), and orientation.
* **CBSE Formula Reference:** Quick lookup for Lens Formula ($\frac{1}{f} = \frac{1}{v} - \frac{1}{u}$) and Mirror Formula ($\frac{1}{f} = \frac{1}{v} + \frac{1}{u}$).

### 3. 🔬 Epithelial Tissue & Skin Cell Lab (`epithelial_tissue_lab.html`)
* **4 Epithelial Tissue Simulators:**
  1. **Simple Squamous Epithelium (Oesophagus):** Single layer of ultra-flat tiles for smooth sliding and fast diffusion. Interactive food slide demo!
  2. **Stratified Squamous Epithelium (Skin):** Multi-layered stacked deck of cards protecting against rubbing, scratching, and wear. Interactive friction/wear simulation!
  3. **Cuboidal Epithelium (Kidney Tubules & Salivary Glands):** Cube-shaped 3D factory cells. Interactive fluid pump & saliva secretion animation!
  4. **Ciliated Columnar Epithelium (Respiratory Tract / Windpipe):** Tall pillars with hair-like cilia sweeping dirty mucus upwards out of lungs. Interactive cilia broom sweeping animation!
* **Homework Matching Activity:** Drag/click interactive matching game for tissue types $\rightarrow$ body locations with instant scoring and celebratory feedback.

### 4. 🌱 Meristem Mastery & Plant Tissues Lab (`meristem_mastery_lab.html`)
* **Interactive Meristem Map:** Interactive SVG plant model highlighting **Apical** (shoot/root tips), **Intercalary** (nodes/leaf bases), and **Lateral** (vascular cambium) meristems.
* **Live Growth Simulator:** Interactive sliders for **Primary Growth** (length) and **Secondary Growth** (stem girth) with real-time morphing SVG plant rendering and growth energy meter.
* **Cell Differentiation Visualizer:** Microscopic comparison cards between **Meristematic Cells** (dense cytoplasm, large nucleus, no vacuole, active division) and **Permanent Cells** (large central vacuole, thick wall, specialized job).
* **Interactive Placement Mission & Retrieval Quiz:** Drag/click tissue matching activity and a 5-question NCERT-aligned revision quiz with confetti celebrations.

### 5. 🌿 Vascular Tissue Atlas - Flora Immersive (`Flora-Immersive/`)
* **Cinematic 3D Particle Streams:** High-DPI canvas engine rendering xylem water transpiration pull and phloem pressure-driven sucrose translocation.
* **Cell Explorer Mode:** Interactive anatomical inspection of Vessel Elements, Tracheids, Xylem Parenchyma/Fibres, Sieve-Tube Elements, and Companion Cells.
* **Guided Story & Diagnostic Quiz:** Interactive guided story tours with live environmental sliders and exam trap diagnostic quizzes.

---

## 🎨 Design System

* **Light Theme Aesthetic:** Clean, vibrant light background (`#f8fafc`), crisp card surfaces (`#ffffff`), and curated high-contrast color palettes tailored for optimal readability.
* **Micro-Animations:** Smooth transitions, active state highlights, and interactive canvas visualizers.

---

## 🚀 How to Run Locally

1. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Or serve via any local HTTP server:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000` in your browser.
