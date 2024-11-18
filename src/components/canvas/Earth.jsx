import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Stars,
  Html,
  useProgress,
  PerspectiveCamera,
  Environment,
  ContactShadows
} from "@react-three/drei";

// Enhanced loader with progress indication
const ModelLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin" />
        <p className="mt-4 text-lg font-medium text-white">
          Loading Earth... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

// Atmospheric glow effect
const Atmosphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2.7, 32, 32]} />
      <meshBasicMaterial
        color="#4040ff"
        transparent
        opacity={0.15}
        side={2}
      />
    </mesh>
  );
};

// Enhanced Earth model with animations and effects
const Earth = ({ isRotating = true }) => {
  const earthRef = useRef();
  const earth = useGLTF("./planet/scene.gltf");
  const [hovered, setHovered] = useState(false);

  // Handle hover effects
  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Smooth rotation animation
  useFrame((state, delta) => {
    if (isRotating && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15;
    }
  });

  // Enhance materials and shadows
  useEffect(() => {
    if (earth.scene) {
      earth.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.envMapIntensity = 0.8;
        }
      });
    }
  }, [earth]);

  return (
    <group>
      <primitive
        ref={earthRef}
        object={earth.scene}
        scale={2.5}
        position-y={0}
        rotation-y={0}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      <Atmosphere />
    </group>
  );
};

// Enhanced scene lighting
const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        position={[10, 10, 10]}
        intensity={1.5}
        castShadow
      />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
};

// Background stars with animation
const AnimatedStars = () => {
  const starsRef = useRef();

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
    </group>
  );
};

// Main Earth canvas component
const EarthCanvas = ({ className = "" }) => {
  const [isRotating, setIsRotating] = useState(true);

  const handleToggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] ${className}`}>
      {/* Control panel */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleToggleRotation}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg 
                     text-white hover:bg-white/20 transition-colors
                     flex items-center space-x-2"
        >
          <span>{isRotating ? "Pause" : "Resume"} Rotation</span>
        </button>
      </div>

      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
        }}
        style={{
          background: 'radial-gradient(circle at center, #1a1a2f 0%, #000000 100%)'
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-4, 3, 6]}
          fov={45}
          near={0.1}
          far={200}
        />

        <Suspense fallback={<ModelLoader />}>
          <OrbitControls
            autoRotate={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
          />

          <SceneLighting />
          <AnimatedStars />
          <Earth isRotating={isRotating} />
          
          <Environment preset="city" />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Error boundary wrapper
class Scene3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-gray-900">
          <div className="text-center text-white">
            <h2 className="text-xl font-semibold">
              Unable to load Earth visualization
            </h2>
            <p className="mt-2 text-gray-400">
              Please refresh the page to try again
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export wrapped component with error boundary
export default function SafeEarthCanvas(props) {
  return (
    <Scene3DErrorBoundary>
      <EarthCanvas {...props} />
    </Scene3DErrorBoundary>
  );
}