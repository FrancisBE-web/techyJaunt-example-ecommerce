import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { CategoryModel, Studio } from "./Stations";

export default function ProductStage({ category, color, reducedMotion }) {
  return (
    <Canvas
      className="stage-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Studio />
      <pointLight color={color} intensity={14} distance={8} position={[0, 0.5, 2.5]} />
      <CategoryModel category={category} color={color} float={!reducedMotion} />
      <Sparkles count={30} scale={[5, 4, 3]} size={2} speed={0.25} color={color} />
      <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={9} blur={2.4} far={4} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.6} intensity={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
