'use client';

import { Suspense, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Preload, ContactShadows, MapControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';
import * as THREE from 'three';
import Motherboard, { COMPONENT_POSITIONS } from './Motherboard';
import Loader from './Loader';

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
            maxDistance={25} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the board
          />
          <Lighting />
          <fog attach="fog" args={['#0A0A0A', 10, 30]} />
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
