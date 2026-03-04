'use client';

import { Suspense, useRef, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Preload, ContactShadows, MapControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import * as THREE from 'three';
import Motherboard, { COMPONENT_POSITIONS } from './Motherboard';
import Loader from './Loader';

/* ─── Twinkling Star Field ─── */
const STAR_COUNT = 1400;

function TwinklingStars() {
  const meshRef = useRef<THREE.Points>(null);

  const { geo, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const alphaArr = new Float32Array(STAR_COUNT);
    const phasesArr = new Float32Array(STAR_COUNT);
    const speedsArr = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 38 + Math.random() * 42;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      alphaArr[i]  = 0.7;
      phasesArr[i] = Math.random() * Math.PI * 2;
      speedsArr[i] = 0.3 + Math.random() * 1.6;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('alpha', new THREE.BufferAttribute(alphaArr, 1));
    return { geo: g, phases: phasesArr, speeds: speedsArr };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_PointSize = 1.2 + vAlpha * 2.2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float glow = 1.0 - d * d;
        gl_FragColor = vec4(0.88, 0.94, 1.0, vAlpha * glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const attr = meshRef.current.geometry.getAttribute('alpha') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i] = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * speeds[i] + phases[i]));
    }
    attr.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geo} material={mat} />;
}

/* ─── Camera Controller (GSAP transitions) ─── */
function CameraController() {
  const { camera } = useThree();

  // Expose focusComponent via window for global access
  if (typeof window !== 'undefined') {
    (window as any).__focusComponent = (name: string) => {
      const target = COMPONENT_POSITIONS[name];
      if (!target) return;

      const offset = new THREE.Vector3(0, 3, 5);
      const destination = target.clone().add(offset);

      gsap.to(camera.position, {
        x: destination.x,
        y: destination.y,
        z: destination.z,
        duration: 1.5,
        ease: 'power3.inOut',
      });
    };

    (window as any).__resetCamera = () => {
      gsap.to(camera.position, {
        x: 0,
        y: 5,
        z: 12,
        duration: 1.5,
        ease: 'power3.inOut',
      });
    };
  }

  return null;
}

/* ─── Lighting Rig ─── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      <rectAreaLight
        width={10}
        height={10}
        color="#ffffff"
        intensity={2.5}
        position={[-5, 5, -5]}
      />
      <pointLight
        position={[0, 3, 0]}
        intensity={0.6}
        color="#00F5FF"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-4, 2, -2]}
        intensity={0.3}
        color="#A855F7"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[4, 2, 2]}
        intensity={0.2}
        color="#00F5FF"
        distance={10}
        decay={2}
      />
    </>
  );
}

/* ─── Main Environment Canvas ─── */
export default function Environment() {
  return (
    <div className="fixed inset-0 w-full h-full" id="canvas-container">
      <Canvas
        camera={{ position: [0, 5, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: '#0A0A0A' }}
      >
        <Suspense fallback={<Loader />}>
          <CameraController />
          <MapControls
            makeDefault
            minDistance={5}
            maxDistance={18}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the board
          />
          <Lighting />
          <TwinklingStars />
          <fog attach="fog" args={['#0A0A0A', 14, 28]} />
          <Motherboard />
          
          {/* Grounding shadow beneath the entire motherboard */}
          <ContactShadows position={[0, -0.4, 0]} opacity={0.6} scale={20} blur={2.5} far={4.5} />
          
          {/* Post-Processing Pipeline */}
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          </EffectComposer>
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ─── Exported helper to trigger camera transitions ─── */
export function focusComponent(name: string) {
  if (typeof window !== 'undefined' && (window as any).__focusComponent) {
    (window as any).__focusComponent(name);
  }
}

export function resetCamera() {
  if (typeof window !== 'undefined' && (window as any).__resetCamera) {
    (window as any).__resetCamera();
  }
}
