import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { ProductId } from "@/lib/store";

/**
 * Product stage for "The OG Store": one sculpted object per service on a lit turntable,
 * like a high-end product page. Objects swap with a spin-and-scale transition; the
 * visitor can drag to turn the object, and it leans toward the cursor.
 */
export type StoreHandle = { dispose: () => void; show: (id: ProductId) => void };

const BRAND = 0x12d6f8, AZURE = 0x1d6dff, ICE = 0xa1c1fa, PAPER = 0xf2f6ff;

function starShape(r = 1, inner = 0.26) {
  // the four-point sparkle used across the brand
  const s = new THREE.Shape();
  const pts = 8;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2 + Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * inner;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if (i === 0) s.moveTo(x, y);
    else {
      // curved inner edges for a softer sparkle
      const pa = ((i - 0.5) / pts) * Math.PI * 2 + Math.PI / 2;
      s.quadraticCurveTo(Math.cos(pa) * r * inner * 0.9, Math.sin(pa) * r * inner * 0.9, x, y);
    }
  }
  return s;
}

function shieldShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 1.15);
  s.bezierCurveTo(0.45, 0.95, 0.75, 0.95, 0.95, 0.9);
  s.bezierCurveTo(0.95, 0.1, 0.75, -0.65, 0, -1.15);
  s.bezierCurveTo(-0.75, -0.65, -0.95, 0.1, -0.95, 0.9);
  s.bezierCurveTo(-0.75, 0.95, -0.45, 0.95, 0, 1.15);
  return s;
}

function pageTexture() {
  const c = document.createElement("canvas");
  c.width = 640; c.height = 400;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 640, 400);
  bg.addColorStop(0, "#0c1a4a"); bg.addColorStop(1, "#071134");
  g.fillStyle = bg; g.fillRect(0, 0, 640, 400);
  g.fillStyle = "#12d6f8"; g.beginPath(); g.roundRect(30, 28, 70, 14, 7); g.fill();
  g.fillStyle = "rgba(242,246,255,0.3)";
  [380, 440, 500].forEach((x) => { g.beginPath(); g.roundRect(x, 31, 40, 8, 4); g.fill(); });
  g.fillStyle = "#f2f6ff"; g.beginPath(); g.roundRect(30, 90, 300, 26, 6); g.fill();
  const gr = g.createLinearGradient(30, 0, 280, 0); gr.addColorStop(0, "#12d6f8"); gr.addColorStop(1, "#1d6dff");
  g.fillStyle = gr; g.beginPath(); g.roundRect(30, 126, 230, 26, 6); g.fill();
  g.fillStyle = "rgba(242,246,255,0.3)"; g.beginPath(); g.roundRect(30, 170, 260, 9, 4); g.fill(); g.beginPath(); g.roundRect(30, 186, 200, 9, 4); g.fill();
  g.fillStyle = "#12d6f8"; g.beginPath(); g.roundRect(30, 215, 120, 34, 17); g.fill();
  g.fillStyle = "rgba(255,255,255,0.06)"; g.beginPath(); g.roundRect(360, 80, 250, 180, 14); g.fill();
  g.strokeStyle = "#12d6f8"; g.lineWidth = 4; g.beginPath();
  [0.2, 0.35, 0.3, 0.5, 0.45, 0.7, 0.85].forEach((v, i) => { const x = 380 + i * 35, y = 240 - v * 140; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
  g.stroke();
  for (let i = 0; i < 3; i++) { g.fillStyle = "rgba(255,255,255,0.05)"; g.beginPath(); g.roundRect(30 + i * 200, 290, 180, 90, 12); g.fill(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function mountStoreScene(canvas: HTMLCanvasElement, initial: ProductId): StoreHandle {
  const small = canvas.clientWidth < 600;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 1.1, 7);
  camera.lookAt(0, 0.15, 0);

  const key = new THREE.SpotLight(0xffffff, 60, 20, 0.5, 0.6);
  key.position.set(2.5, 6, 4);
  scene.add(key);
  const rimA = new THREE.PointLight(BRAND, 22, 10); rimA.position.set(-3, 1.5, -1.5); scene.add(rimA);
  const rimB = new THREE.PointLight(AZURE, 30, 10); rimB.position.set(3, 0.5, -2); scene.add(rimB);

  const disposables: { dispose: () => void }[] = [env, pmrem];
  const T = <X extends { dispose: () => void }>(x: X) => (disposables.push(x), x);

  /* ---------- Materials ---------- */
  const chrome = T(new THREE.MeshPhysicalMaterial({ color: 0xdfe8ff, metalness: 1, roughness: 0.12, clearcoat: 1 }));
  const azureMetal = T(new THREE.MeshPhysicalMaterial({ color: AZURE, metalness: 0.75, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1 }));
  const brandGlow = T(new THREE.MeshStandardMaterial({ color: BRAND, emissive: BRAND, emissiveIntensity: 1.4, toneMapped: false }));
  // phones: fake glass (no transmission pass); desktop: real refraction
  const glass = T(small
    ? new THREE.MeshPhysicalMaterial({ color: 0xbfe9ff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false })
    : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.9, ior: 1.45, iridescence: 0.7, clearcoat: 1 }));
  const ink = T(new THREE.MeshPhysicalMaterial({ color: 0x0c1a4a, metalness: 0.6, roughness: 0.3, clearcoat: 1 }));
  const bevel = { bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6, curveSegments: 32 };

  /* ---------- Objects ---------- */
  const objects = {} as Record<ProductId, THREE.Group>;
  const spinners: THREE.Object3D[] = [];

  // Website: stacked browser panes
  {
    const g = new THREE.Group();
    const tex = T(pageTexture());
    for (let i = 0; i < 3; i++) {
      const pane = new THREE.Mesh(T(new RoundedBoxGeometry(2.3, 1.45, 0.06, 4, 0.05)), i === 0 ? ink : glass);
      pane.position.set(i * 0.28 - 0.28, i * 0.22 - 0.1, -i * 0.42);
      g.add(pane);
      if (i === 0) {
        const screen = new THREE.Mesh(T(new THREE.PlaneGeometry(2.18, 1.33)), T(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
        screen.position.set(pane.position.x, pane.position.y, pane.position.z + 0.032);
        g.add(screen);
      }
    }
    g.rotation.y = -0.35;
    objects.website = g;
  }
  // Brand: chrome sparkle with an orbit ring
  {
    const g = new THREE.Group();
    const geo = T(new THREE.ExtrudeGeometry(starShape(1.05), { depth: 0.22, ...bevel }));
    geo.center();
    g.add(new THREE.Mesh(geo, chrome));
    const ring = new THREE.Mesh(T(new THREE.TorusGeometry(1.45, 0.03, 16, 128)), brandGlow);
    ring.rotation.x = 1.2;
    g.add(ring);
    spinners.push(ring);
    objects.brand = g;
  }
  // SEO: magnifier
  {
    const g = new THREE.Group();
    const rim = new THREE.Mesh(T(new THREE.TorusGeometry(0.72, 0.12, 32, 96)), azureMetal);
    g.add(rim);
    const lens = new THREE.Mesh(T(new THREE.CylinderGeometry(0.66, 0.66, 0.08, 64)), glass);
    lens.rotation.x = Math.PI / 2;
    g.add(lens);
    const handle = new THREE.Mesh(T(new RoundedBoxGeometry(0.26, 1.1, 0.26, 3, 0.1)), chrome);
    handle.position.set(0.78, -0.95, 0);
    handle.rotation.z = 0.72;
    g.add(handle);
    // tiny rising bars seen through the lens
    [0.25, 0.45, 0.7].forEach((h, i) => {
      const b = new THREE.Mesh(T(new RoundedBoxGeometry(0.14, h, 0.14, 2, 0.04)), brandGlow);
      b.position.set(-0.25 + i * 0.25, -0.35 + h / 2, -0.15);
      g.add(b);
    });
    g.position.set(-0.2, 0.25, 0);
    objects.seo = g;
  }
  // AI visibility: glass orb with a glowing core and orbiting sparkles
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(T(new THREE.SphereGeometry(1, 64, 64)), glass));
    const core = new THREE.Mesh(T(new THREE.IcosahedronGeometry(0.42, 1)), T(new THREE.MeshStandardMaterial({ color: BRAND, emissive: BRAND, emissiveIntensity: 0.9, flatShading: true, metalness: 0.4, roughness: 0.2 })));
    g.add(core);
    spinners.push(core);
    const sg = T(new THREE.ExtrudeGeometry(starShape(0.16), { depth: 0.04, ...bevel, bevelSize: 0.02, bevelThickness: 0.02 }));
    sg.center();
    const orbit = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(sg, i === 1 ? brandGlow : chrome);
      const a = (i / 3) * Math.PI * 2;
      s.position.set(Math.cos(a) * 1.45, Math.sin(a * 2) * 0.3, Math.sin(a) * 1.45);
      orbit.add(s);
    }
    g.add(orbit);
    spinners.push(orbit);
    objects.ai = g;
  }
  // Ads: target with an arrow
  {
    const g = new THREE.Group();
    [1.05, 0.72, 0.4].forEach((r, i) => {
      const t = new THREE.Mesh(T(new THREE.TorusGeometry(r, 0.1, 24, 96)), i === 1 ? brandGlow : i === 0 ? azureMetal : chrome);
      g.add(t);
    });
    const bull = new THREE.Mesh(T(new THREE.SphereGeometry(0.16, 32, 32)), brandGlow);
    g.add(bull);
    const arrow = new THREE.Group();
    const shaft = new THREE.Mesh(T(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 16)), chrome);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.8;
    arrow.add(shaft);
    const fl = T(new THREE.ConeGeometry(0.16, 0.34, 4));
    for (let i = 0; i < 2; i++) {
      const f = new THREE.Mesh(fl, azureMetal);
      f.rotation.x = -Math.PI / 2;
      f.rotation.y = (i * Math.PI) / 2;
      f.scale.set(1, 1, 0.15);
      f.position.z = 1.55;
      arrow.add(f);
    }
    arrow.rotation.set(-0.35, 0.55, 0);
    g.add(arrow);
    g.rotation.y = -0.35;
    objects.ads = g;
  }
  // Care & Fix: shield with a check
  {
    const g = new THREE.Group();
    const geo = T(new THREE.ExtrudeGeometry(shieldShape(), { depth: 0.24, ...bevel }));
    geo.center();
    g.add(new THREE.Mesh(geo, azureMetal));
    const inner = T(new THREE.ExtrudeGeometry(shieldShape(), { depth: 0.05, ...bevel, bevelSize: 0.02, bevelThickness: 0.02 }));
    inner.center();
    const im = new THREE.Mesh(inner, chrome);
    im.scale.setScalar(0.8);
    im.position.z = 0.17;
    g.add(im);
    const check = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.38, 0.02, 0), new THREE.Vector3(-0.1, -0.28, 0), new THREE.Vector3(0.42, 0.32, 0)], false, "catmullrom", 0.1);
    const cm = new THREE.Mesh(T(new THREE.TubeGeometry(check, 48, 0.085, 16, false)), brandGlow);
    cm.position.z = 0.3;
    g.add(cm);
    objects.care = g;
  }

  const stage = new THREE.Group();
  scene.add(stage);
  (Object.keys(objects) as ProductId[]).forEach((k) => {
    const o = objects[k];
    const holder = new THREE.Group();
    holder.add(o);
    holder.visible = false;
    holder.position.y = 0.55;
    o.scale.multiplyScalar(1.12);
    holder.userData.id = k;
    stage.add(holder);
    objects[k] = holder;
  });

  /* ---------- Pedestal ---------- */
  const ped = new THREE.Mesh(T(new THREE.CylinderGeometry(1.7, 1.85, 0.32, 96)), T(new THREE.MeshPhysicalMaterial({ color: 0x050b22, metalness: 0.35, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.35 })));
  ped.position.y = -1.05;
  scene.add(ped);
  const glowRing = new THREE.Mesh(T(new THREE.TorusGeometry(1.78, 0.018, 12, 160)), brandGlow);
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = -0.88;
  scene.add(glowRing);
  // soft halo on the floor
  const hc = document.createElement("canvas");
  hc.width = hc.height = 128;
  const hg = hc.getContext("2d")!;
  const rg = hg.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, "rgba(18,214,248,0.55)"); rg.addColorStop(1, "rgba(18,214,248,0)");
  hg.fillStyle = rg; hg.fillRect(0, 0, 128, 128);
  const halo = new THREE.Mesh(T(new THREE.PlaneGeometry(6, 6)), T(new THREE.MeshBasicMaterial({ map: T(new THREE.CanvasTexture(hc)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -1.22;
  scene.add(halo);
  // light beam from above
  const beam = new THREE.Mesh(T(new THREE.CylinderGeometry(0.9, 1.75, 4.5, 64, 1, true)), T(new THREE.MeshBasicMaterial({ color: ICE, transparent: true, opacity: 0.045, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })));
  beam.position.y = 1.3;
  scene.add(beam);
  // dust
  const dn = 120, dp = new Float32Array(dn * 3);
  for (let i = 0; i < dn; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 1.6; dp[i * 3] = Math.cos(a) * r; dp[i * 3 + 1] = Math.random() * 4 - 0.9; dp[i * 3 + 2] = Math.sin(a) * r; }
  const dg = T(new THREE.BufferGeometry());
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, T(new THREE.PointsMaterial({ color: PAPER, size: 0.02, transparent: true, opacity: 0.6, depthWrite: false })));
  scene.add(dust);

  /* ---------- Transition state ---------- */
  let current: THREE.Group | null = null;
  let leaving: THREE.Group | null = null;
  let tIn = 1, tOut = 1;
  const show = (id: ProductId) => {
    const next = objects[id];
    if (!next || next === current) return;
    if (leaving) leaving.visible = false;
    leaving = current;
    tOut = 0;
    current = next;
    current.visible = true;
    tIn = 0;
    turn = 0;
  };

  /* ---------- Interaction ---------- */
  let turn = 0, turnVel = 0, dragging = false, lastX = 0;
  const lean = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    lean.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    lean.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (dragging) { turnVel = (e.clientX - lastX) * 0.012; turn += turnVel; lastX = e.clientX; }
  };
  const onUp = () => { dragging = false; };
  const onLeave = () => { lean.x = lean.y = 0; dragging = false; };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 0.9 ? 9 : camera.aspect > 1.6 ? 6.6 : 7.2;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, x), 4);
  const clock = new THREE.Clock();
  let raf = 0, visible = true;
  const tick = () => {
    const dt = Math.min(0.05, clock.getDelta());
    const t = clock.elapsedTime;
    tIn = Math.min(1, tIn + dt * 1.6);
    tOut = Math.min(1, tOut + dt * 2.6);
    if (!dragging) { turnVel *= 0.94; turn += turnVel; turn *= 0.985; }

    if (leaving) {
      const k = ease(tOut);
      leaving.scale.setScalar(Math.max(0.001, 1 - k));
      leaving.rotation.y += dt * 6;
      leaving.position.y = 0.55 + k * 0.8;
      if (tOut >= 1) { leaving.visible = false; leaving = null; }
    }
    if (current) {
      const k = ease(tIn);
      current.scale.setScalar(Math.max(0.001, 0.2 + k * 0.8));
      current.position.y = 0.55 - (1 - k) * 0.9 + Math.sin(t * 1.2) * 0.06;
      const spinIn = (1 - k) * Math.PI * 1.5;
      // showcase sway (flat objects never turn edge-on) + drag + cursor lean
      current.rotation.y += ((Math.sin(t * 0.55) * 0.55 + turn + lean.x * 0.35 - spinIn) - current.rotation.y) * 0.12;
      current.rotation.x += (lean.y * 0.18 - current.rotation.x) * 0.08;
    }
    spinners.forEach((s, i) => { s.rotation.y = t * (0.6 + i * 0.2); s.rotation.z = Math.sin(t * 0.5 + i) * 0.2; });
    glowRing.scale.setScalar(1 + Math.sin(t * 2) * 0.008);
    dust.rotation.y = t * 0.05;
    ped.rotation.y = t * 0.1;

    renderer.render(scene, camera);
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => { cancelAnimationFrame(raf); clock.getDelta(); raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible) start(); };
  document.addEventListener("visibilitychange", onVis);
  show(initial);
  tIn = 0.3;
  start();

  return {
    show,
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
