import * as THREE from "three";
import gsap from "gsap";

const COUNT = 26000;

const vert = /* glsl */ `
  uniform float uTime, uProgress, uSize;
  uniform vec2 uMouse;
  attribute vec3 aChaos;
  attribute float aSeed;
  varying float vGlow;

  void main() {
    // order = layered geometric lattice (stored in position), chaos = scattered cloud
    vec3 p = mix(aChaos, position, smoothstep(0.0, 1.0, uProgress));
    float t = uTime * 0.15;
    float c = cos(t), s = sin(t);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p += 0.015 * vec3(sin(uTime + aSeed * 40.0), cos(uTime * 0.8 + aSeed * 31.0), sin(uTime * 0.6 + aSeed * 17.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // cursor repulsion in screen space
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    float push = exp(-dot(d, d) * 18.0);
    mv.xy += normalize(d + 1e-4) * push * 0.55;
    vGlow = push;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + push * 1.6) * (1.0 / -mv.z);
  }
`;

const frag = /* glsl */ `
  varying float vGlow;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    vec3 col = mix(vec3(0.35, 0.8, 0.75), vec3(1.0, 0.95, 0.8), vGlow);
    gl_FragColor = vec4(col, a * (0.55 + vGlow * 0.45));
  }
`;

/** Points on a nested "flower of life"-like shell structure: rings on spheres. */
function buildLattice(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const shells = 5;
  for (let i = 0; i < COUNT; i++) {
    const shell = i % shells;
    const radius = 0.45 + shell * 0.24;
    const k = Math.floor(i / shells);
    const n = Math.floor(COUNT / shells);
    // fibonacci sphere, modulated into petals
    const y = 1 - (2 * (k + 0.5)) / n;
    const theta = Math.PI * (1 + Math.sqrt(5)) * k;
    const petal = 1 + 0.12 * Math.cos(6 * theta + shell);
    const rr = Math.sqrt(1 - y * y);
    out[i * 3] = Math.cos(theta) * rr * radius * petal;
    out[i * 3 + 1] = y * radius * petal;
    out[i * 3 + 2] = Math.sin(theta) * rr * radius * petal;
  }
  return out;
}

export function initParticles(canvas: HTMLCanvasElement, reduceMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.z = 4;

  const lattice = buildLattice();
  const chaos = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    chaos[i * 3] = (Math.random() - 0.5) * 9;
    chaos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    chaos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    seed[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(lattice, 3));
  geo.setAttribute("aChaos", new THREE.BufferAttribute(chaos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: reduceMotion ? 1 : 0 },
    uSize: { value: 22 },
    uMouse: { value: new THREE.Vector2(9, 9) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // shift the structure right on wide screens so it sits beside the text
    camera.setViewOffset(w, h, w > 900 ? -w * 0.18 : 0, 0, w, h);
    camera.updateProjectionMatrix();
    uniforms.uSize.value = 22 * Math.min(devicePixelRatio, 2);
  }
  resize();
  addEventListener("resize", resize);

  const target = new THREE.Vector2(9, 9);
  addEventListener("pointermove", (e) => {
    target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  });
  addEventListener("pointerleave", () => target.set(9, 9));

  const t0 = performance.now();
  const frame = () => {
    uniforms.uTime.value = reduceMotion ? 0 : (performance.now() - t0) / 1000;
    uniforms.uMouse.value.lerp(target, 0.12);
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(frame);

  return {
    pause: () => renderer.setAnimationLoop(null),
    resume: () => renderer.setAnimationLoop(frame),
    /** Chaos -> order: the visual metaphor of the site. */
    assemble(duration = 3.2) {
      if (reduceMotion) return;
      gsap.to(uniforms.uProgress, { value: 1, duration, ease: "power3.inOut" });
    },
  };
}
