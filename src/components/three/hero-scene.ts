import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Hero WebGL scene: a real 3D laptop whose screen builds a website live (Build),
 * a rising glass bar chart (Grow), a "98" performance badge and an AI-citation card,
 * plus glass shapes orbiting the set. Mouse tilts the whole set, drag spins it,
 * scroll closes the lid and pulls the camera back.
 *
 * Plain three.js (no React renderer) so the chunk stays small. Loaded on demand.
 */

const C = {
  ink: 0x030820,
  ink2: 0x071134,
  brand: 0x12d6f8,
  azure: 0x1d6dff,
  ice: 0xa1c1fa,
  paper: 0xf2f6ff,
};

export type HeroSceneHandle = { dispose: () => void; setScroll: (p: number) => void };

/* ---------- Screen: a canvas texture that "builds" a website in a loop ---------- */
function makeScreen() {
  const W = 1024, H = 640;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d")!;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
  };
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  // deterministic "traffic" series
  const pts = Array.from({ length: 24 }, (_, i) => 0.15 + (i / 23) * 0.7 + Math.sin(i * 1.7) * 0.06);

  const draw = (time: number) => {
    const cycle = 9; // seconds
    const t = (time % cycle) / cycle; // 0..1
    const k = (a: number, b: number) => ease((t - a) / (b - a)); // stage progress
    const out = t > 0.92 ? 1 - (t - 0.92) / 0.08 : 1; // fade out at loop end

    // background
    const bg = g.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#071134");
    bg.addColorStop(1, "#030820");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    // browser chrome
    g.fillStyle = "#0c1a4a";
    g.fillRect(0, 0, W, 54);
    ["#ff5c39", "#12d6f8", "#1d6dff"].forEach((c, i) => {
      g.fillStyle = c;
      g.beginPath(); g.arc(30 + i * 26, 27, 8, 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = "rgba(255,255,255,0.08)";
    rr(130, 14, 520, 26, 13); g.fill();
    g.fillStyle = "rgba(242,246,255,0.7)";
    g.font = "500 16px system-ui, sans-serif";
    g.fillText("yourbrand.com", 150, 33);

    g.globalAlpha = out;
    // nav
    const n = k(0.02, 0.12);
    g.fillStyle = "#12d6f8";
    rr(40, 80, 110 * n, 22, 11); g.fill();
    g.fillStyle = "rgba(242,246,255,0.35)";
    for (let i = 0; i < 4; i++) { rr(560 + i * 90, 86, 64 * n, 10, 5); g.fill(); }
    g.fillStyle = "#1d6dff";
    rr(W - 150, 78, 110 * n, 28, 14); g.fill();

    // headline blocks
    const h1 = k(0.1, 0.25), h2 = k(0.16, 0.3), h3 = k(0.22, 0.36);
    g.fillStyle = "#f2f6ff";
    rr(40, 150, 420 * h1, 34, 8); g.fill();
    const grad = g.createLinearGradient(40, 0, 420, 0);
    grad.addColorStop(0, "#12d6f8"); grad.addColorStop(1, "#1d6dff");
    g.fillStyle = grad;
    rr(40, 196, 330 * h2, 34, 8); g.fill();
    g.fillStyle = "rgba(242,246,255,0.35)";
    rr(40, 250, 380 * h3, 12, 6); g.fill();
    rr(40, 272, 300 * h3, 12, 6); g.fill();
    // CTA
    const cta = k(0.3, 0.42);
    g.fillStyle = "#12d6f8";
    rr(40, 310, 170 * cta, 46, 23); g.fill();
    if (cta > 0.9) {
      g.fillStyle = "#030820";
      g.font = "700 17px system-ui, sans-serif";
      g.fillText("Get started →", 62, 339);
    }

    // chart card
    const card = k(0.34, 0.48);
    g.save();
    g.globalAlpha = out * card;
    g.fillStyle = "rgba(255,255,255,0.05)";
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.lineWidth = 2;
    rr(540, 140, 440, 260, 18); g.fill(); g.stroke();
    g.fillStyle = "rgba(242,246,255,0.6)";
    g.font = "600 16px system-ui, sans-serif";
    g.fillText("Organic traffic", 566, 178);
    g.fillStyle = "#12d6f8";
    g.fillText("▲ 212%", 890, 178);
    // line
    const lp = k(0.44, 0.7);
    const X = (i: number) => 566 + (i / 23) * 390;
    const Y = (v: number) => 380 - v * 170;
    const last = Math.max(1, Math.floor(lp * 23));
    const area = g.createLinearGradient(0, 200, 0, 380);
    area.addColorStop(0, "rgba(18,214,248,0.45)"); area.addColorStop(1, "rgba(18,214,248,0)");
    g.beginPath(); g.moveTo(X(0), 380);
    for (let i = 0; i <= last; i++) g.lineTo(X(i), Y(pts[i]));
    g.lineTo(X(last), 380); g.closePath();
    g.fillStyle = area; g.fill();
    g.beginPath();
    for (let i = 0; i <= last; i++) (i ? g.lineTo : g.moveTo).call(g, X(i), Y(pts[i]));
    g.strokeStyle = "#12d6f8"; g.lineWidth = 4; g.lineJoin = "round"; g.stroke();
    g.fillStyle = "#f2f6ff";
    g.beginPath(); g.arc(X(last), Y(pts[last]), 7, 0, Math.PI * 2); g.fill();
    g.restore();

    // feature tiles
    for (let i = 0; i < 3; i++) {
      const f = k(0.5 + i * 0.05, 0.62 + i * 0.05);
      g.fillStyle = `rgba(255,255,255,${0.05 * f})`;
      rr(40 + i * 320, 440 + (1 - f) * 30, 300, 150, 16); g.fill();
      g.fillStyle = ["#12d6f8", "#1d6dff", "#a1c1fa"][i];
      g.globalAlpha = out * f;
      rr(64 + i * 320, 466 + (1 - f) * 30, 40, 40, 10); g.fill();
      g.fillStyle = "rgba(242,246,255,0.5)";
      rr(64 + i * 320, 528 + (1 - f) * 30, 200, 10, 5); g.fill();
      rr(64 + i * 320, 548 + (1 - f) * 30, 150, 10, 5); g.fill();
      g.globalAlpha = out;
    }
    g.globalAlpha = 1;

    // blinking build cursor
    if (t < 0.4 && Math.floor(time * 2.5) % 2 === 0) {
      g.fillStyle = "#12d6f8";
      g.fillRect(40 + 420 * h1 + 6, 150, 4, 34);
    }
    tex.needsUpdate = true;
  };
  return { tex, draw };
}

/* ---------- Small canvas-texture cards ---------- */
function cardTexture(kind: "score" | "ai" | "fix") {
  const W = 512, H = kind === "score" ? 512 : 256;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = "rgba(7,17,52,0.92)";
  g.strokeStyle = "rgba(161,193,250,0.35)";
  g.lineWidth = 4;
  g.beginPath(); g.roundRect(4, 4, W - 8, H - 8, 48); g.fill(); g.stroke();
  if (kind === "score") {
    g.lineWidth = 26; g.lineCap = "round";
    g.strokeStyle = "rgba(255,255,255,0.08)";
    g.beginPath(); g.arc(256, 230, 140, 0, Math.PI * 2); g.stroke();
    const grad = g.createLinearGradient(100, 0, 400, 0);
    grad.addColorStop(0, "#12d6f8"); grad.addColorStop(1, "#1d6dff");
    g.strokeStyle = grad;
    g.beginPath(); g.arc(256, 230, 140, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.98); g.stroke();
    g.fillStyle = "#f2f6ff"; g.textAlign = "center";
    g.font = "800 130px system-ui, sans-serif"; g.fillText("98", 256, 275);
    g.fillStyle = "#94a3c7"; g.font = "600 40px system-ui, sans-serif"; g.fillText("Performance", 256, 460);
  } else if (kind === "ai") {
    g.fillStyle = "#12d6f8"; g.font = "700 30px system-ui, sans-serif"; g.fillText("✦ AI answer", 40, 70);
    g.fillStyle = "rgba(242,246,255,0.25)";
    g.beginPath(); g.roundRect(40, 100, 420, 16, 8); g.fill();
    g.beginPath(); g.roundRect(40, 130, 330, 16, 8); g.fill();
    g.fillStyle = "rgba(18,214,248,0.15)"; g.beginPath(); g.roundRect(40, 168, 300, 50, 25); g.fill();
    g.fillStyle = "#12d6f8"; g.font = "600 26px system-ui, sans-serif"; g.fillText("Cited: yourbrand.com", 60, 202);
  } else {
    g.fillStyle = "#12d6f8"; g.beginPath(); g.arc(80, 128, 40, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#030820"; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(62, 128); g.lineTo(76, 142); g.lineTo(100, 114); g.stroke();
    g.fillStyle = "#f2f6ff"; g.font = "700 38px system-ui, sans-serif"; g.fillText("500 error fixed", 145, 120);
    g.fillStyle = "#94a3c7"; g.font = "500 28px system-ui, sans-serif"; g.fillText("Site back online · 14 min", 145, 165);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: W / H };
}

export function mountHeroScene(canvas: HTMLCanvasElement, opts: { onReady?: () => void } = {}): HeroSceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.6, 9.5);

  // lights: env gives reflections; coloured rims give the brand glow
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 6, 5);
  scene.add(key);
  const rimC = new THREE.PointLight(C.brand, 30, 14);
  rimC.position.set(-3.5, 1.5, 2);
  scene.add(rimC);
  const rimB = new THREE.PointLight(C.azure, 40, 16);
  rimB.position.set(4, 2.5, -2);
  scene.add(rimB);

  const rig = new THREE.Group(); // mouse/drag rotation
  scene.add(rig);
  const set = new THREE.Group(); // scroll offset
  rig.add(set);

  const disposables: { dispose: () => void }[] = [envTex, pmrem];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  /* ---------- Laptop ---------- */
  const alu = track(new THREE.MeshStandardMaterial({ color: 0x2a3556, metalness: 0.85, roughness: 0.32 }));
  const deck = track(new THREE.MeshStandardMaterial({ color: 0x0b1433, metalness: 0.5, roughness: 0.6 }));
  const laptop = new THREE.Group();
  laptop.position.set(-0.7, -0.75, 0);
  laptop.rotation.y = 0.28;
  set.add(laptop);

  const base = new THREE.Mesh(track(new RoundedBoxGeometry(3.4, 0.12, 2.3, 4, 0.06)), alu);
  laptop.add(base);
  const kbd = new THREE.Mesh(track(new THREE.PlaneGeometry(3.0, 1.15)), deck);
  kbd.rotation.x = -Math.PI / 2;
  kbd.position.set(0, 0.0605, -0.38);
  laptop.add(kbd);
  // keys (instanced)
  const keyGeo = track(new RoundedBoxGeometry(0.19, 0.03, 0.17, 2, 0.02));
  const keyMat = track(new THREE.MeshStandardMaterial({ color: 0x141e3f, metalness: 0.2, roughness: 0.7 }));
  const cols = 13, rows = 5;
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows);
  const m4 = new THREE.Matrix4();
  for (let r = 0, i = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
    m4.makeTranslation(-1.32 + c * 0.22, 0.075, -0.84 + r * 0.21);
    keys.setMatrixAt(i, m4);
  }
  laptop.add(keys);
  const pad = new THREE.Mesh(track(new RoundedBoxGeometry(1.1, 0.01, 0.62, 2, 0.04)), track(new THREE.MeshStandardMaterial({ color: 0x222c4d, metalness: 0.6, roughness: 0.25 })));
  pad.position.set(0, 0.062, 0.62);
  laptop.add(pad);
  // glow strip under the deck
  const strip = new THREE.Mesh(track(new THREE.PlaneGeometry(3.2, 0.02)), track(new THREE.MeshBasicMaterial({ color: C.brand })));
  strip.position.set(0, -0.05, 1.151);
  laptop.add(strip);

  // lid pivots on the back edge
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -1.15);
  laptop.add(hinge);
  const lid = new THREE.Mesh(track(new RoundedBoxGeometry(3.4, 2.2, 0.08, 4, 0.04)), alu);
  lid.position.set(0, 1.1, 0);
  hinge.add(lid);
  const screen = makeScreen();
  track(screen.tex);
  const screenMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(3.18, 1.99)), track(new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false })));
  screenMesh.position.set(0, 1.1, 0.042);
  hinge.add(screenMesh);
  // logo glow on the back of the lid
  const badge = new THREE.Mesh(track(new THREE.CircleGeometry(0.16, 32)), track(new THREE.MeshBasicMaterial({ color: C.brand, toneMapped: false })));
  badge.position.set(0, 1.1, -0.042);
  badge.rotation.y = Math.PI;
  hinge.add(badge);
  const LID_CLOSED = Math.PI / 2; // lid lying on the deck
  const LID_OPEN = -0.24; // tilted back ~104° from the deck
  hinge.rotation.x = LID_CLOSED; // opens on load

  // screen light spill
  const spill = new THREE.PointLight(C.brand, 6, 4);
  spill.position.set(0, 1, 0.8);
  hinge.add(spill);

  /* ---------- Glass bar chart (Grow) ---------- */
  const bars = new THREE.Group();
  bars.position.set(1.75, -0.75, 1.1);
  bars.rotation.y = -0.55;
  set.add(bars);
  const barTargets = [0.45, 0.7, 0.62, 1.0, 1.3, 1.75];
  const barMeshes: THREE.Mesh[] = [];
  barTargets.forEach((_, i) => {
    const col = new THREE.Color(C.azure).lerp(new THREE.Color(C.brand), i / (barTargets.length - 1));
    const mat = track(new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.1, roughness: 0.12, transmission: 0.6, thickness: 0.6, ior: 1.45, clearcoat: 1, emissive: col, emissiveIntensity: 0.25 }));
    const geo = track(new RoundedBoxGeometry(0.26, 1, 0.26, 3, 0.05));
    geo.translate(0, 0.5, 0);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = i * 0.36;
    mesh.scale.y = 0.001;
    bars.add(mesh);
    barMeshes.push(mesh);
  });
  const barBase = new THREE.Mesh(track(new RoundedBoxGeometry(2.3, 0.06, 0.6, 3, 0.03)), alu);
  barBase.position.set(0.9, -0.03, 0);
  bars.add(barBase);
  // trend arrow line above the bars
  const arrowPts = barTargets.map((h, i) => new THREE.Vector3(i * 0.36, h + 0.25, 0));
  const arrowGeo = track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arrowPts), 64, 0.018, 8, false));
  const arrowMat = track(new THREE.MeshBasicMaterial({ color: C.paper, transparent: true, opacity: 0, toneMapped: false }));
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  bars.add(arrow);
  const tip = new THREE.Mesh(track(new THREE.ConeGeometry(0.07, 0.18, 16)), arrowMat);
  tip.position.copy(arrowPts[arrowPts.length - 1]).add(new THREE.Vector3(0.05, 0.06, 0));
  tip.rotation.z = -0.9;
  bars.add(tip);

  /* ---------- Floating cards ---------- */
  const cards: { mesh: THREE.Mesh; base: THREE.Vector3; phase: number }[] = [];
  const addCard = (kind: "score" | "ai" | "fix", h: number, pos: [number, number, number], rotY: number) => {
    const { tex, aspect } = cardTexture(kind);
    track(tex);
    const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(h * aspect, h)), track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide })));
    mesh.position.set(...pos);
    mesh.rotation.y = rotY;
    mesh.scale.setScalar(0.001);
    set.add(mesh);
    cards.push({ mesh, base: mesh.position.clone(), phase: Math.random() * 6 });
  };
  addCard("score", 0.9, [-2.35, 0.25, 0.9], 0.35);
  addCard("ai", 0.66, [-1.25, 2.0, 0.2], 0.2);
  addCard("fix", 0.5, [0.9, -1.25, 1.9], -0.2);

  /* ---------- Glass shapes ---------- */
  const glass = track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.05, transmission: 1, thickness: 1.2, ior: 1.5, iridescence: 1, iridescenceIOR: 1.3, clearcoat: 1 }));
  const torus = new THREE.Mesh(track(new THREE.TorusGeometry(0.42, 0.15, 32, 96)), glass);
  torus.position.set(2.5, 2.0, -0.8);
  set.add(torus);
  const ico = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.32, 0)), track(new THREE.MeshStandardMaterial({ color: C.azure, metalness: 0.7, roughness: 0.2, flatShading: true, emissive: C.azure, emissiveIntensity: 0.15 })));
  ico.position.set(-3.1, 1.7, -0.8);
  set.add(ico);
  const orbs: THREE.Mesh[] = [];
  const orbMat = track(new THREE.MeshStandardMaterial({ color: C.brand, emissive: C.brand, emissiveIntensity: 1.2, toneMapped: false }));
  const orbGeo = track(new THREE.SphereGeometry(0.05, 16, 16));
  for (let i = 0; i < 7; i++) {
    const o = new THREE.Mesh(orbGeo, orbMat);
    o.userData = { r: 3 + Math.random() * 1.2, s: 0.15 + Math.random() * 0.2, y: -0.6 + Math.random() * 2.6, a: Math.random() * Math.PI * 2 };
    set.add(o);
    orbs.push(o);
  }

  // dust particles
  const dustN = 260;
  const dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 12;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, track(new THREE.PointsMaterial({ color: C.ice, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false })));
  scene.add(dust);

  // soft floor shadow (radial gradient texture)
  const sh = document.createElement("canvas");
  sh.width = sh.height = 128;
  const sg = sh.getContext("2d")!;
  const rg = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, "rgba(0,0,0,0.65)"); rg.addColorStop(1, "rgba(0,0,0,0)");
  sg.fillStyle = rg; sg.fillRect(0, 0, 128, 128);
  const shadowTex = track(new THREE.CanvasTexture(sh));
  const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 4)), track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.3, -0.84, 0.2);
  set.add(shadow);

  /* ---------- Interaction ---------- */
  const target = { x: 0, y: 0 };
  let spin = 0, spinVel = 0, dragging = false, lastX = 0;
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (dragging) {
      spinVel = (e.clientX - lastX) * 0.006;
      spin += spinVel;
      lastX = e.clientX;
    }
  };
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId); canvas.style.cursor = "grabbing"; };
  const onUp = () => { dragging = false; canvas.style.cursor = "grab"; };
  window.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  canvas.style.cursor = "grab";

  let scrollP = 0;

  /* ---------- Resize ---------- */
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // fit the set (about 7.6 x 4.6 units) inside the canvas whatever its shape
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    const distH = 2.6 / Math.tan(vHalf);
    const distW = 3.9 / (Math.tan(vHalf) * camera.aspect);
    camera.position.set(0, 1.5, Math.max(distH, distW) + 1.2);
    camera.lookAt(0, 0.35, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();
  let raf = 0, visible = true, readyFired = false;
  const intro = (t: number, d: number, len = 1.2) => {
    const x = Math.min(1, Math.max(0, (t - d) / len));
    return 1 - Math.pow(1 - x, 4);
  };
  const tick = () => {
    const t = clock.getElapsedTime();

    // intro choreography
    const open = intro(t, 0.2, 1.6);
    const lidClose = Math.min(1, scrollP * 1.6);
    const openness = open * (1 - lidClose * 0.92);
    hinge.rotation.x = LID_CLOSED + (LID_OPEN - LID_CLOSED) * openness;
    barMeshes.forEach((b, i) => {
      const grow = intro(t, 0.9 + i * 0.12, 1.1);
      b.scale.y = Math.max(0.001, barTargets[i] * grow * (1 + Math.sin(t * 1.4 + i) * 0.04));
    });
    arrowMat.opacity = intro(t, 1.9, 0.8);
    cards.forEach((c, i) => {
      const s = intro(t, 1.4 + i * 0.25, 0.9);
      c.mesh.scale.setScalar(Math.max(0.001, s));
      c.mesh.position.y = c.base.y + Math.sin(t * 0.9 + c.phase) * 0.08;
    });

    screen.draw(t);

    torus.rotation.x = t * 0.4; torus.rotation.y = t * 0.6;
    torus.position.y = 2.0 + Math.sin(t * 0.8) * 0.12;
    ico.rotation.x = t * 0.3; ico.rotation.z = t * 0.2;
    ico.position.y = 1.7 + Math.sin(t * 0.7 + 1) * 0.1;
    orbs.forEach((o) => {
      const u = o.userData as { r: number; s: number; y: number; a: number };
      const a = u.a + t * u.s;
      o.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + u.a) * 0.15, Math.sin(a) * u.r * 0.5 - 0.5);
    });
    dust.rotation.y = t * 0.015;

    // rig rotation: mouse + drag inertia + gentle idle sway
    if (!dragging) { spinVel *= 0.94; spin += spinVel; spin *= 0.985; }
    rig.rotation.y += (target.x * 0.28 + spin + Math.sin(t * 0.25) * 0.05 - rig.rotation.y) * 0.06;
    rig.rotation.x += (target.y * 0.1 - rig.rotation.x) * 0.06;

    // scroll: drift down and away
    set.position.y = -scrollP * 1.2;
    set.position.z = -scrollP * 2.5;

    renderer.render(scene, camera);
    if (!readyFired) { readyFired = true; opts.onReady?.(); }
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible) start(); };
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    setScroll: (p) => { scrollP = p; },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      disposables.forEach((d) => d.dispose());
      keys.dispose();
      renderer.dispose();
    },
  };
}
