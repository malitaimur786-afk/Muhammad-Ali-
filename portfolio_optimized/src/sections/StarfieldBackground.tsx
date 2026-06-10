import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PERFORMANCE OPTIMIZATION:
 * The original version updated 12,000 star z-positions every frame via a CPU loop,
 * then uploaded the full ~144KB position buffer to the GPU each frame.
 *
 * New approach: GPU-side animation via ShaderMaterial.
 * Per-frame cost = one float uniform update (~4 bytes) instead of 144KB GPU upload.
 * Result: ~99.9% reduction in per-frame GPU memory bandwidth for stars.
 */
export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // ── Renderer ───────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    // Cap DPR at 1.5 — beyond that is imperceptible but costly
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Stars — GPU-animated ShaderMaterial ────────────────────
    const STAR_COUNT = isMobile ? 2500 : 7500;
    const positions  = new Float32Array(STAR_COUNT * 3);
    const speeds     = new Float32Array(STAR_COUNT);   // per-star speed variation

    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3    ] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      speeds[i]             = 0.6 + Math.random() * 1.4;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds,    1));

    const starMat = new THREE.ShaderMaterial({
      // Vertex: animate z on the GPU — zero CPU buffer writes per frame
      vertexShader: `
        attribute float aSpeed;
        uniform float uTime;

        void main() {
          // Wrap z in range [-1000, 1000] advancing with time
          float animZ = mod(position.z + uTime * aSpeed * 28.0 + 1000.0, 2000.0) - 1000.0;
          vec4 mvPos  = modelViewMatrix * vec4(position.x, position.y, animZ, 1.0);

          // Perspective-correct point size — stars grow as they approach
          gl_PointSize = clamp(220.0 / -mvPos.z, 0.3, 2.4);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      // Fragment: soft circular point with no hard edge
      fragmentShader: `
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, (1.0 - d) * 0.85);
        }
      `,
      uniforms:   { uTime: { value: 0.0 } },
      transparent: true,
      depthWrite:  false,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Mouse parallax (desktop only) ──────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile) document.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Shooting stars (simple 2-point lines) ──────────────────
    interface ShootingStar {
      line:   THREE.Line;
      vel:    THREE.Vector3;
      age:    number;
      maxAge: number;
    }
    const shootingStars: ShootingStar[] = [];
    const MAX_SHOOTING = 4;

    const spawnShootingStar = () => {
      if (shootingStars.length >= MAX_SHOOTING) return;
      const x = (Math.random() - 0.5) * 1200;
      const y = (Math.random() - 0.5) * 800;
      const z = -500;
      const len = 45 + Math.random() * 75;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([x, y, z, x, y, z - len]), 3
      ));

      const mat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);

      shootingStars.push({
        line, age: 0,
        maxAge: 45 + Math.floor(Math.random() * 30),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2.5,
          20
        ),
      });
    };

    // ── Animation loop ─────────────────────────────────────────
    let lastTime  = 0;
    let frameCount = 0;

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.05); // cap delta at 50ms
      lastTime    = now;
      frameCount++;

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      // One float uniform write — all star movement happens in the GPU
      starMat.uniforms.uTime.value += delta;

      // Subtle parallax via camera rotation (cheap LERP)
      camera.rotation.y += (mouseX * 0.00014 - camera.rotation.y) * 0.04;
      camera.rotation.x += (mouseY * 0.00014 - camera.rotation.x) * 0.04;

      // Spawn shooting star occasionally (skip on mobile)
      if (!isMobile && Math.random() < 1 / 240) spawnShootingStar();

      // Update active shooting stars (only a handful at most)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.age++;

        const arr = s.line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < arr.length; j += 3) {
          arr[j    ] += s.vel.x;
          arr[j + 1] += s.vel.y;
          arr[j + 2] += s.vel.z;
        }
        s.line.geometry.attributes.position.needsUpdate = true;
        (s.line.material as THREE.LineBasicMaterial).opacity = 0.75 * (1 - s.age / s.maxAge);

        if (s.age >= s.maxAge) {
          scene.remove(s.line);
          s.line.geometry.dispose();
          (s.line.material as THREE.LineBasicMaterial).dispose();
          shootingStars.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      starGeo.dispose();
      starMat.dispose();
      shootingStars.forEach((s) => {
        s.line.geometry.dispose();
        (s.line.material as THREE.LineBasicMaterial).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}
