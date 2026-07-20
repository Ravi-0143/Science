# 🧪 Hydrocarbon 3D Lab (CBSE Class 9 & 10 Chemistry)

An interactive, high-performance 3D web application designed for students studying **"Carbon and Its Compounds"** in CBSE Class 9 & 10 Chemistry. 

Explore molecular structures, learn IUPAC systematic nomenclature rules, construct custom organic molecules, and visualize electron sharing in 3D.

---

## 🌟 Key Features

### 1. 🧊 3D Molecule Explorer
* **Interactive Rendering:** Built using Three.js with realistic materials, shadows, and lighting.
* **Rotatable & Zoomable:** Orbit controls for full 360° molecular exploration.
* **Pre-built Library:** 
  * **Alkanes:** Methane ($CH_4$), Ethane ($C_2H_6$), Propane ($C_3H_8$), Butane ($C_4H_{10}$)
  * **Alkenes:** Ethene ($C_2H_4$), Propene ($C_3H_6$)
  * **Alkynes:** Ethyne ($C_2H_2$)
  * **Functional Groups (Class 10 Extension):** Ethanol ($C_2H_5OH$), Ethanoic Acid ($CH_3COOH$), Propanone ($CH_3COCH_3$), Chloromethane ($CH_3Cl$).

### 2. ⚛️ 3D Electron Sharing (Lewis / Electron Dot Structure)
* Toggle 3D electron dot overlays demonstrating shared covalent electron pairs between Carbon, Hydrogen, Oxygen, and Halogen atoms.

### 3. 🛠️ Custom Molecule Builder & IUPAC Engine
* **Carbon Chain Slider:** Dynamically select chain length from 1 to 6 carbons (Meth- to Hex-).
* **Saturation Level:** Toggle between Single (-ane), Double (-ene), and Triple (-yne) bonds.
* **Functional Group Attachment:** Attach Alcohols (-OH), Aldehydes (-CHO), Ketones (>C=O), Carboxylic Acids (-COOH), and Haloalkanes (-Cl, -Br).
* **Real-time IUPAC Name Derivation:** Automatically calculates IUPAC Word Root, Primary Suffix, Secondary Suffix, Substituent Prefixes, Molecular Mass, and Chemical Formula.

### 4. 📝 Practice Quiz & Revision Notes
* CBSE Class 10 textbook summary covering **Catenation**, **Tetravalency**, **Homologous Series**, and **Nomenclature Steps**.
* Interactive quiz with instant feedback and celebratory confetti animations upon completion.

---

## 🚀 How to Run Locally

1. Open `index.html` in any web browser (Chrome, Edge, Firefox, Safari).
2. Or serve via any local web server:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000` in your browser.

---

## 📚 Syllabus Alignment
Specifically aligned with CBSE Class 10 NCERT Chapter 4: **Carbon and Its Compounds**.
- **Catenation:** Ability of carbon to form stable long chains.
- **Tetravalency:** Valency of 4 forming four covalent bonds.
- **IUPAC Nomenclature:** Word Root + Suffix + Functional Group.
