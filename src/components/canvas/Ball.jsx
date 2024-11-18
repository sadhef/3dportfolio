import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
  Html,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei";

// Enhanced loader component
const BallLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-600">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

// Enhanced ball component with animations and effects
const Ball = ({ imgUrl, size = 2.75, color = '#fff8eb' }) => {
  const [decal] = useTexture([imgUrl]);
  const ballRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Handle hover effects
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Animate on interaction
  useFrame((state) => {
    if (ballRef.current) {
      // Subtle pulse animation when clicked
      if (clicked) {
        ballRef.current.scale.x = THREE.MathUtils.lerp(
          ballRef.current.scale.x,
          size * 1.2,
          0.1
        );
        ballRef.current.scale.y = THREE.MathUtils.lerp(
          ballRef.current.scale.y,
          size * 1.2,
          0.1
        );
        ballRef.current.scale.z = THREE.MathUtils.lerp(
          ballRef.current.scale.z,
          size * 1.2,
          0.1
        );
      } else {
        ballRef.current.scale.x = THREE.MathUtils.lerp(
          ballRef.current.scale.x,
          size,
          0.1
        );
        ballRef.current.scale.y = THREE.MathUtils.lerp(
          ballRef.current.scale.y,
          size,
          0.1
        );
        ballRef.current.scale.z = THREE.MathUtils.lerp(
          ballRef.current.scale.z,
          size,
          0.1
        );
      }
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={hovered ? 2 : 1} 
      floatIntensity={hovered ? 3 : 2}
    >
      <group>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
        />
        <directionalLight position={[0, 0, 0.05]} intensity={0.5} />

        {/* Ball mesh with enhanced materials */}
        <mesh
          ref={ballRef}
          castShadow
          receiveShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            color={color}
            polygonOffset
            polygonOffsetFactor={-5}
            flatShading
            roughness={0.3}
            metalness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            envMapIntensity={0.5}
          />
          
          {/* Enhanced decal placement */}
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={decal}
            flatShading
          />
        </mesh>

        {/* Subtle glow effect */}
        <mesh scale={[1.1, 1.1, 1.1]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={2}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Enhanced canvas component with better camera and controls
const BallCanvas = ({ icon, className = "" }) => {
  return (
    <div className={`relative w-full h-64 ${className}`}>
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
        }}
        style={{
          background: 'radial-gradient(circle at center, #ffffff 0%, #f0f0f0 100%)'
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 5]}
          fov={45}
          near={0.1}
          far={100}
        />

        <Suspense fallback={<BallLoader />}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping
            dampingFactor={0.05}
          />
          
          <Ball imgUrl={icon} />
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
        <div className="flex items-center justify-center w-full h-64 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Unable to load 3D icon
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export wrapped component with error boundary
export default function SafeBallCanvas(props) {
  return (
    <Scene3DErrorBoundary>
      <BallCanvas {...props} />
    </Scene3DErrorBoundary>
  );
}
