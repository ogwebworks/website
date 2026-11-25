/**
 * "Living photo" renderer for The Glasshouse tour: one full-screen WebGL quad that turns the
 * still photo into a scene. A painted depth map drives parallax (mouse, device tilt, idle drift)
 * and a depth-aware camera move; masks (R = lit windows, G = pool water, B = sky) drive
 * the interior lights, rippling pool and twinkling sky. No libraries.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg, uDepth, uMask;
uniform vec2 uRes;        // canvas px
uniform float uImgAspect; // w / h
uniform vec2 uLook;       // parallax, -1..1
uniform vec3 uCam;        // focus x, focus y (image uv), zoom
uniform float uTime, uLights, uWater;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  // object-fit: cover, then camera zoom around the focus point
  float ca = uRes.x / uRes.y;
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 scale = ca > uImgAspect ? vec2(1.0, uImgAspect / ca) : vec2(ca / uImgAspect, 1.0);
  vec2 base = (uv - 0.5) * scale / uCam.z + uCam.xy;

  // depth parallax (iterative, so near objects slide over far ones without tearing)
  vec2 off = uLook * vec2(0.016, 0.011);
  vec2 p = base;
  for (int i = 0; i < 4; i++) {
    float d = texture2D(uDepth, p).r;
    p = base + off * (d - 0.42);
  }
  float d = texture2D(uDepth, p).r;
  vec4 mk = texture2D(uMask, p);

  // pool water: animated refraction
  float w = mk.g * uWater;
  vec2 rip = vec2(sin(p.y * 260.0 + uTime * 2.1) + sin(p.x * 90.0 - uTime * 1.3), cos(p.x * 210.0 + uTime * 1.7)) * 0.0011;
  vec2 q = p + rip * w;
  vec3 col = texture2D(uImg, q).rgb;

  // caustic sparkle on the water
  float cw = sin(q.x * 140.0 + uTime * 1.3 + sin(q.y * 90.0 + uTime * 0.7) * 2.0) * sin(q.y * 120.0 - uTime * 1.1 + sin(q.x * 70.0 - uTime * 0.5) * 2.0);
  float sp = pow(max(0.0, cw), 10.0);
  col += vec3(0.55, 0.95, 1.0) * sp * w * 0.22 * (0.4 + 0.6 * uLights);

  // interior lights: off = cool dark glass, on = warm glow + soft bloom
  float L = mk.r;
  vec3 offGlass = col * vec3(0.16, 0.2, 0.34) + vec3(0.01, 0.02, 0.05);
  col = mix(col, offGlass, L * (1.0 - uLights));
  col += vec3(1.0, 0.72, 0.38) * L * uLights * (0.06 + 0.02 * sin(uTime * 1.3));
  // pool lights follow the house lights a little
  col *= 1.0 - w * (1.0 - uLights) * 0.45;

  // sky: twinkling stars + an occasional shooting star
  float s = mk.b;
  vec2 g = q * vec2(260.0, 190.0);
  vec2 cell = floor(g);
  float h = hash(cell);
  float star = step(0.9935, h) * smoothstep(0.42, 0.0, length(fract(g) - 0.5)) * (0.55 + 0.45 * sin(uTime * (1.5 + h * 4.0) + h * 40.0));
  col += vec3(0.85, 0.92, 1.0) * star * s * smoothstep(0.62, 0.05, q.y);
  float st = mod(uTime, 11.0);
  vec2 a = vec2(0.85 - st * 0.09, 0.06 + st * 0.03);
  vec2 dir = normalize(vec2(-0.9, 0.3));
  vec2 rel = q - a;
  float along = dot(rel, dir), across = abs(dot(rel, vec2(-dir.y, dir.x)));
  float trail = step(st, 1.4) * smoothstep(0.0015, 0.0, across) * smoothstep(-0.12, 0.0, -along) * smoothstep(0.0, 0.005, along + 0.12) * step(along, 0.0);
  col += vec3(0.9, 0.97, 1.0) * trail * s * (1.0 - st / 1.4) * 1.4;

  // grade: gentle vignette + film grain
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.55;
  col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

export type TourHandle = {
  set: (s: Partial<{ look: [number, number]; cam: [number, number, number]; lights: number }>) => void;
  /** smoothed values actually on screen this frame (for hotspot tracking) */
  current: () => { look: number[]; cam: number[]; lights: number };
  imgAspect: number;
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

export async function mountGlasshouse(canvas: HTMLCanvasElement, srcs: { img: string; depth: string; mask: string }, onFrame?: () => void): Promise<TourHandle> {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("no webgl");
  const [img, depth, mask] = await Promise.all([loadImage(srcs.img), loadImage(srcs.depth), loadImage(srcs.mask)]);

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

  const tex = (unit: number, im: HTMLImageElement, name: string) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
    gl.uniform1i(gl.getUniformLocation(prog, name), unit);
    return t;
  };
  const textures = [tex(0, img, "uImg"), tex(1, depth, "uDepth"), tex(2, mask, "uMask")];

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U("uRes"), uAsp = U("uImgAspect"), uLook = U("uLook"), uCam = U("uCam"), uTime = U("uTime"), uLights = U("uLights"), uWater = U("uWater");
  gl.uniform1f(uAsp, img.naturalWidth / img.naturalHeight);
  gl.uniform1f(uWater, 1);

  const state = { look: [0, 0] as [number, number], cam: [0.5, 0.5, 1] as [number, number, number], lights: 1 };
  const cur = { look: [0, 0], cam: [0.5, 0.5, 1], lights: 0 };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, canvas.clientWidth < 700 ? 1.5 : 1.75);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const t0 = performance.now();
  let raf = 0, visible = true;
  const frame = () => {
    const k = 0.07;
    cur.look[0] += (state.look[0] - cur.look[0]) * k;
    cur.look[1] += (state.look[1] - cur.look[1]) * k;
    for (let i = 0; i < 3; i++) cur.cam[i] += (state.cam[i] - cur.cam[i]) * 0.08;
    cur.lights += (state.lights - cur.lights) * 0.045;
    gl.uniform2f(uLook, cur.look[0], cur.look[1]);
    gl.uniform3f(uCam, cur.cam[0], cur.cam[1], cur.cam[2]);
    gl.uniform1f(uLights, cur.lights);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    onFrame?.();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible) start(); };
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    set: (s) => {
      if (s.look) state.look = s.look;
      if (s.cam) state.cam = s.cam;
      if (s.lights !== undefined) state.lights = s.lights;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
    current: () => cur,
    imgAspect: img.naturalWidth / img.naturalHeight,
  };
}

/** Same maths as the shader, in JS: where image point q (uv) appears on screen (0..1), given camera and look. */
export function projectPoint(q: [number, number], depthAt: number, look: number[], cam: number[], canvasAspect: number, imgAspect: number) {
  const scale = canvasAspect > imgAspect ? [1, imgAspect / canvasAspect] : [canvasAspect / imgAspect, 1];
  const off = [look[0] * 0.016, look[1] * 0.011];
  const base = [q[0] - off[0] * (depthAt - 0.42), q[1] - off[1] * (depthAt - 0.42)];
  return [((base[0] - cam[0]) * cam[2]) / scale[0] + 0.5, ((base[1] - cam[1]) * cam[2]) / scale[1] + 0.5];
}
