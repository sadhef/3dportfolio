// src/components/Loader.jsx
import { Html } from "@react-three/drei";

const CanvasLoader = () => {
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="w-8 h-8 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></div>
    </Html>
  );
};

export default CanvasLoader;