import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Clapper = ({ isMobile }) => {
  const group = useRef();
  const { scene, animations } = useGLTF("./clapper/scene.glb");

  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      // Play the first available animation once on load
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  return (
    <group ref={group}>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />

      <primitive
        object={scene}
        scale={isMobile ? 1.1 : 1.3}
        position={isMobile ? [0, -2.4, -2] : [0, -2.8, -1.5]}
        rotation={[-0.02, -0.3, 0]}
      />
    </group>
  );
};

const ClapperCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Optional: Uncomment for orbit controls */}
        {<OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />}

        <Clapper isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ClapperCanvas;

