'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useOSStore } from '@/store/useOSStore';

interface NeonTracerProps {
  points: [number, number, number][];
  color?: string;
  speed?: number;
  lineWidth?: number;
}

export default function NeonTracer({
  points,
  color = '#00F5FF',
  speed = 0.5,
  lineWidth = 2,
}: NeonTracerProps) {
  const glowRef = useRef<THREE.Group>(null);

  // Animate opacity pulsing for a "data flowing" effect
  useFrame((state) => {
    if (glowRef.current) {
      // Transient subscription prevents React re-renders while still accessing the global state
      const isGenerating = useOSStore.getState().isGenerating;
      const currentSpeed = isGenerating ? speed * 5 : speed;
      
      const pulse = Math.sin(state.clock.elapsedTime * currentSpeed * 3) * 0.3 + 0.7;
      glowRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.Material;
          if ('opacity' in mat) {
            mat.opacity = pulse * 0.15;
          }
        }
      });
    }
  });

  // Build a smooth curve through the control points
  const vec3Points = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vec3Points);
  const curvePoints = curve
    .getPoints(50)
    .map((p) => [p.x, p.y, p.z] as [number, number, number]);

  return (
    <group>
      {/* Glow background line (wider, dimmer) */}
      <group ref={glowRef}>
        <Line
          points={curvePoints}
          color={color}
          lineWidth={lineWidth * 3}
          transparent
          opacity={0.15}
        />
      </group>

      {/* Core bright line */}
      <Line
        points={curvePoints}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={0.8}
      />
    </group>
  );
}
