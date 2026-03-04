'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Float,
  PresentationControls,
  RoundedBox,
  Text,
  Line,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import NeonTracer from './NeonTracer';
import { useOSStore } from '@/store/useOSStore';

/* ─── Component position constants (used for camera targeting) ─── */
export const COMPONENT_POSITIONS: Record<string, THREE.Vector3> = {
  cpu: new THREE.Vector3(0, 0.6, 0),
  gpu: new THREE.Vector3(-3.5, 0.5, 0),
  ram0: new THREE.Vector3(3, 0.8, -0.8),
  ram1: new THREE.Vector3(3, 0.8, 0),
  ram2: new THREE.Vector3(3, 0.8, 0.8),
  pmu: new THREE.Vector3(2, 0.5, -2),
  sap: new THREE.Vector3(-2, 0.5, 2),
};

/* ─── Glowing Edge Material ─── */
function GlowEdge({ color = '#00F5FF', intensity = 0.3 }: { color?: string; intensity?: number }) {
  return (
    <meshStandardMaterial
      color="#111111"
      emissive={color}
      emissiveIntensity={intensity}
      metalness={0.8}
      roughness={0.3}
    />
  );
}

/* ─── CPU Block ─── */
function CPU() {
  const meshRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    // Transient subscription to global state for performance
    if (coreMaterialRef.current) {
      const isGenerating = useOSStore.getState().isGenerating;
      const targetIntensity = isGenerating ? 3.0 + Math.sin(state.clock.elapsedTime * 20) * 1.5 : 0.15;
      coreMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMaterialRef.current.emissiveIntensity,
        targetIntensity,
        delta * 8
      );
    }
  });

  return (
    <group 
      position={[0, 0.6, 0]} 
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('adobe'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Base Socket */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.1, 0.15, 2.1]} />
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Heat Sink Core */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.8, 0.25, 1.8]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color="#1a1a1a"
          emissive="#ff003c" // Adobe Red
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Cooling Fins (Micro-geometry) */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={`fin-${i}`} position={[-0.7 + i * 0.14, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.15, 1.8]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}

      {/* CPU top label */}
      <Text
        position={[0, 0.45, 0.65]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.12}
        color="#ff003c"
        anchorX="center"
        anchorY="middle"
      >
        {'CORE // Adobe'}
      </Text>
    </group>
  );
}

/* ─── RAM Sticks ─── */
function RAMStick({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  // Derive a slightly darkened body color from the emissive accent
  return (
    <group position={position} rotation={[0, -Math.PI / 2.5, 0]}>
      <RoundedBox args={[0.3, 1.4, 0.6]} radius={0.03} smoothness={4}>
        <meshStandardMaterial
          color="#0d0d0d"
          emissive={color}
          emissiveIntensity={0.22}
          metalness={0.7}
          roughness={0.35}
        />
      </RoundedBox>
      {/* RGB glow strip along top edge */}
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.58]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      </mesh>
      {/* Chip modules */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`chip-${i}`} position={[0.16, -0.4 + i * 0.28, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.4]} />
          <meshStandardMaterial color="#0d0d0d" emissive={color} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Label */}
      <Text
        position={[0.17, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/* ─── GPU Block — Triple-Fan Graphics Card (Apple Color Scheme) ─── */
function GPU() {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);
  const fan3Ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    const isGenerating = useOSStore.getState().isGenerating;
    const speed = isGenerating ? 20 : 2.8;
    if (fan1Ref.current) fan1Ref.current.rotation.y += delta * speed;
    if (fan2Ref.current) fan2Ref.current.rotation.y += delta * speed;
    if (fan3Ref.current) fan3Ref.current.rotation.y += delta * speed;
  });

  const fanRefs = [fan1Ref, fan2Ref, fan3Ref];

  return (
    <group
      position={[-3.5, 0.55, 0]}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('apple'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* ── Apple Silver backplate (bottom face) ── */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[2.92, 0.06, 1.68]} />
        <meshStandardMaterial color="#e3e3e8" metalness={0.94} roughness={0.06} />
      </mesh>
      {/* Backplate inset panel */}
      <mesh position={[0.3, -0.32, 0]}>
        <boxGeometry args={[0.7, 0.01, 0.5]} />
        <meshStandardMaterial color="#c8c8cc" metalness={0.88} roughness={0.12} />
      </mesh>

      {/* ── PCB substrate ── */}
      <mesh position={[0, -0.27, 0]}>
        <boxGeometry args={[2.9, 0.08, 1.65]} />
        <meshStandardMaterial color="#0c1a0c" metalness={0.25} roughness={0.8} />
      </mesh>

      {/* ── Main shroud — Apple Space Gray ── */}
      <RoundedBox args={[2.8, 0.58, 1.55]} radius={0.035} smoothness={5} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#1d1d1f" metalness={0.88} roughness={0.16} />
      </RoundedBox>

      {/* ── Top face plate — slightly lighter Space Gray ── */}
      <mesh position={[0, 0.315, 0]}>
        <boxGeometry args={[2.78, 0.014, 1.53]} />
        <meshStandardMaterial color="#2c2c2e" metalness={0.86} roughness={0.2} />
      </mesh>

      {/* ── Apple-white glowing accent bar — full width, back edge ── */}
      <mesh position={[0, 0.305, -0.62]}>
        <boxGeometry args={[2.72, 0.038, 0.055]} />
        <meshStandardMaterial color="#f5f5f7" emissive="#ffffff" emissiveIntensity={0.7} metalness={0.92} roughness={0.04} />
      </mesh>
      {/* Secondary accent bar — front edge, subtler */}
      <mesh position={[0, 0.305, 0.62]}>
        <boxGeometry args={[2.72, 0.02, 0.03]} />
        <meshStandardMaterial color="#f5f5f7" emissive="#ffffff" emissiveIntensity={0.3} metalness={0.92} roughness={0.04} />
      </mesh>

      {/* ── Silver heat fins visible between the fans ── */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={`fin-${i}`} position={[-0.3 + i * 0.045, 0.325, 0]}>
          <boxGeometry args={[0.022, 0.035, 1.5]} />
          <meshStandardMaterial color="#3a3a3c" metalness={0.88} roughness={0.22} />
        </mesh>
      ))}

      {/* ── 4 polished silver heat pipes (Apple uses silver, not copper) ── */}
      {[-0.3, -0.1, 0.1, 0.3].map((z, i) => (
        <mesh key={`pipe-${i}`} position={[0, 0.26, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.021, 0.021, 2.75, 10]} />
          <meshStandardMaterial color="#8e8e93" metalness={0.98} roughness={0.04} />
        </mesh>
      ))}

      {/* ── Triple recessed fan housings ── */}
      {([-0.92, 0, 0.92] as number[]).map((xOff, idx) => (
        <group key={`fan-${idx}`} position={[xOff, 0.3, 0]}>

          {/* Outer bezel ring — torusGeometry defaults to XY plane,
              rotate [PI/2,0,0] tilts it flat (XZ plane) so it's a circle from above */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.41, 0.048, 12, 48]} />
            <meshStandardMaterial color="#3a3a3c" metalness={0.96} roughness={0.08} />
          </mesh>

          {/* Dark recess disc — cylinderGeometry axis is Y by default,
              NO rotation needed: cap faces up, visible as circle from above */}
          <mesh position={[0, -0.018, 0]}>
            <cylinderGeometry args={[0.358, 0.358, 0.032, 48]} />
            <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.9} />
          </mesh>

          {/* ── Spinning blades group ── */}
          <group ref={fanRefs[idx]} position={[0, 0.008, 0]}>
            {/*
             * BLADE MATH:
             *   position={[0, 0, 0.19]}  → blade offset along its own local Z axis only.
             *                               After the Y rotation below, this Z offset becomes
             *                               the radial distance, placing the blade midpoint at
             *                               r ≈ 0.19·cos(0.36) ≈ 0.178 from the fan axis.
             *                               Span 0.38 means inner tip ≈ at hub, outer tip ≈ at bezel.
             *
             *   rotation={[pitchAngle, (2π/N)·i, 0]}  (Euler XYZ order)
             *     X = 0.36 rad (~21°) → aerodynamic pitch: tilts the blade's length axis
             *                           upward so it has real 3D depth, not a flat 2D disc.
             *     Y = evenly-spaced angle → distributes all N blades around the Y (fan) axis.
             *     Z = 0
             *
             *   The group itself is spun by useFrame via rotation.y, which rotates all
             *   blades as one unit around the same Y axis.
             */}
            {Array.from({ length: 7 }).map((_, bi) => (
              <mesh
                key={`blade-${bi}`}
                position={[0, 0, 0.19]}
                rotation={[0.36, (bi / 7) * Math.PI * 2, 0]}
              >
                <boxGeometry args={[0.06, 0.01, 0.35]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.5} />
              </mesh>
            ))}

            {/* Rotor hub — cylinderGeometry axis is Y by default, no rotation needed */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.5} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ── I/O Bracket — Apple Silver aluminum ── */}
      <mesh position={[-1.38, -0.06, 0]}>
        <boxGeometry args={[0.04, 0.3, 1.42]} />
        <meshStandardMaterial color="#d1d1d6" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Display port cutouts */}
      {([-0.45, -0.18, 0.09, 0.36] as number[]).map((z, i) => (
        <mesh key={`port-${i}`} position={[-1.4, -0.06, z]}>
          <boxGeometry args={[0.03, 0.14, 0.14]} />
          <meshStandardMaterial color="#080808" />
        </mesh>
      ))}
      {/* Bracket screw holes — cylinderGeometry, rotation Z=PI/2 makes axis horizontal ✓ */}
      {([-0.6, 0.6] as number[]).map((z, i) => (
        <mesh key={`screw-${i}`} position={[-1.4, 0.06, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 0.04, 10]} />
          <meshStandardMaterial color="#aeaeb2" metalness={0.92} roughness={0.18} />
        </mesh>
      ))}

      {/* ── Right end cap — Space Gray ── */}
      <mesh position={[1.42, 0.02, 0]}>
        <boxGeometry args={[0.04, 0.56, 1.53]} />
        <meshStandardMaterial color="#2c2c2e" metalness={0.82} roughness={0.28} />
      </mesh>
      {/* Power connector housing */}
      <mesh position={[1.32, 0.22, -0.3]}>
        <boxGeometry args={[0.18, 0.1, 0.55]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.65} roughness={0.45} />
      </mesh>
      {/* Connector pins — brushed silver */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`pin-${i}`} position={[1.32, 0.33, -0.44 + i * 0.13]}>
          <cylinderGeometry args={[0.017, 0.017, 0.12, 8]} />
          <meshStandardMaterial color="#aeaeb2" metalness={0.95} roughness={0.06} />
        </mesh>
      ))}

      {/* ── Label ── */}
      <group position={[0, 0.72, 0.62]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.1, 0.18]} />
          <meshBasicMaterial color="#0A0A0A" transparent opacity={0.55} depthTest={false} />
        </mesh>
        <Text fontSize={0.095} color="#f5f5f7" anchorX="center" anchorY="middle" material-depthTest={false}>
          {'GPU // Apple'}
        </Text>
      </group>
    </group>
  );
}

/* ─── PMU Utility — TRL11 Systems ─── */
function PMU() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const isHovered = useOSStore((s) => s.hoveredComponents.includes('pmu'));

  useFrame((state, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.x += delta * 0.5;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 0.8;
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isHovered ? 2 + pulse : 0.8;
    }
  });

  return (
    <group 
      position={[2, 0.7, -2]}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('trl11'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Outer Rotating Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[0.55, 0.02, 16, 64]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
      </mesh>

      {/* Inner Rotating Ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.35, 0.03, 16, 64]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
      </mesh>

      {/* Glowing Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
      </mesh>

      {/* Label */}
      <group position={[0, 0.75, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#0A0A0A" transparent opacity={0.6} depthTest={false} />
        </mesh>
        <Text
          fontSize={0.1}
          color="#FFAA00"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
        >
          {'PMU // TRL11'}
        </Text>
      </group>
    </group>
  );
}


/* ─── Enterprise Server Blade — SAP SE ─── */
function SAPBridge() {
  const isHovered = useOSStore((s) => s.hoveredComponents.includes('sap'));

  return (
    <group
      position={[-2, 0.45, 2]}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('sap'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* ── Main server chassis — SAP light blue body ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.85, 0.52, 1.05]} />
        <meshStandardMaterial color="#1a9fd4" metalness={0.45} roughness={0.42} />
      </mesh>

      {/* Front face panel — white bezel (secondary color) */}
      <mesh position={[0, 0, 0.53]}>
        <boxGeometry args={[1.83, 0.5, 0.02]} />
        <meshStandardMaterial color="#f0f4f8" metalness={0.35} roughness={0.35} />
      </mesh>

      {/* Drive bay slots — opaque SAP blue panels, no transparency */}
      {([-0.54, 0, 0.54] as number[]).flatMap((x, ci) =>
        ([0.06, -0.14] as number[]).map((y, ri) => (
          <mesh key={`bay-${ci}-${ri}`} position={[x, y, 0.545]}>
            <boxGeometry args={[0.44, 0.135, 0.018]} />
            <meshStandardMaterial
              color="#008FD3"
              emissive="#008FD3"
              emissiveIntensity={isHovered ? 0.55 : 0.18}
              metalness={0.5}
              roughness={0.25}
            />
          </mesh>
        ))
      )}
      {/* Drive bay border frames — white */}
      {([-0.54, 0, 0.54] as number[]).flatMap((x, ci) =>
        ([0.06, -0.14] as number[]).map((y, ri) => (
          <mesh key={`bayframe-${ci}-${ri}`} position={[x, y, 0.542]}>
            <boxGeometry args={[0.48, 0.17, 0.014]} />
            <meshStandardMaterial color="#d8e8f2" metalness={0.4} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* LED status strip — bright SAP blue at top */}
      <mesh position={[0, 0.232, 0.535]}>
        <boxGeometry args={[1.65, 0.026, 0.014]} />
        <meshStandardMaterial
          color="#00b4ff"
          emissive="#00b4ff"
          emissiveIntensity={isHovered ? 3.2 : 1.5}
        />
      </mesh>

      {/* Individual LED indicators — bottom row */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`led-${i}`} position={[-0.72 + i * 0.205, -0.228, 0.535]}>
          <boxGeometry args={[0.065, 0.028, 0.01]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#00e887' : '#00b4ff'}
            emissive={i % 3 === 0 ? '#00e887' : '#00b4ff'}
            emissiveIntensity={2.0}
          />
        </mesh>
      ))}

      {/* Side vent grilles — lighter blue-grey to match body */}
      {([-1, 1] as number[]).map((side, si) =>
        Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`grille-${si}-${i}`} position={[side * 0.93, -0.14 + i * 0.1, 0]}>
            <boxGeometry args={[0.018, 0.048, 0.95]} />
            <meshStandardMaterial color="#5bbce0" metalness={0.5} roughness={0.45} />
          </mesh>
        ))
      )}

      {/* Top edge rail — white with SAP blue emissive glow */}
      <mesh position={[0, 0.275, 0]}>
        <boxGeometry args={[1.87, 0.028, 1.07]} />
        <meshStandardMaterial
          color="#e8f4fb"
          metalness={0.65}
          roughness={0.2}
          emissive="#00b4ff"
          emissiveIntensity={isHovered ? 0.6 : 0.2}
        />
      </mesh>

      {/* Rear I/O panel — SAP blue */}
      <mesh position={[0, 0, -0.53]}>
        <boxGeometry args={[1.83, 0.48, 0.016]} />
        <meshStandardMaterial color="#1588b8" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Rear port cutouts */}
      {([-0.6, -0.3, 0, 0.3, 0.6] as number[]).map((x, i) => (
        <mesh key={`rport-${i}`} position={[x, 0, -0.54]}>
          <boxGeometry args={[0.16, 0.12, 0.018]} />
          <meshStandardMaterial color="#0a2030" />
        </mesh>
      ))}

      {/* Label */}
      <group position={[0, 0.48, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#0A0A0A" transparent opacity={0.6} depthTest={false} />
        </mesh>
        <Text
          fontSize={0.09}
          color="#008FD3"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
        >
          {'SAP // Enterprise'}
        </Text>
      </group>
    </group>
  );
}

/* ─── Neural Processing Unit — Series.so ─── */
function SeriesNPU() {
  const groupRef = useRef<THREE.Group>(null);
  const isHovered = useOSStore((s) => s.hoveredComponents.includes('series'));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group 
      position={[1.5, 0.6, 2.5]} 
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('series'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Matte Black Base Casing */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
      </mesh>

      {/* Internal Neural Cluster (White) */}
      <group position={[0, 0.1, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={`node-${i}`} 
            position={[
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5
            ]}
          >
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF" 
              emissiveIntensity={isHovered ? 2.5 : 1} 
            />
          </mesh>
        ))}
      </group>

      {/* Label */}
      <group position={[0, 0.6, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#0A0A0A" transparent opacity={0.6} depthTest={false} />
        </mesh>
        <Text
          fontSize={0.08}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
        >
          {'NPU // Series.so'}
        </Text>
      </group>
    </group>
  );
}

/* ─── PCB Board ─── */
function PCBBoard() {
  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(12, 40, '#00F5FF', '#00F5FF');
    (grid.material as THREE.Material).opacity = 0.06;
    (grid.material as THREE.Material).transparent = true;
    return grid;
  }, []);

  return (
    <group>
      {/* Main board */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[10, 0.15, 5]} />
        <meshStandardMaterial
          color="#0a0f0a"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      {/* Grid overlay */}
      <primitive object={gridHelper} position={[0, 0.08, 0]} />
      {/* Edge glow lines */}
      <Line
        points={[
          [-5, 0.09, -2.5],
          [5, 0.09, -2.5],
        ]}
        color="#00F5FF"
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      <Line
        points={[
          [-5, 0.09, 2.5],
          [5, 0.09, 2.5],
        ]}
        color="#00F5FF"
        lineWidth={1}
        transparent
        opacity={0.2}
      />
    </group>
  );
}

/* ─── Main Motherboard Assembly ─── */
export default function Motherboard() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group rotation={[0.1, 0.2, 0]}>
          <PCBBoard />
          <CPU />
          <GPU />
          <PMU />
          <SAPBridge />
          <SeriesNPU />
          <RAMStick position={[3, 0.8, -0.8]} label="MEM_0: Computer Science" color="#00ff55" />
          <RAMStick position={[3, 0.8, 0]}   label="MEM_1: Business Admin"   color="#ff8800" />
          <RAMStick position={[3, 0.8, 0.8]} label="MEM_2: LeetCode"         color="#bb44ff" />

          {/* ─── Neon Tracers — data paths ─── */}
          {/* CPU → GPU */}
          <NeonTracer
            points={[
              [0, 0.3, 0],
              [-1.2, 0.2, 0],
              [-2.2, 0.3, 0],
              [-3.5, 0.3, 0],
            ]}
            speed={0.8}
          />
          {/* CPU → RAM */}
          <NeonTracer
            points={[
              [0.8, 0.3, 0],
              [1.5, 0.2, 0],
              [2.2, 0.3, -0.3],
              [3, 0.3, -0.8],
            ]}
            speed={0.6}
          />
          <NeonTracer
            points={[
              [0.9, 0.3, 0],
              [1.8, 0.2, 0],
              [2.5, 0.3, 0],
              [3, 0.3, 0],
            ]}
            speed={0.65}
          />
          <NeonTracer
            points={[
              [0.8, 0.3, 0.2],
              [1.8, 0.2, 0.2],
              [2.4, 0.3, 0.5],
              [3, 0.3, 0.8],
            ]}
            speed={0.7}
          />
          {/* GPU → edge (data bus) */}
          <NeonTracer
            points={[
              [-3.5, 0.2, -0.6],
              [-4.2, 0.15, -1.2],
              [-4.8, 0.1, -2],
            ]}
            color="#008FD3"
            speed={0.4}
          />
          {/* CPU → PMU (amber data path) */}
          <NeonTracer
            points={[
              [0.5, 0.3, -0.5],
              [1.2, 0.25, -1.2],
              [1.8, 0.2, -1.8],
              [2, 0.2, -2],
            ]}
            color="#FFAA00"
            speed={0.5}
          />
          {/* CPU → SAP Bridge (blue data path) */}
          <NeonTracer
            points={[
              [-0.5, 0.3, 0.5],
              [-1.0, 0.25, 1.0],
              [-1.5, 0.2, 1.5],
              [-2, 0.2, 2],
            ]}
            color="#008FD3"
            speed={0.45}
          />
          {/* CPU → Series NPU (fuchsia data path) */}
          <NeonTracer
            points={[
              [0.5, 0.3, 0.5],
              [1.0, 0.25, 1.5],
              [1.2, 0.2, 2.0],
              [1.5, 0.2, 2.5],
            ]}
            color="#ff00ff"
            speed={0.6}
          />
        </group>
    </Float>
  );
}
