/**
 * "Living photo" renderer for The Glasshouse walk-through. One WebGL quad draws two scenes at
 * once (the room you are in and the next one) so the camera can walk from room to room.
 * Each scene = photo + painted depth map + masks (R = warm light, G = pool water, B = sky).
 * Effects: depth parallax (mouse / tilt / idle drift), camera push, lights on/off, rippling
 * pool, twinkling stars, plus per-room fire flicker and rising steam. No libraries.
 */

export type SceneDef = {
  id: string;
  img: string;
  depth: string;
  mask: string;
  fire?: [number, number, number, number]; // uv rect
  steam?: [number, number, number, number];
};

const VERT = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uI0, uD0, uM0, uI1, uD1, uM1;
uniform vec3 uCam0, uCam1;
uniform float uAsp0, uAsp1, uMix, uTime, uLights;
uniform vec2 uLook, uRes;
uniform vec4 uFire0, uFire1, uSteam0, uSteam1;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
}
float rect(vec2 p, vec4 r, float soft) {
  if (r.z <= r.x) return 0.0;
  vec2 a = smoothstep(r.xy - soft, r.xy + soft, p) * (1.0 - smoothstep(r.zw - soft, r.zw + soft, p));
  return a.x * a.y;
}

vec3 scene(sampler2D I, sampler2D D, sampler2D M, vec3 cam, float asp, vec4 fire, vec4 steam) {
  float ca = uRes.x / uRes.y;
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 sc = ca > asp ? vec2(1.0, asp / ca) : vec2(ca / asp, 1.0);
  vec2 base = (uv - 0.5) * sc / cam.z + cam.xy;
  vec2 off = uLook * vec2(0.014, 0.010);
  vec2 p = base;
  for (int i = 0; i < 4; i++) { float d = texture2D(D, p).r; p = base + off * (d - 0.45); }
  vec4 mk = texture2D(M, p);

  float w = mk.g;
  vec2 rip = vec2(sin(p.y * 260.0 + uTime * 2.1) + sin(p.x * 90.0 - uTime * 1.3), cos(p.x * 210.0 + uTime * 1.7)) * 0.001;
  vec2 q = p + rip * w;
  vec3 col = texture2D(I, q).rgb;
  float cw = sin(q.x * 140.0 + uTime * 1.3 + sin(q.y * 90.0 + uTime * 0.7) * 2.0) * sin(q.y * 120.0 - uTime * 1.1 + sin(q.x * 70.0 - uTime * 0.5) * 2.0);
  col += vec3(0.55, 0.95, 1.0) * pow(max(0.0, cw), 10.0) * w * 0.22 * (0.4 + 0.6 * uLights);

  // fire flicker (fireplace)
  float fr = rect(q, fire, 0.012);
  if (fr > 0.0) {
    float fl = vnoise(vec2(q.x * 40.0, q.y * 18.0 - uTime * 3.5)) * 0.6 + vnoise(vec2(uTime * 2.0, q.x * 9.0)) * 0.4;
    col *= 1.0 + fr * (fl - 0.35) * 0.9;
    col += vec3(1.0, 0.45, 0.12) * fr * fl * 0.12;
  }
  // glow the fire casts on the room
  if (fire.z > fire.x) {
    vec2 fc = vec2((fire.x + fire.z) * 0.5, fire.y);
    float gl = exp(-length((q - fc) * vec2(1.2, 2.0)) * 5.0) * (0.75 + 0.25 * sin(uTime * 7.3) * sin(uTime * 3.1));
    col += vec3(1.0, 0.5, 0.15) * gl * 0.06 * uLights;
  }

  // lights: off = the room falls to blue-hour darkness
  float L = mk.r;
  vec3 offc = col * vec3(0.2, 0.24, 0.38) + vec3(0.008, 0.015, 0.04);
  col = mix(col, offc, L * (1.0 - uLights));
  col *= 1.0 - w * (1.0 - uLights) * 0.45;

  // steam (shower)
  float st = rect(q, steam, 0.05);
  if (st > 0.0) {
    float n = vnoise(vec2(q.x * 7.0, q.y * 4.0 + uTime * 0.25)) * 0.6 + vnoise(vec2(q.x * 15.0 - uTime * 0.1, q.y * 9.0 + uTime * 0.4)) * 0.4;
    col = mix(col, vec3(0.92, 0.88, 0.82), st * smoothstep(0.35, 0.9, n) * 0.38);
  }

  // sky: stars
  float s = mk.b;
  vec2 g = q * vec2(240.0, 170.0);
  float h = hash(floor(g));
  float star = step(0.993, h) * smoothstep(0.42, 0.0, length(fract(g) - 0.5)) * (0.55 + 0.45 * sin(uTime * (1.5 + h * 4.0) + h * 40.0));
  col += vec3(0.85, 0.92, 1.0) * star * s;
  return col;
}

void main() {
  vec3 a = scene(uI0, uD0, uM0, uCam0, uAsp0, uFire0, uSteam0);
  vec3 col = a;
  if (uMix > 0.001) {
    vec3 b = scene(uI1, uD1, uM1, uCam1, uAsp1, uFire1, uSteam1);
    // soft "walk-through" blend: brighter centre leads the dissolve
    vec2 v = vUv - 0.5;
    float m = smoothstep(0.0, 1.0, clamp(uMix * 1.35 - length(v) * 0.5, 0.0, 1.0));
    col = mix(a, b, m);
  }
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.5;
  col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}
`;

type Loaded = { tex: WebGLTexture[]; asp: number; def: SceneDef };

export type HouseHandle = {
  /** a = current scene id, b = next scene id, mix 0..1, cameras [focusX, focusY, zoom] */
  frame: (f: { a: string; b: string; mix: number; camA: [number, number, number]; camB: [number, number, number] }) => void;
  look: (l: [number, number]) => void;
  lights: (on: number) => void;
  preload: (id: string) => void;
  view: () => { look: number[]; camA: number[]; camB: number[]; mix: number };
  dispose: () => void;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

export async function mountHouse(canvas: HTMLCanvasElement, scenes: SceneDef[], first: string, onFrame?: () => void): Promise<HouseHandle> {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("no webgl");
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  ["uI0", "uD0", "uM0", "uI1", "uD1", "uM1"].forEach((n, i) => gl.uniform1i(U(n), i));
  const u = {
    cam0: U("uCam0"), cam1: U("uCam1"), asp0: U("uAsp0"), asp1: U("uAsp1"), mix: U("uMix"), time: U("uTime"), lights: U("uLights"),
    look: U("uLook"), res: U("uRes"), fire0: U("uFire0"), fire1: U("uFire1"), steam0: U("uSteam0"), steam1: U("uSteam1"),
  };

  const makeTex = (im: HTMLImageElement) => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
    return t;
  };
  const byId = new Map(scenes.map((s) => [s.id, s]));
  const cache = new Map<string, Loaded>();
  const pending = new Map<string, Promise<void>>();
  const load = (id: string) => {
    if (cache.has(id) || pending.has(id)) return pending.get(id) ?? Promise.resolve();
    const def = byId.get(id);
    if (!def) return Promise.resolve();
    const p = Promise.all([loadImage(def.img), loadImage(def.depth), loadImage(def.mask)]).then(([i, d, m]) => {
      cache.set(id, { tex: [makeTex(i), makeTex(d), makeTex(m)], asp: i.naturalWidth / i.naturalHeight, def });
      pending.delete(id);
    });
    pending.set(id, p);
    return p;
  };
  await load(first);

  const target = { a: first, b: first, mix: 0, camA: [0.5, 0.5, 1], camB: [0.5, 0.5, 1], look: [0, 0], lights: 1 };
  const cur = { look: [0, 0], camA: [0.5, 0.5, 1], camB: [0.5, 0.5, 1], mix: 0, lights: 0 };
  let shownA = first;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, canvas.clientWidth < 700 ? 1.5 : 1.75);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const bind = (slot: 0 | 1, L: Loaded) => {
    L.tex.forEach((t, i) => { gl.activeTexture(gl.TEXTURE0 + slot * 3 + i); gl.bindTexture(gl.TEXTURE_2D, t); });
    gl.uniform1f(slot ? u.asp1 : u.asp0, L.asp);
    const f = L.def.fire ?? [0, 0, 0, 0], s = L.def.steam ?? [0, 0, 0, 0];
    gl.uniform4f(slot ? u.fire1 : u.fire0, f[0], f[1], f[2], f[3]);
    gl.uniform4f(slot ? u.steam1 : u.steam0, s[0], s[1], s[2], s[3]);
  };

  const t0 = performance.now();
  let raf = 0, visible = true;
  const tick = () => {
    const A = cache.get(target.a) ?? cache.get(shownA)!;
    if (cache.has(target.a)) shownA = target.a; else void load(target.a);
    const B = cache.get(target.b);
    if (!B) void load(target.b);
    const k = 0.12;
    for (let i = 0; i < 3; i++) { cur.camA[i] += (target.camA[i] - cur.camA[i]) * k; cur.camB[i] += (target.camB[i] - cur.camB[i]) * k; }
    cur.mix += ((B ? target.mix : 0) - cur.mix) * 0.2;
    cur.look[0] += (target.look[0] - cur.look[0]) * 0.07;
    cur.look[1] += (target.look[1] - cur.look[1]) * 0.07;
    cur.lights += (target.lights - cur.lights) * 0.045;
    bind(0, A);
    bind(1, B ?? A);
    gl.uniform3f(u.cam0, cur.camA[0], cur.camA[1], cur.camA[2]);
    gl.uniform3f(u.cam1, cur.camB[0], cur.camB[1], cur.camB[2]);
    gl.uniform1f(u.mix, cur.mix);
    gl.uniform2f(u.look, cur.look[0], cur.look[1]);
    gl.uniform1f(u.lights, cur.lights);
    gl.uniform1f(u.time, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    onFrame?.();
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible) start(); };
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    frame: (f) => {
      if (f.a !== target.a) cur.camA = [...f.camA];
      if (f.b !== target.b) cur.camB = [...f.camB];
      target.a = f.a; target.b = f.b; target.mix = f.mix; target.camA = f.camA; target.camB = f.camB;
      void load(f.a); void load(f.b);
    },
    look: (l) => { target.look = l; },
    lights: (on) => { target.lights = on; },
    preload: (id) => { void load(id); },
    view: () => ({ look: cur.look, camA: cur.camA, camB: cur.camB, mix: cur.mix }),
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cache.forEach((c) => c.tex.forEach((t) => gl.deleteTexture(t)));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/** Where image point q (uv) appears on screen (0..1), for a camera and look (same maths as the shader). */
export function projectPoint(q: [number, number], depth: number, look: number[], cam: number[], canvasAspect: number, imgAspect: number) {
  const sc = canvasAspect > imgAspect ? [1, imgAspect / canvasAspect] : [canvasAspect / imgAspect, 1];
  const off = [look[0] * 0.014, look[1] * 0.01];
  const base = [q[0] - off[0] * (depth - 0.45), q[1] - off[1] * (depth - 0.45)];
  return [((base[0] - cam[0]) * cam[2]) / sc[0] + 0.5, ((base[1] - cam[1]) * cam[2]) / sc[1] + 0.5];
}
