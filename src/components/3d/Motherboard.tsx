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
}: {
  position: [number, number, number];
  label: string;
}) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2.5, 0]}>
      <RoundedBox args={[0.3, 1.4, 0.6]} radius={0.03} smoothness={4}>
        <meshStandardMaterial
          color="#111"
          emissive="#00F5FF"
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.4}
        />
      </RoundedBox>
      {/* Chip modules on RAM */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`chip-${i}`} position={[0.16, -0.4 + i * 0.28, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.4]} />
          <meshStandardMaterial
            color="#0a0a0a"
            emissive="#00F5FF"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
      {/* Label */}
      <Text
        position={[0.17, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.08}
        color="#00F5FF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/* ─── GPU Block ─── */
function GPU() {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Transient subscription to skip re-renders
    const isGenerating = useOSStore.getState().isGenerating;
    // Lerp fan speed based on activity
    const targetSpeed = isGenerating ? 25 : 3; 
    
    if (fan1Ref.current) fan1Ref.current.rotation.y += delta * targetSpeed;
    if (fan2Ref.current) fan2Ref.current.rotation.y += delta * targetSpeed;
  });

  return (
    <group 
      position={[-3.5, 0.6, 0]}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('apple'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Sleek Enclosure */}
      <RoundedBox args={[2.6, 0.5, 1.4]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Side Vent Detailing */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.5, 0.06, 1.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>

      {/* Dual Rotating Fans */}
      {[-0.6, 0.6].map((xOffset, index) => (
        <group key={`fan-group-${index}`} position={[xOffset, 0.26, 0]}>
          {/* Fan chassis cutout */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          {/* Fan blades */}
          <group ref={index === 0 ? fan1Ref : fan2Ref}>
            {Array.from({ length: 7 }).map((_, i) => (
              <mesh key={`blade-${i}`} rotation={[0, (i * Math.PI * 2) / 7, 0]} position={[0, 0.02, 0]}>
                <boxGeometry args={[0.08, 0.02, 0.8]} />
                <MeshTransmissionMaterial 
                  color="#fff" 
                  transmission={0.9} 
                  opacity={1} 
                  roughness={0.1} 
                  ior={1.5} 
                  thickness={0.05} 
                  transparent
                />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Label */}
      <group position={[0, 0.45, 0.5]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.0, 0.2]} />
          <meshBasicMaterial color="#0A0A0A" transparent opacity={0.6} />
        </mesh>
        <Text
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
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
      <group position={[0, 1.5, 0]}>
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

/* ─── Enterprise Bridge — SAP SE ─── */
function SAPBridge() {
  const groupRef = useRef<THREE.Group>(null);
  const isHovered = useOSStore((s) => s.hoveredComponents.includes('sap'));

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.45 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  const layers = [
    { width: 1.8, depth: 1.0, yOffset: 0, opacity: 0.9 },
    { width: 1.5, depth: 0.8, yOffset: 0.15, opacity: 0.7 },
    { width: 1.2, depth: 0.6, yOffset: 0.3, opacity: 0.5 },
    { width: 0.9, depth: 0.4, yOffset: 0.45, opacity: 0.3 },
  ];

  return (
    <group 
      position={[-2, 0.45, 2]} 
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); useOSStore.getState().setSelectedCompany('sap'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Data tiers */}
      {layers.map((layer, i) => (
        <mesh key={`sap-layer-${i}`} position={[0, layer.yOffset, 0]}>
          <boxGeometry args={[layer.width, 0.1, layer.depth]} />
          <meshStandardMaterial
            color="#111"
            emissive="#008FD3"
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            transparent
            opacity={layer.opacity}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#fff" emissive="#008FD3" emissiveIntensity={1.5} />
      </mesh>
      
      {/* Label */}
      <group position={[0, 0.7, 0]}>
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
          {'SAP // Data Bus'}
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
      groupRef.current.rotation.y += delta * 0.2;
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
          <RAMStick position={[3, 0.8, -0.8]} label="MEM_0: Computer Science" />
          <RAMStick position={[3, 0.8, 0]} label="MEM_1: Business Admin" />
          <RAMStick position={[3, 0.8, 0.8]} label="MEM_2: LeetCode" />

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
