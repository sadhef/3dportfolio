"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

// Enhanced stars component with dynamic effects
const Stars = ({ count = 15000 }) => {
  const ref = useRef();
  const { mouse, viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Create stars with varied sizes for depth effect
  const [sphere, sizes, colors] = useMemo(() => {
    // Create star positions
    const positions = random.inSphere(new Float32Array(count * 3), { radius: 1.5 });
    
    // Create varied sizes for each star
    const sizes = new Float32Array(count);
    // Create colors for each star
    const colors = new Float32Array(count * 3);
    
    const color = new THREE.Color();
    const starTypes = [
      {color: "#ffffff", probability: 0.6},  // White stars (most common)
      {color: "#9bb0ff", probability: 0.15}, // Blue stars
      {color: "#ffd89b", probability: 0.15}, // Yellow stars
      {color: "#ffb6b6", probability: 0.05}, // Red stars
      {color: "#baffda", probability: 0.05}  // Green/teal stars
    ];
    
    // Assign varied sizes and colors to create depth and realism
    for (let i = 0; i < count; i++) {
      // Size based on random distribution (some stars bigger than others)
      const sizeVariation = Math.random();
      sizes[i] = Math.max(0.001, 0.003 * sizeVariation * sizeVariation * 3);
      
      // Random color based on probability distribution of real stars
      const rand = Math.random();
      let colorIndex = 0;
      let sum = 0;
      
      for (let j = 0; j < starTypes.length; j++) {
        sum += starTypes[j].probability;
        if (rand <= sum) {
          colorIndex = j;
          break;
        }
      }
      
      color.set(starTypes[colorIndex].color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, sizes, colors];
  }, [count]);
  
  // Add twinkle effect to stars
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (ref.current) {
      // Basic rotation
      ref.current.rotation.x = time * -0.0004;
      ref.current.rotation.y = time * -0.00025;
      
      // Make stars respond to mouse movement
      if (hovered) {
        // Calculate mouse position in normalized device coordinates
        const x = mouse.x * viewport.width / 2;
        const y = mouse.y * viewport.height / 2;
        
        // Subtle movement towards mouse position
        ref.current.position.x += (x * 0.01 - ref.current.position.x) * 0.05;
        ref.current.position.y += (y * 0.01 - ref.current.position.y) * 0.05;
      } else {
        // Smoothly return to center when not hovered
        ref.current.position.x *= 0.95;
        ref.current.position.y *= 0.95;
      }
      
      // Twinkle effect - modify the size attribute
      const sizesAttr = ref.current.geometry.attributes.size;
      for (let i = 0; i < count; i++) {
        const originalSize = sizes[i];
        // Sinusoidal variation based on time and position for natural twinkle
        const twinkleFactor = 0.3 * Math.sin(time * 2 + i * 100) + 0.7;
        sizesAttr.array[i] = originalSize * twinkleFactor;
      }
      sizesAttr.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        sizes={sizes}
        colors={colors}
      >
        <PointMaterial
          transparent
          vertexColors
          size={1}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Add a subtle pulsing nebula effect in the background
const Nebula = () => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    if (meshRef.current) {
      // Gentle pulsing effect
      meshRef.current.material.opacity = 0.2 + Math.sin(t) * 0.05;
      meshRef.current.scale.set(
        1.5 + Math.sin(t * 0.5) * 0.05, 
        1.5 + Math.cos(t * 0.7) * 0.05, 
        1
      );
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial 
        color={new THREE.Color("#050a30")} 
        transparent={true} 
        opacity={0.2} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Add shooting stars that occasionally cross the scene
const ShootingStars = ({ count = 10 }) => {
  const ref = useRef();
  const trails = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Each shooting star is inactive initially
      temp.push({
        active: false,
        startTime: 0,
        position: [0, 0, 0],
        velocity: [0, 0, 0]
      });
    }
    return temp;
  }, [count]);
  
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const sizes = useMemo(() => new Float32Array(count), [count]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const positionsArray = positions;
    const sizesArray = sizes;
    
    // Small chance to activate an inactive shooting star
    if (Math.random() < 0.005) {
      const inactiveIndex = trails.findIndex(trail => !trail.active);
      if (inactiveIndex !== -1) {
        // Start a new shooting star from a random edge of the screen
        const angle = Math.random() * Math.PI * 2;
        trails[inactiveIndex] = {
          active: true,
          startTime: time,
          position: [
            Math.cos(angle) * 2, 
            Math.sin(angle) * 2, 
            (Math.random() - 0.5) * 0.5
          ],
          velocity: [
            -Math.cos(angle) * 0.05 - 0.01 + Math.random() * 0.02,
            -Math.sin(angle) * 0.05 - 0.01 + Math.random() * 0.02,
            0
          ]
        };
      }
    }
    
    // Update all active shooting stars
    for (let i = 0; i < count; i++) {
      if (trails[i].active) {
        // Update position based on velocity
        trails[i].position[0] += trails[i].velocity[0];
        trails[i].position[1] += trails[i].velocity[1];
        trails[i].position[2] += trails[i].velocity[2];
        
        // Update position array
        positionsArray[i * 3] = trails[i].position[0];
        positionsArray[i * 3 + 1] = trails[i].position[1];
        positionsArray[i * 3 + 2] = trails[i].position[2];
        
        // Make shooting star visible
        sizesArray[i] = 0.03;
        
        // Deactivate if it's been active for too long or left the scene
        const duration = time - trails[i].startTime;
        if (duration > 2 || 
            Math.abs(trails[i].position[0]) > 2 || 
            Math.abs(trails[i].position[1]) > 2) {
          trails[i].active = false;
          sizesArray[i] = 0; // Hide it
        }
      } else {
        // Make inactive stars invisible
        sizesArray[i] = 0;
      }
    }
    
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.geometry.attributes.size.needsUpdate = true;
    }
  });
  
  return (
    <Points ref={ref} positions={positions} sizes={sizes}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Main component that combines all effects
const StarsCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on a mobile device
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="w-full h-full fixed inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false
        }}
      >
        <Nebula />
        <Stars count={isMobile ? 5000 : 15000} />
        <ShootingStars count={isMobile ? 5 : 10} />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;