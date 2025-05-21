"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

// Regular stars component with twinkling effect
const Stars = ({ count = 10000 }) => {
  const ref = useRef();
  const [twinkleData, setTwinkleData] = useState([]);
  
  // Create stars only once using useMemo for performance
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius: 1.5 });
  }, [count]);
  
  // Create twinkling effect data
  useEffect(() => {
    // Only make about 15% of stars twinkle for performance
    const twinkleCount = Math.floor(count * 0.15);
    const newTwinkleData = [];
    
    for (let i = 0; i < twinkleCount; i++) {
      // Random star index
      const starIndex = Math.floor(Math.random() * count);
      // Random speed for twinkling
      const speed = 0.3 + Math.random() * 0.7;
      // Random phase offset
      const offset = Math.random() * Math.PI * 2;
      
      newTwinkleData.push({
        index: starIndex,
        speed,
        offset
      });
    }
    
    setTwinkleData(newTwinkleData);
  }, [count]);
  
  // Create attributes for twinkling
  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    sizes.fill(0.002);
    return sizes;
  }, [count]);
  
  const sizesRef = useRef();
  
  // Slow, smooth rotation for the star field and update twinkling
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x -= 0.0005;
      ref.current.rotation.y -= 0.00015;
    }
    
    // Update twinkling stars
    if (sizesRef.current && twinkleData.length > 0) {
      const time = clock.getElapsedTime();
      const sizes = sizesRef.current.array;
      
      twinkleData.forEach(({ index, speed, offset }) => {
        // Sine wave oscillation for natural twinkling
        const s = 0.002 + 0.003 * Math.abs(Math.sin(time * speed + offset));
        sizes[index] = s;
      });
      
      sizesRef.current.needsUpdate = true;
    }
  });
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#f5f5f5"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          sizesRef={sizesRef}
          sizes={sizes}
        />
      </Points>
    </group>
  );
};

// Shooting star component
const ShootingStar = () => {
  const lineRef = useRef();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ start: [0, 0, 0], end: [0, 0, 0] });
  const [lifetime, setLifetime] = useState(0);
  const [opacity, setOpacity] = useState(1);
  
  // Reset shooting star with new random position
  const resetStar = () => {
    // Random starting position in the upper hemisphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.5;
    const radius = 1.4 + Math.random() * 0.1;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Direction vector (falling down and to a side)
    const length = 0.3 + Math.random() * 0.7;
    const dirX = -x * length * (0.5 + Math.random() * 0.5);
    const dirY = -y * length * (0.5 + Math.random() * 0.5);
    const dirZ = -z * 0.1; // Slight z direction change
    
    setPosition({
      start: [x, y, z],
      end: [x + dirX, y + dirY, z + dirZ]
    });
    
    // Random lifetime between 0.5-1.5 seconds
    setLifetime(0.5 + Math.random());
    setOpacity(1);
    setVisible(true);
  };
  
  // Wait random time before showing next shooting star
  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        resetStar();
      }, 1000 + Math.random() * 6000); // Random delay between 1-7 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [visible]);
  
  // Animate the shooting star
  useFrame(({ clock }) => {
    if (visible && lineRef.current) {
      const delta = clock.getDelta();
      setOpacity(prev => {
        const newOpacity = prev - delta / lifetime;
        
        if (newOpacity <= 0) {
          setVisible(false);
          return 0;
        }
        
        return newOpacity;
      });
    }
  });
  
  if (!visible) return null;
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([
            ...position.start,
            ...position.end
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={opacity}
        linewidth={1}
      />
    </line>
  );
};

// Multiple shooting stars
const ShootingStars = ({ count = 5 }) => {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <ShootingStar key={i} />
      ))}
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
          depth: false
        }}
      >
        <Stars />
        <ShootingStars />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;