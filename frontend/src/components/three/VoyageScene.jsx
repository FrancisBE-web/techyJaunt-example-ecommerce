import { Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Image, RoundedBox, Sparkles, Stars } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { MathUtils, Vector3 } from "three";
import { CATEGORIES } from "../../catalog";
import { CategoryModel, Studio } from "./Stations";

const SPACING = 14;

// Ease into each station so the camera lingers on it, then glides to the next.
const dwell = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// On narrow screens the objects sit centred and higher, above the text card.
function useLayout() {
  const narrow = useThree((state) => state.size.width / state.size.height < 0.9);
  const stations = useMemo(() => {
    const offset = narrow ? 0 : 2.1;
    const lift = narrow ? 1.1 : 0;
    return CATEGORIES.map(
      (_, index) => new Vector3(index % 2 ? -offset : offset, lift, -index * SPACING),
    );
  }, [narrow]);
  return { stations, scale: narrow ? 0.85 : 1.1, distance: narrow ? 9 : 6.2 };
}

function CameraRig({ progressRef, stations, distance }) {
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const span = (stations.length - 1) * MathUtils.clamp(progressRef.current, 0, 1);
    const index = Math.min(Math.floor(span), stations.length - 2);
    const blend = dwell(span - index);
    const from = stations[index];
    const to = stations[index + 1];

    look.lerpVectors(from, to, blend);
    target.set(look.x * 0.45 + state.pointer.x * 0.35, 0.25 + state.pointer.y * 0.2, look.z + distance);

    const camera = state.camera;
    camera.position.x = MathUtils.damp(camera.position.x, target.x, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, target.y, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, target.z, 3, delta);
    camera.lookAt(look.x * 0.6, look.y * 0.6, look.z);
  });

  return null;
}

// A product photo floating as a lit glass panel, turned slightly towards the centre.
function PhotoPanel({ url, color, side }) {
  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.5}>
      <group rotation={[0.04, -side * 0.28, 0]} scale={0.72}>
        <RoundedBox args={[3.46, 2.56, 0.04]} radius={0.13} smoothness={4} position-z={-0.03}>
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
        </RoundedBox>
        <Image url={url} scale={[3.4, 2.5]} radius={0.1} position-z={0.01} />
      </group>
    </Float>
  );
}

function Gate({ position, color }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[4.2, 0.015, 8, 160]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <mesh>
        <torusGeometry args={[4.5, 0.006, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function World({ progressRef, photos }) {
  const { stations, scale, distance } = useLayout();

  return (
    <>
      <CameraRig progressRef={progressRef} stations={stations} distance={distance} />
      <Studio />
      <Stars radius={60} depth={80} count={2500} factor={3} saturation={0} fade speed={0.6} />
      {CATEGORIES.map((category, index) => (
        <group key={category.id}>
          <group position={stations[index]} scale={scale}>
            {photos[category.id] ? (
              <Suspense fallback={<CategoryModel category={category.id} color={category.color} />}>
                <PhotoPanel
                  url={photos[category.id]}
                  color={category.color}
                  side={Math.sign(stations[index].x)}
                />
              </Suspense>
            ) : (
              <CategoryModel category={category.id} color={category.color} />
            )}
            <pointLight color={category.color} intensity={12} distance={7} position={[0, 0, 2]} />
            <Sparkles count={40} scale={[5, 4, 4]} size={2.2} speed={0.3} color={category.color} />
          </group>
          <Gate position={[0, stations[index].y, stations[index].z + 3.4]} color={category.color} />
        </group>
      ))}
    </>
  );
}

export default function VoyageScene({ progressRef, active = true, photos = {} }) {
  return (
    <Canvas
      className="voyage-canvas"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0.9, 0.25, 6.4], fov: 42, near: 0.1, far: 140 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#04050a"]} />
      <fog attach="fog" args={["#04050a", 10, 34]} />
      <World progressRef={progressRef} photos={photos} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.6} intensity={0.9} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
