import React, { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
  PerspectiveCamera,
  useProgress,
  Html
} from "@react-three/drei";

// Enhanced loader component with progress indication
const ModelLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

// Enhanced lighting setup
const SceneLighting = () => {
  return (
    <>
      <hemisphereLight intensity={0.3} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <ambientLight intensity={0.4} />
    </>
  );
};

// Computer model component with enhanced materials and animations
const ComputerModel = ({ isMobile, scale = 0.75 }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  
  // Memoize transform values
  const modelProps = useMemo(() => ({
    scale: isMobile ? scale * 0.7 : scale,
    position: isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5],
    rotation: [-0.01, -0.2, -0.1]
  }), [isMobile, scale]);

  // Optional: Add subtle animation
  useEffect(() => {
    if (computer.scene) {
      computer.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [computer]);

  return (
    <primitive
      object={computer.scene}
      {...modelProps}
    />
  );
};

// Main canvas component with enhanced controls and performance optimizations
const ComputersCanvas = ({ className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Camera settings
  const cameraSettings = useMemo(() => ({
    position: [20, 3, 5],
    fov: 25,
    near: 0.1,
    far: 1000
  }), []);

  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={cameraSettings}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true
        }}
        style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2a2a2a)' }}
      >
        <Suspense fallback={<ModelLoader />}>
          <PerspectiveCamera makeDefault {...cameraSettings} />
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
          />
          <SceneLighting />
          <ComputerModel isMobile={isMobile} />
          <Environment preset="city" />
        </Suspense>
        <Preload all />
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
        <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-gray-100">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Sorry, there was a problem loading the 3D model
            </h2>
            <p className="mt-2 text-gray-600">
              Please try refreshing the page
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export wrapped component with error boundary
export default function SafeComputersCanvas(props) {
  return (
    <Scene3DErrorBoundary>
      <ComputersCanvas {...props} />
    </Scene3DErrorBoundary>
  );
}