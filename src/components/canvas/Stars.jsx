"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

const Stars = ({ count = 10000 }) => {
  const ref = useRef();

  // Generate star data: positions, sizes, and colors
  const { positions, sizes, colors } = useMemo(() => {
    const positions = random.inSphere(new Float32Array(count * 3), { radius: 1.5 });
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const z = positions[i * 3 + 2];
      const depthFactor = (1.5 - z) / 3; // normalize depth (0 to 1 roughly)

      // Size varies from 0.001 to 0.004 based on depth
      sizes[i] = 0.001 + depthFactor * 0.003;

      // Color gradient from bluish (far) to white/yellow (near)
      colors[i * 3] = 0.7 + 0.3 * depthFactor;     // R
      colors[i * 3 + 1] = 0.7 + 0.3 * depthFactor; // G
      colors[i * 3 + 2] = 1.0 - 0.5 * depthFactor; // B
    }

    return { positions, sizes, colors };
  }, [count]);

  // Create buffer geometry and set attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, sizes, colors]);

  // Animate rotation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x -= 0.0005;
      ref.current.rotation.y -= 0.00015;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} geometry={geometry} frustumCulled>
        <PointMaterial
          vertexColors={true} // Enable per-vertex colors
          transparent
          size={0.003}          // Base size multiplier
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-full fixed inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
      >
        <Stars />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
