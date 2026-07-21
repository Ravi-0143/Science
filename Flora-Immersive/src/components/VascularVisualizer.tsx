import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Sun, Moon, Info } from 'lucide-react';
import { StoryStep } from '../types';

interface VascularVisualizerProps {
  currentStep: StoryStep;
  xylemVal: number;
  phylemVal: number;
  setXylemVal: (val: number) => void;
  setPhylemVal: (val: number) => void;
  dayMode: boolean;
  setDayMode: (mode: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
  type: 'water' | 'sugar' | 'osmosis_to_phloem' | 'osmosis_to_xylem' | 'steam';
  progress: number; // 0 to 1
  angle?: number;
  decay?: number;
}

export default function VascularVisualizer({
  currentStep,
  xylemVal,
  phylemVal,
  setXylemVal,
  setPhylemVal,
  dayMode,
  setDayMode,
}: VascularVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [hudMessage, setHudMessage] = useState<string>('Hover over layers or adjust sliders to simulate.');
  const [triggerPulse, setTriggerPulse] = useState<boolean>(false);

  // Camera State (Smoothly Lerped)
  const cameraRef = useRef({
    zoom: 1.0,
    x: 0,
    y: 0,
    angle: 0,
    rotateX: 15,
  });

  // Particle list
  const particlesRef = useRef<Particle[]>([]);

  // Sliders to ref for access in animation frame without closure staleness
  const ratesRef = useRef({ xylem: xylemVal, phloem: phylemVal });
  useEffect(() => {
    ratesRef.current = { xylem: xylemVal, phloem: phylemVal };
  }, [xylemVal, phylemVal]);

  // Handle sudden sugar loading pulse
  const handleSugarPulse = () => {
    setTriggerPulse(true);
    setHudMessage("Metabolic loading peak! Active sucrose pumping at leaf sources builds high turgor pressure.");
    
    // Inject a wave of sugar particles at phloem sources (top)
    const newParticles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        x: 180 + (Math.random() - 0.5) * 15,
        y: 80 + Math.random() * 20,
        speed: 1.2 + Math.random() * 1.5,
        size: 3 + Math.random() * 3,
        alpha: 1.0,
        color: '#E0A925',
        type: 'sugar',
        progress: Math.random() * 0.1,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];

    setTimeout(() => setTriggerPulse(false), 1500);
  };

  // Animation & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Set high-DPI canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize some initial particles
    const initParticles = () => {
      const list: Particle[] = [];
      // Water particles (Xylem)
      for (let i = 0; i < 35; i++) {
        list.push({
          x: 110 + (Math.random() - 0.5) * 20,
          y: 60 + Math.random() * 360,
          speed: 1.0 + Math.random() * 2.0,
          size: 2.5 + Math.random() * 2.5,
          alpha: 0.2 + Math.random() * 0.8,
          color: '#34D399',
          type: 'water',
          progress: Math.random(),
        });
      }
      // Sugar particles (Phloem)
      for (let i = 0; i < 25; i++) {
        list.push({
          x: 180 + (Math.random() - 0.5) * 15,
          y: 60 + Math.random() * 360,
          speed: 0.8 + Math.random() * 1.5,
          size: 3.5 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.7,
          color: '#FBBF24',
          type: 'sugar',
          progress: Math.random(),
        });
      }
      particlesRef.current = list;
    };
    initParticles();

    // Main render frame
    const render = () => {
      time += 0.01;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clean canvas with deep color reflecting day/night
      ctx.clearRect(0, 0, width, height);
      if (dayMode) {
        ctx.fillStyle = '#FAF8F3'; // warm archival parchment
      } else {
        ctx.fillStyle = '#0B0F19'; // deep cosmic navy
      }
      ctx.fillRect(0, 0, width, height);

      // Determine camera targets based on story step focus
      let targetZoom = 1.0;
      let targetX = 0;
      let targetY = 0;
      let targetAngle = 0;
      let targetRotateX = 15;

      switch (currentStep.focus) {
        case 'stem':
          targetZoom = 1.1;
          targetX = 0;
          targetY = -15;
          targetAngle = time * 0.05; // slowly spinning
          targetRotateX = 22;
          break;
        case 'xylem':
        case 'transpiration':
          targetZoom = 1.6;
          targetX = 65; // shift to xylem
          targetY = 10;
          targetAngle = 0;
          targetRotateX = 0;
          break;
        case 'phloem':
        case 'translocation':
          targetZoom = 1.6;
          targetX = -65; // shift to phloem
          targetY = 10;
          targetAngle = 0;
          targetRotateX = 0;
          break;
        case 'comparison':
          targetZoom = 1.25;
          targetX = 0;
          targetY = 5;
          targetAngle = 0;
          targetRotateX = 0;
          break;
        case 'quiz':
          targetZoom = 0.95;
          targetX = 0;
          targetY = -35;
          targetAngle = time * 0.03;
          targetRotateX = 18;
          break;
      }

      // Camera Lerp (Smooth springs)
      const lerpFactor = 0.07;
      cameraRef.current.zoom += (targetZoom - cameraRef.current.zoom) * lerpFactor;
      cameraRef.current.x += (targetX - cameraRef.current.x) * lerpFactor;
      cameraRef.current.y += (targetY - cameraRef.current.y) * lerpFactor;
      cameraRef.current.angle += (targetAngle - cameraRef.current.angle) * lerpFactor;
      cameraRef.current.rotateX += (targetRotateX - cameraRef.current.rotateX) * lerpFactor;

      const cam = cameraRef.current;

      // Save context for camera transformation
      ctx.save();
      ctx.translate(width / 2 + cam.x, height / 2 + cam.y);
      ctx.scale(cam.zoom, cam.zoom);

      // Render layers
      if (currentStep.focus === 'stem' || currentStep.focus === 'quiz') {
        // Draw rotating 3D isometric stem
        draw3DStem(ctx, time, cam.angle, cam.rotateX, dayMode);
      } else {
        // Draw microscopic longitudinal simulation view (xylem / phloem / companion cells)
        drawLongitudinalSimulation(ctx, width, height, time, dayMode);
      }

      ctx.restore();

      // Render HUD stats overlay
      drawHUDStats(ctx, width, height, dayMode);

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    // 3D Stem draw logic
    const draw3DStem = (
      ctx: CanvasRenderingContext2D,
      time: number,
      angle: number,
      rotateX: number,
      day: boolean
    ) => {
      const centerX = 0;
      const centerY = 30;
      const rStem = 110;
      const hStem = 160;

      // Scale height based on 3D tilt
      const tiltRad = (rotateX * Math.PI) / 180;
      const cosT = Math.cos(tiltRad);
      const sinT = Math.sin(tiltRad);

      // Colors reflecting light/dark mode
      const colors = {
        bark: day ? '#5C7A58' : '#2A4430',
        barkBorder: day ? '#3B5438' : '#142B1A',
        cortex: day ? '#A7D49B' : '#3E5C38',
        phloem: day ? '#6BB4D6' : '#2B5775',
        cambium: day ? '#10B981' : '#34D399',
        xylem: day ? '#F59E0B' : '#D97706',
        pith: day ? '#F3EACF' : '#2D281D',
        highlight: day ? 'rgba(255,255,255,0.7)' : 'rgba(52, 211, 153, 0.4)',
      };

      // Draw shadow at bottom
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + hStem, rStem, rStem * sinT, 0, 0, Math.PI * 2);
      ctx.fillStyle = day ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.55)';
      ctx.fill();

      // Draw cylinder side/bark
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + hStem, rStem, rStem * sinT, 0, 0, Math.PI, false);
      ctx.lineTo(centerX + rStem, centerY);
      ctx.ellipse(centerX, centerY, rStem, rStem * sinT, 0, 0, Math.PI, true);
      ctx.lineTo(centerX - rStem, centerY + hStem);
      ctx.fillStyle = colors.bark;
      ctx.strokeStyle = colors.barkBorder;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Draw the rotating sliced-wedge inside
      // We will draw the concentric vascular layers
      const layers = [
        { name: 'Epidermis & Cortex', r: 110, fill: colors.cortex, desc: 'Outer protection and tissue support.' },
        { name: 'Phloem', r: 85, fill: colors.phloem, desc: 'Conducts sugars made in leaves bidirectional.' },
        { name: 'Vascular Cambium', r: 70, fill: colors.cambium, strokeOnly: true, desc: 'Active cell divider building new wood.' },
        { name: 'Xylem', r: 64, fill: colors.xylem, desc: 'Dead conduits transporting water under high tension.' },
        { name: 'Central Pith', r: 35, fill: colors.pith, desc: 'Soft storage parenchymal core.' },
      ];

      // Render concentric ellipses
      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, layer.r, layer.r * sinT, 0, 0, Math.PI * 2);
        if (layer.strokeOnly) {
          ctx.strokeStyle = layer.fill;
          ctx.lineWidth = 3;
          ctx.shadowColor = layer.fill;
          ctx.shadowBlur = day ? 4 : 12;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.fillStyle = layer.fill;
          ctx.strokeStyle = day ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
        }
      });

      // Draw vascular bundle wedges radiating outward (pie-slices)
      const numBundles = 10;
      for (let i = 0; i < numBundles; i++) {
        const theta = (i * Math.PI * 2) / numBundles + angle;
        const xOuter = centerX + Math.cos(theta) * 85;
        const yOuter = centerY + Math.sin(theta) * 85 * sinT;
        const xInner = centerX + Math.cos(theta) * 45;
        const yInner = centerY + Math.sin(theta) * 45 * sinT;

        ctx.beginPath();
        ctx.moveTo(xInner, yInner);
        ctx.lineTo(xOuter, yOuter);
        ctx.strokeStyle = day ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw bundle phloem hats
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(theta) * 78, centerY + Math.sin(theta) * 78 * sinT, 5, 0, Math.PI * 2);
        ctx.fillStyle = day ? '#2B7FA6' : '#64B5F6';
        ctx.fill();

        // Draw bundle xylem spots
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(theta) * 54, centerY + Math.sin(theta) * 54 * sinT, 4, 0, Math.PI * 2);
        ctx.fillStyle = day ? '#D97706' : '#FBBF24';
        ctx.fill();
      }

      // 3D Sliced Wedge reveal (Exploded section)
      // Cut out a quadrant of the stem to reveal the longitudinal pipeline inside!
      ctx.save();
      const cutAngle = Math.PI / 4 + angle;
      const xCut1 = centerX + Math.cos(cutAngle) * rStem;
      const yCut1 = centerY + Math.sin(cutAngle) * rStem * sinT;
      const xCut2 = centerX + Math.cos(cutAngle + Math.PI / 2) * rStem;
      const yCut2 = centerY + Math.sin(cutAngle + Math.PI / 2) * rStem * sinT;

      // Draw side walls of the wedge slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(xCut1, yCut1);
      ctx.lineTo(xCut1, yCut1 + hStem);
      ctx.lineTo(centerX, centerY + hStem);
      ctx.closePath();
      ctx.fillStyle = day ? '#EDE8DD' : '#1F2937';
      ctx.fill();
      ctx.strokeStyle = day ? '#D9CDB4' : '#374151';
      ctx.stroke();

      // Show vascular pipes inside the cut walls!
      const wedgePipes = [0.25, 0.5, 0.7, 0.85];
      wedgePipes.forEach((ratio) => {
        const wx = centerX + Math.cos(cutAngle) * rStem * ratio;
        const wy = centerY + Math.sin(cutAngle) * rStem * ratio * sinT;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx, wy + hStem);
        ctx.strokeStyle = ratio > 0.6 ? (day ? '#D97706' : '#FBBF24') : (day ? '#2B7FA6' : '#64B5F6');
        ctx.lineWidth = ratio === 0.7 ? 3 : 1.5;
        ctx.stroke();
      });

      ctx.restore();

      // Top face overlay to give 3D gloss
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rStem, rStem * sinT, 0, 0, Math.PI * 2);
      ctx.strokeStyle = day ? '#D9CDB4' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Simple label indicator of the stem sections on mouse movement or story focus
      ctx.fillStyle = day ? '#1F2937' : '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText("OUTER BARK (EPIDERMIS)", centerX - rStem + 10, centerY - rStem * sinT - 15);
      ctx.fillText("VASCULAR CAMBIUM (DIVIDER)", centerX - 70, centerY + 10);
      ctx.fillText("INTERNAL WOOD (XYLEM)", centerX - 50, centerY + rStem * sinT + 30);
    };

    // Microscopic longitudinal view
    const drawLongitudinalSimulation = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
      day: boolean
    ) => {
      // Draw dual glass tubes
      const hMin = -190;
      const hMax = 190;

      const colors = {
        xylemBg: day ? 'rgba(224, 242, 254, 0.35)' : 'rgba(30, 58, 138, 0.15)',
        xylemBorder: day ? '#60A5FA' : '#3B82F6',
        phloemBg: day ? 'rgba(254, 243, 199, 0.35)' : 'rgba(120, 85, 20, 0.15)',
        phloemBorder: day ? '#F59E0B' : '#D97706',
        text: day ? '#1F2937' : '#9CA3AF',
        gland: day ? '#E5E7EB' : '#1F2937',
        glandText: day ? '#4B5563' : '#E5E7EB',
      };

      // 1. Draw XYLEM tube (Left: centerX = -100 to -40)
      ctx.fillStyle = colors.xylemBg;
      ctx.fillRect(-110, hMin, 50, hMax - hMin);
      ctx.strokeStyle = colors.xylemBorder;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-110, hMin, 50, hMax - hMin);

      // Add spiral cell wall lignin bands in XYLEM
      ctx.strokeStyle = day ? 'rgba(96, 165, 250, 0.45)' : 'rgba(59, 130, 246, 0.35)';
      ctx.lineWidth = 4;
      for (let y = hMin + 15; y < hMax; y += 38) {
        ctx.beginPath();
        ctx.moveTo(-110, y);
        ctx.bezierCurveTo(-90, y + 10, -80, y - 10, -60, y + 5);
        ctx.stroke();
      }

      // 2. Draw PHLOEM tube (Right: centerX = 50 to 110)
      ctx.fillStyle = colors.phloemBg;
      ctx.fillRect(60, hMin, 50, hMax - hMin);
      ctx.strokeStyle = colors.phloemBorder;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(60, hMin, 50, hMax - hMin);

      // Add horizontal porous sieve plates in PHLOEM
      ctx.strokeStyle = colors.phloemBorder;
      ctx.lineWidth = 4.5;
      const sieveYPositions = [hMin + 60, hMin + 180, hMin + 300];
      sieveYPositions.forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(110, y);
        ctx.stroke();

        // Draw sieve plate pores
        ctx.fillStyle = day ? '#FAF8F3' : '#0B0F19';
        for (let px = 67; px < 110; px += 10) {
          ctx.beginPath();
          ctx.arc(px, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Draw COMPANION CELLS tightly coupled to phloem (Far Right: 115 to 150)
      for (let cy = hMin + 10; cy < hMax; cy += 85) {
        ctx.fillStyle = day ? 'rgba(196, 181, 253, 0.5)' : 'rgba(109, 40, 217, 0.25)';
        ctx.strokeStyle = day ? '#8B5CF6' : '#A78BFA';
        ctx.lineWidth = 1.5;
        ctx.fillRect(115, cy, 32, 75);
        ctx.strokeRect(115, cy, 32, 75);

        // Active Companion Cell Nucleus
        ctx.beginPath();
        ctx.arc(131, cy + 37, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = day ? '#6D28D9' : '#C4B5F3';
        ctx.fill();

        // Plasmodesmata tunnels connecting companion cell to phloem sieve elements
        ctx.strokeStyle = day ? 'rgba(139, 92, 246, 0.6)' : 'rgba(167, 139, 250, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(110, cy + 25); ctx.lineTo(115, cy + 25);
        ctx.moveTo(110, cy + 50); ctx.lineTo(115, cy + 50);
        ctx.stroke();
      }

      // 4. Source (Leaf) and Sink (Root) Visual Boxes
      ctx.fillStyle = colors.gland;
      ctx.strokeStyle = day ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;

      // Source label
      ctx.fillRect(110, hMin - 40, 70, 32);
      ctx.strokeRect(110, hMin - 40, 70, 32);
      ctx.fillStyle = colors.glandText;
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText("SOURCE (Leaf)", 116, hMin - 20);

      // Sink label
      ctx.fillStyle = colors.gland;
      ctx.fillRect(110, hMax + 8, 70, 32);
      ctx.strokeRect(110, hMax + 8, 70, 32);
      ctx.fillStyle = colors.glandText;
      ctx.fillText("SINK (Roots)", 118, hMax + 28);

      // Draw active transpiration stomatal opening at top of Xylem
      ctx.fillStyle = day ? '#10B981' : '#34D399';
      ctx.beginPath();
      const stomaGap = Math.max(1, (ratesRef.current.xylem / 100) * 12);
      // Left Guard Cell
      ctx.ellipse(-95 - stomaGap/2, hMin - 20, 8, 14, 0, 0, Math.PI * 2);
      // Right Guard Cell
      ctx.ellipse(-75 + stomaGap/2, hMin - 20, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.text;
      ctx.font = '9px monospace';
      ctx.fillText("STOMATA", -110, hMin - 42);

      // 5. Update and Render Particles
      const activeXylemRate = ratesRef.current.xylem;
      const activePhloemRate = ratesRef.current.phloem;

      particlesRef.current.forEach((p, index) => {
        // Move particle
        if (isPlaying) {
          if (p.type === 'water') {
            // Water rises upwards in xylem (y goes down)
            p.y -= (0.5 + (activeXylemRate / 100) * 3.5) * p.speed;
            // Add a subtle wave lateral motion (cohesion wiggle)
            p.x += Math.sin(time * 3 + p.y * 0.05) * 0.3;

            // Constrain inside xylem tube
            if (p.x < -105) p.x = -105;
            if (p.x > -65) p.x = -65;

            // Recirculate water or trigger transpiration vapor burst at top
            if (p.y < hMin + 5) {
              p.y = hMax - 10;
              p.x = -110 + Math.random() * 50;

              // Spawn tiny evaporative steam/mist particles at stomata
              if (activeXylemRate > 15 && Math.random() > 0.4) {
                spawnTranspirationVapor(-85, hMin - 25);
              }
            }
          } else if (p.type === 'sugar') {
            // Sugars flow downwards in phloem
            p.y += (0.4 + (activePhloemRate / 100) * 3.0) * p.speed;
            p.x += Math.sin(time * 2 + p.y * 0.04) * 0.25;

            // Constrain inside phloem tube
            if (p.x < 65) p.x = 65;
            if (p.x > 105) p.x = 105;

            // At bottom of phloem (sink), trigger unloading and recycle water
            if (p.y > hMax - 10) {
              p.y = hMin + 15;
              p.x = 65 + Math.random() * 40;

              // Spawn osmosis recycle particle traveling back to xylem
              if (Math.random() > 0.5) {
                spawnOsmoticRecycle('osmosis_to_xylem', hMax - 20);
              }
            }
          } else if (p.type === 'osmosis_to_phloem') {
            // Water flowing from xylem to phloem at source
            p.x += p.speed * 1.5;
            if (p.x >= 70) {
              // transformed into standard phloem sap
              p.type = 'sugar';
              p.color = '#FBBF24';
            }
          } else if (p.type === 'osmosis_to_xylem') {
            // Water flowing from phloem back to xylem at sink
            p.x -= p.speed * 1.5;
            if (p.x <= -70) {
              // transformed back to xylem water
              p.type = 'water';
              p.color = '#34D399';
            }
          } else if (p.type === 'steam') {
            // Evaporated steam rising and fading out
            p.y -= p.speed * 0.8;
            p.x += (Math.random() - 0.5) * 0.9;
            p.alpha -= p.decay || 0.03;
          }
        }

        // Draw particle with glowing shadows in dark mode
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (!day) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.type === 'sugar' ? 8 : 4;
        }

        if (p.type === 'sugar') {
          // Draw hex sugar molecule
          drawHexagon(ctx, p.x, p.y, p.size);
        } else {
          // Draw smooth water bubble
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Filter out faded/dead steam particles
      particlesRef.current = particlesRef.current.filter((p) => p.type !== 'steam' || p.alpha > 0);

      // Periodically trigger active companion loading osmosis bridge
      if (isPlaying && Math.random() < 0.05 && activePhloemRate > 25) {
        spawnOsmoticRecycle('osmosis_to_phloem', hMin + 45);
      }

      // Evaporative steam helper
      function spawnTranspirationVapor(x: number, y: number) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y,
          speed: 0.6 + Math.random() * 0.8,
          size: 1.5 + Math.random() * 2,
          alpha: 0.8,
          color: day ? 'rgba(96, 165, 250, 0.7)' : 'rgba(52, 211, 153, 0.8)',
          type: 'steam',
          decay: 0.02 + Math.random() * 0.03,
          progress: 0,
        });
      }

      // Osmosis helper
      function spawnOsmoticRecycle(type: 'osmosis_to_phloem' | 'osmosis_to_xylem', yOffset: number) {
        particlesRef.current.push({
          x: type === 'osmosis_to_phloem' ? -60 : 60,
          y: yOffset + (Math.random() - 0.5) * 20,
          speed: 0.8 + Math.random() * 1.0,
          size: 2.5,
          alpha: 1.0,
          color: type === 'osmosis_to_phloem' ? '#10B981' : '#60A5FA',
          type: type,
          progress: 0,
        });
      }

      // Floating labels in microscopic view
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 11px monospace';
      ctx.fillText("XYLEM COLUMN", -110, hMax + 20);
      ctx.fillText("PHLOEM COLUMN", 60, hMax + 20);
      ctx.fillText("COMPANION CELLS", 112, hMin - 5);

      // Highlight the active focused transport mechanics
      if (currentStep.focus === 'transpiration') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-120, hMin - 50, 75, 75);
        ctx.fillStyle = colors.text;
        ctx.font = '8px monospace';
        ctx.fillText("FOCUS: TRANSIPIRATION PULL", -120, hMin - 55);
      } else if (currentStep.focus === 'translocation') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(52, hMin + 5, 105, 85);
        ctx.fillStyle = colors.text;
        ctx.font = '8px monospace';
        ctx.fillText("FOCUS: PRESSURE-FLOW LOADING", 52, hMin - 2);
      }
    };

    // Helper to draw hexagon (sucrose molecule)
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    };

    // Render Stats and diagnostic data directly into HUD overlay
    const drawHUDStats = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      day: boolean
    ) => {
      ctx.save();
      ctx.fillStyle = day ? '#2B2118' : '#FFFFFF';
      ctx.font = '10px monospace';

      // Title HUD indicators
      const stateLabel = isPlaying ? "● SIMULATION RUNNING" : "|| SIMULATION PAUSED";
      ctx.fillText(stateLabel, 16, 24);

      // Flow speed indicators calculated dynamically
      const xyFlowSpeed = (0.2 + (ratesRef.current.xylem / 100) * 4.2).toFixed(2);
      const phFlowSpeed = (0.1 + (ratesRef.current.phloem / 100) * 2.8).toFixed(2);

      ctx.fillText(`Xylem Flow : ${xyFlowSpeed} mm/s`, 16, 42);
      ctx.fillText(`Phloem Flow: ${phFlowSpeed} mm/s`, 16, 54);

      if (triggerPulse) {
        ctx.fillStyle = '#FBBF24';
        ctx.fillText("ACTIVE TRANS-VESSEL LOADING", 16, 72);
      }
      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [dayMode, currentStep, isPlaying]);

  return (
    <div id="visualizer-container" className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
      {/* HUD Header Bar */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setDayMode(!dayMode)}
          id="toggle-lighting-btn"
          className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg active:scale-95"
          title={dayMode ? 'Switch to Bioluminescent Dark Theme' : 'Switch to Archival Light Theme'}
        >
          {dayMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          id="toggle-playback-btn"
          className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg active:scale-95"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Canvas Node */}
      <div className="flex-1 w-full h-[400px] min-h-[380px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Dynamic environmental warning tag */}
        <div className="absolute bottom-4 left-4 z-10 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white max-w-[85%] shadow-xl">
          <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <Info className="w-3 h-3 text-emerald-400" />
            <span>HYDRAULIC ECOSYSTEM STATUS</span>
          </p>
          <p className="text-xs text-slate-200 mt-1 line-clamp-2">
            {currentStep.focus === 'stem'
              ? 'Isometric 3D Cross-section: Epidermis cortex enclosing distinct vascular bundles.'
              : currentStep.focus === 'xylem' || currentStep.focus === 'transpiration'
              ? `Transpiration Pull is high at ${xylemVal}%. Low-friction hollow vessels carry water up.`
              : `Active sucrose loading reaches ${phylemVal}%. Munch pressure pushes sap to root sinks.`}
          </p>
        </div>
      </div>

      {/* Simulation Controls Dashboard */}
      <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
          <span className="text-xs font-mono font-bold text-slate-400">BIOLOGICAL SLIDERS</span>
          <button
            onClick={handleSugarPulse}
            id="sugar-pulse-btn"
            className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            Trigger Sugar Pulse
          </button>
        </div>

        <div className="space-y-4">
          {/* Slider 1: Xylem / Stomata */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Stomatal Aperture (Transpiration)
              </span>
              <span className="text-emerald-400 font-bold">{xylemVal}%</span>
            </div>
            <input
              type="range"
              id="stomata-slider"
              min="0"
              max="100"
              value={xylemVal}
              onChange={(e) => setXylemVal(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Stomata Closed</span>
              <span>Maximum Evaporative Pull</span>
            </div>
          </div>

          {/* Slider 2: Phloem / Sugar Loading */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Companion Cell Sucrose Loading
              </span>
              <span className="text-amber-400 font-bold">{phylemVal}%</span>
            </div>
            <input
              type="range"
              id="sugar-slider"
              min="0"
              max="100"
              value={phylemVal}
              onChange={(e) => setPhylemVal(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>No Loading</span>
              <span>High Turgor Pressure Gradient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
