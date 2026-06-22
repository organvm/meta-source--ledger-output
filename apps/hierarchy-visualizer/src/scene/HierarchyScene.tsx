/**
 * Three.js scene rendering the universal hierarchy as a vertical tower.
 *
 * Each stratum is a horizontal plane. Lenses are spheres positioned
 * on their stratum. Cross-stratum edges are lines connecting lenses.
 * The strange loop is rendered as a glowing curved line from /dev/ to /boot/.
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  STRATA,
  LENSES,
  STRANGE_LOOP_EDGES,
  CROSS_STRATUM_EDGES,
  getStratumByPath,
} from '../data/hierarchy';

interface LensNodeProps {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  active?: boolean;
}

function LensNode({ name, position, color, active = true }: LensNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowIntensity = active ? 1.0 : 0.3;

  useFrame((_, delta) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity * 0.3}
        />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>
    </group>
  );
}

interface EdgeLineProps {
  from: [number, number, number];
  to: [number, number, number];
  isStrangeLoop?: boolean;
}

function EdgeLine({ from, to, isStrangeLoop = false }: EdgeLineProps) {
  const color = isStrangeLoop ? '#ff6b6b' : '#555555';
  const lineWidth = isStrangeLoop ? 2 : 1;

  if (isStrangeLoop) {
    // Curved line for the strange loop
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2 + 4,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2 + 2,
    ];
    return (
      <Line
        points={[from, mid, to]}
        color={color}
        lineWidth={lineWidth}
        dashed
        dashSize={0.3}
        gapSize={0.15}
      />
    );
  }

  return <Line points={[from, to]} color={color} lineWidth={lineWidth} />;
}

function StratumPlane({ stratum }: { stratum: typeof STRATA[number] }) {
  return (
    <group position={[0, stratum.yPosition, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial
          color={stratum.color}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[-6.5, 0, 0]}
        fontSize={0.3}
        color={stratum.color}
        anchorX="left"
      >
        {stratum.path} {stratum.label}
      </Text>
    </group>
  );
}

function getLensPosition(lens: typeof LENSES[number]): [number, number, number] {
  const stratum = getStratumByPath(lens.stratum);
  const y = stratum?.yPosition ?? 0;
  // Spread lenses horizontally within their stratum
  const lensesInStratum = LENSES.filter(l => l.stratum === lens.stratum);
  const localIndex = lensesInStratum.indexOf(lens);
  const spread = lensesInStratum.length;
  const x = (localIndex - (spread - 1) / 2) * 2.5;
  return [x, y, 0];
}

function HierarchyContent() {
  const lensPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    LENSES.forEach((lens) => {
      positions[lens.id] = getLensPosition(lens);
    });
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 20, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#4a90d9" />

      {/* Stratum planes */}
      {STRATA.map(s => (
        <StratumPlane key={s.path} stratum={s} />
      ))}

      {/* Lens nodes */}
      {LENSES.map(lens => {
        const stratum = getStratumByPath(lens.stratum);
        return (
          <LensNode
            key={lens.id}
            id={lens.id}
            name={lens.name}
            position={lensPositions[lens.id]}
            color={stratum?.color ?? '#ffffff'}
          />
        );
      })}

      {/* Cross-stratum edges */}
      {CROSS_STRATUM_EDGES.map(([from, to]) => {
        const fromPos = lensPositions[from];
        const toPos = lensPositions[to];
        if (!fromPos || !toPos) return null;
        return (
          <EdgeLine
            key={`${from}-${to}`}
            from={fromPos}
            to={toPos}
          />
        );
      })}

      {/* Strange loop edges */}
      {STRANGE_LOOP_EDGES.map(([from, to]) => {
        const fromPos = lensPositions[from];
        const toPos = lensPositions[to];
        if (!fromPos || !toPos) return null;
        return (
          <EdgeLine
            key={`loop-${from}-${to}`}
            from={fromPos}
            to={toPos}
            isStrangeLoop
          />
        );
      })}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={40}
        target={[0, 9, 0]}
      />
    </>
  );
}

export function HierarchyScene() {
  return (
    <Canvas
      camera={{ position: [15, 12, 15], fov: 50 }}
      style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}
    >
      <HierarchyContent />
    </Canvas>
  );
}
