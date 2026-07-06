/* ============================================================
   KINETIC FINANCE — Main Engine
   "Soft Light & Glass" Edition
   Lenis smooth scroll · GSAP marquee · Three.js Refractive Glass
   ============================================================ */

import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

// ── Reduced Motion Check ────────────────────────────────────
const prefersReducedMotion: boolean = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ══════════════════════════════════════════════════════════════
// 1. LENIS SMOOTH SCROLL
// ══════════════════════════════════════════════════════════════

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
} as ConstructorParameters<typeof Lenis>[0]);

// Bind Lenis to GSAP ticker for frame-perfect sync
gsap.ticker.add((time: number) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ══════════════════════════════════════════════════════════════
// 2. CSS MARQUEE — Replaced GSAP with pure CSS keyframes
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// 3. UI INTERACTIONS — Luxury Animations
// ══════════════════════════════════════════════════════════════

if (!prefersReducedMotion) {
  // Staggered text reveal
  const heroWords = document.querySelectorAll<HTMLElement>(".hero-word");
  heroWords.forEach((word, index) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        word.classList.add("visible");
      });
    }, index * 200 + 100); // 200ms stagger between words, with initial 100ms delay
  });

  // Magnetic Menu
  const menuText = document.getElementById("menu-text");
  const menuBtn = document.getElementById("menu-btn");

  if (menuText && menuBtn) {
    const magneticZone = 120; // Activation distance

    document.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = menuBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < magneticZone) {
        // We're close enough! Pull the text towards the mouse
        const pullX = deltaX * 0.15;
        const pullY = deltaY * 0.15;

        menuText.style.transform = `translate(${pullX}px, ${pullY}px)`;
        menuText.style.transition = "transform 0.1s linear";
      } else {
        // Snap back
        menuText.style.transform = `translate(0px, 0px)`;
        menuText.style.transition = "transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
      }
    }, { passive: true });
  }

  // Overlay Menu Toggle
  const menuBtnLocal = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-menu');
  const overlay = document.getElementById('overlay-menu');
  if (menuBtnLocal && overlay) {
    menuBtnLocal.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    }
    
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => overlay.classList.remove('active'));
    });
  }

  // Reveal On Scroll Observer
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ══════════════════════════════════════════════════════════════
// 4. THREE.JS WEBGL SCENE — Refractive Glass Engine
// ══════════════════════════════════════════════════════════════

const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;

if (canvas) {
  // ── Mouse tracking (normalized -1 to +1) ────────────────────
  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };

  window.addEventListener(
    "mousemove",
    (event: MouseEvent) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );

  // ── Renderer — Glass needs antialiasing and tone mapping ────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // ── Scene ───────────────────────────────────────────────────
  const scene = new THREE.Scene();

  // ── Camera ──────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 6.5);
  camera.lookAt(0, 0, 0);

  // ── Geometry & Material (Topographic Data Wave) ───────────────────────
  const segments = 200;
  const width = 70;
  const depth = 70;

  const positions = new Float32Array(segments * segments * 3);
  const colors = new Float32Array(segments * segments * 3);

  const colorBase = new THREE.Color('#0B2B5E');
  const colorHighlight = new THREE.Color('#C5A059');

  let idx = 0;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const x = (i / segments - 0.5) * width;
      const z = (j / segments - 0.5) * depth;
      const y = 0; // will be dynamically updated in tick()

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      // Assign random 8% to Champagne Gold highlight
      const isGold = Math.random() < 0.08;
      const color = isGold ? colorHighlight : colorBase;

      colors[idx * 3] = color.r;
      colors[idx * 3 + 1] = color.g;
      colors[idx * 3 + 2] = color.b;

      idx++;
    }
  }

  const waveGeometry = new THREE.BufferGeometry();
  waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const waveMaterial = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true
  });

  const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
  const waveGroup = new THREE.Group();
  // Add a slight initial tilt for better perspective
  waveGroup.rotation.x = Math.PI * 0.1;
  waveGroup.add(wavePoints);
  scene.add(waveGroup);

  // ── Clock ───────────────────────────────────────────────────
  const clock = new THREE.Clock();


  // ── Render Loop ─────────────────────────────────────────────
  function tick(): void {
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse lerp for fluid interaction
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Topographic Wave Animation
    const positionsAttr = waveGeometry.attributes.position;
    if (positionsAttr) {
      const array = positionsAttr.array as Float32Array;
      let idxAttr = 0;

      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
          const x = (i / segments - 0.5) * width;
          const z = (j / segments - 0.5) * depth;

          // Overlapping sine and cosine functions modulated by time
          const y = Math.sin(x * 0.6 + elapsedTime) * Math.cos(z * 0.5 + elapsedTime * 0.8) * 0.4
            + Math.sin(x * 0.3 - elapsedTime * 0.5) * 0.2;

          array[idxAttr * 3 + 1] = y;
          idxAttr++;
        }
      }
      positionsAttr.needsUpdate = true;
    }

    // Parallax Shift & Subtle Tilt based on cursor
    const parallaxX = -mouse.x * 1.5;
    const parallaxY = -mouse.y * 1.5;

    // Tilt the wave based on mouse position
    waveGroup.rotation.y = THREE.MathUtils.lerp(waveGroup.rotation.y, mouse.x * 0.2, 0.05);
    waveGroup.rotation.x = THREE.MathUtils.lerp(waveGroup.rotation.x, Math.PI * 0.1 - mouse.y * 0.1, 0.05);

    // Shift position slightly
    waveGroup.position.x = THREE.MathUtils.lerp(waveGroup.position.x, parallaxX, 0.05);
    waveGroup.position.y = THREE.MathUtils.lerp(waveGroup.position.y, parallaxY, 0.05);

    // Scroll Parallax (Scale based on scroll)
    const scrollY = window.scrollY;
    const scale = 1 + scrollY * 0.001;
    waveGroup.scale.set(scale, scale, scale);

    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      requestAnimationFrame(tick);
    }
  }

  // Start the loop only if motion is allowed; otherwise render once
  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    tick();
  }

  // ══════════════════════════════════════════════════════════════
  // 5. RESIZE HANDLER
  // ══════════════════════════════════════════════════════════════

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    { passive: true }
  );
}

// Mobile Overlay Menu Logic
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-menu');
  const overlay = document.getElementById('overlay-menu');
  
  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
    });
  }
  
  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.remove('active');
    });
  }
  
  if (overlay) {
    const links = overlay.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('active');
      });
    });
  }
});
