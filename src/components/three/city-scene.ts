import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * "Growth city": a field of glass-and-metal towers that rise as the visitor scrolls,
 * with a glowing trend line racing across it. The cursor sends a ripple through the
 * towers. Illustrative only; it shows what compounding growth feels like.
 */
export type CityHandle = { dispose: () => void; setProgress: (p: number) => void };

const AZURE = new THREE.Color(0x1d6dff);
const BRAND = new THREE.Color(0x12d6f8);
const ICE = new THREE.Color(0xe8f6ff);
const DEEP = new THREE.Color(0x0c1a4a);

export function mountCityScene(canvas: HTMLCanvasElement, opts: { small?: boolean } = {}): CityHandle {
  const small = !!opts.small;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x030820, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x030820, 16, 38);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);

  const sun = new THREE.DirectionalLight(0xbfdcff, 1.4);
  sun.position.set(-6, 12, 6);
  scene.add(sun);
  const glow = new THREE.PointLight(0x12d6f8, 60, 26);
  glow.position.set(4, 4, 2);
  scene.add(glow);

  /* ---------- Towers ---------- */
  const NX = small ? 22 : 34, NZ = small ? 14 : 20, GAP = 0.62;
  const count = NX * NZ;
  const geo = new THREE.BoxGeometry(0.46, 1, 0.46);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.28, envMapIntensity: 0.9 });
  const towers = new THREE.InstancedMesh(geo, mat, count);
  towers.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(towers);

  const base: number[] = [];
  const xs: number[] = [];
  const zs: number[] = [];
  const delay: number[] = [];
  for (let ix = 0; ix < NX; ix++) for (let iz = 0; iz < NZ; iz++) {
    const x = (ix - (NX - 1) / 2) * GAP;
    const z = (iz - (NZ - 1) / 2) * GAP;
    xs.push(x); zs.push(z);
    // skyline: taller toward the "future" (+x), lumpy districts, a few spires
    const trend = (ix / (NX - 1)) ** 1.6;
    const lump = 0.5 + 0.5 * Math.sin(ix * 0.55 + iz * 0.35) * Math.cos(iz * 0.6 - ix * 0.2);
    const spire = Math.random() < 0.04 ? 1.8 : 0;
    const centre = 1 - Math.min(1, Math.abs(z) / ((NZ * GAP) / 2)) * 0.6;
    base.push(0.12 + (trend * 3.4 + lump * 0.9 + spire) * centre);
    delay.push(ix / NX * 0.55 + Math.random() * 0.08);
  }
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) towers.setColorAt(i, DEEP);

  /* ---------- Trend line ---------- */
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const x = (u - 0.5) * NX * GAP * 0.95;
    pts.push(new THREE.Vector3(x, 0.6 + u ** 1.7 * 5 + Math.sin(u * 14) * 0.18, 0.6 - u * 1.2));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.045, 10, false);
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.geometry.setDrawRange(0, 0);
  scene.add(tube);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), new THREE.MeshBasicMaterial({ color: 0x12d6f8, toneMapped: false }));
  scene.add(head);
  const headLight = new THREE.PointLight(0x12d6f8, 25, 6);
  head.add(headLight);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial(), color: 0x12d6f8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.setScalar(1.6);
  head.add(halo);

  /* ---------- Sparks rising from the city ---------- */
  const SN = small ? 140 : 320;
  const sp = new Float32Array(SN * 3);
  const sv = new Float32Array(SN);
  for (let i = 0; i < SN; i++) {
    sp[i * 3] = (Math.random() - 0.5) * NX * GAP;
    sp[i * 3 + 1] = Math.random() * 8;
    sp[i * 3 + 2] = (Math.random() - 0.5) * NZ * GAP;
    sv[i] = 0.006 + Math.random() * 0.014;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ map: radial(), color: 0x7fe9ff, size: 0.16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(sparks);

  // ground grid
  const grid = new THREE.GridHelper(60, 96, 0x1d6dff, 0x0c1a4a);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.35;
  scene.add(grid);

  /* ---------- Interaction ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3(999, 0, 999);
  const ripple = new THREE.Vector3(999, 0, 999);
  let rippleAmp = 0;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  const onLeave = () => ndc.set(9, 9);
  canvas.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerleave", onLeave);

  let progress = 0, shown = 0;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const m4 = new THREE.Matrix4();
  const clock = new THREE.Clock();
  let raf = 0, visible = true;
  const tick = () => {
    const t = clock.getElapsedTime();
    shown += (progress - shown) * 0.08;

    // camera: sweeping orbit that lowers as the city grows
    const ang = -0.9 + shown * 1.1 + Math.sin(t * 0.1) * 0.04;
    const radius = (camera.aspect < 1 ? 19 : 15) - shown * 2.5;
    const height = 9.5 - shown * 4;
    camera.position.set(Math.sin(ang) * radius, height, Math.cos(ang) * radius);
    camera.lookAt(0, 1.4 + shown * 0.8, 0);

    // pointer ripple
    if (ndc.x < 5) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(ground, hit)) { ripple.lerp(hit, 0.25); rippleAmp += (1 - rippleAmp) * 0.08; }
    } else rippleAmp *= 0.95;

    for (let i = 0; i < count; i++) {
      const grow = Math.min(1, Math.max(0, (shown * 1.35 - delay[i]) / 0.5));
      const g = 1 - Math.pow(1 - grow, 3);
      const dx = xs[i] - ripple.x, dz = zs[i] - ripple.z;
      const d2 = dx * dx + dz * dz;
      const bump = rippleAmp * Math.exp(-d2 / 3.2) * (1.4 + Math.sin(t * 6 - Math.sqrt(d2) * 2.4) * 0.4);
      const breathe = Math.sin(t * 0.8 + xs[i] * 0.7 + zs[i]) * 0.04;
      const h = Math.max(0.04, base[i] * (0.08 + g * 0.92) + bump + breathe);
      m4.makeScale(1, h, 1);
      m4.setPosition(xs[i], 0, zs[i]);
      towers.setMatrixAt(i, m4);
      const k = Math.min(1, h / 4.2);
      col.copy(DEEP).lerp(AZURE, Math.min(1, k * 1.6)).lerp(BRAND, Math.max(0, k * 1.4 - 0.4)).lerp(ICE, Math.max(0, bump * 0.35));
      towers.setColorAt(i, col);
    }
    towers.instanceMatrix.needsUpdate = true;
    if (towers.instanceColor) towers.instanceColor.needsUpdate = true;

    // trend line draws with progress; head rides its tip
    const lp = Math.min(1, Math.max(0.02, shown * 1.15));
    tube.geometry.setDrawRange(0, Math.floor(tubeGeo.index!.count * lp / 3) * 3);
    curve.getPointAt(lp, head.position);
    halo.material.opacity = 0.6 + Math.sin(t * 4) * 0.2;

    const pos = sparkGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < SN; i++) {
      let y = pos.getY(i) + sv[i] * (0.6 + shown);
      if (y > 9) y = 0;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;

    renderer.render(scene, camera);
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible) start(); };
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    setProgress: (p) => { progress = p; },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      [geo, mat, tubeGeo, tubeMat, sparkGeo, env, pmrem, grid.geometry, grid.material as THREE.Material].forEach((d) => d.dispose());
      towers.dispose();
      renderer.dispose();
    },
  };
}

let radialTex: THREE.Texture | null = null;
function radial() {
  if (radialTex) return radialTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.35, "rgba(255,255,255,0.45)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  radialTex = new THREE.CanvasTexture(c);
  return radialTex;
}
