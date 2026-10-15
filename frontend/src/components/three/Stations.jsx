import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace } from "three";

// Procedural studio lighting: no HDR file is downloaded.
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#5ef2ff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 1, 1]} />
        <Lightformer form="rect" intensity={2} color="#9b7bff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 1, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={6} />
      </Environment>
    </>
  );
}

function Chrome(props) {
  return <meshStandardMaterial color="#1b1f2c" metalness={0.95} roughness={0.18} {...props} />;
}

function Glow({ color, intensity = 2.4, ...props }) {
  return (
    <meshStandardMaterial
      color="#000000"
      emissive={color}
      emissiveIntensity={intensity}
      toneMapped={false}
      {...props}
    />
  );
}

function drawScreen(color, wide) {
  const canvas = document.createElement("canvas");
  canvas.width = wide ? 512 : 256;
  canvas.height = wide ? 320 : 512;
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;

  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#05060b");
  base.addColorStop(0.55, color + "55");
  base.addColorStop(1, color);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.8);
  glow.addColorStop(0, "rgba(255,255,255,0.35)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const pad = w * 0.08;
  ctx.fillRect(pad, h * 0.1, w * 0.35, h * 0.025);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let i = 0; i < 3; i += 1) {
    ctx.fillRect(pad, h * (0.16 + i * 0.04), w * (0.6 - i * 0.12), h * 0.015);
  }
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  const cols = wide ? 3 : 2;
  const cell = (w - pad * (cols + 1)) / cols;
  for (let i = 0; i < cols * 2; i += 1) {
    const x = pad + (i % cols) * (cell + pad);
    const y = h * 0.42 + Math.floor(i / cols) * (cell * (wide ? 0.6 : 0.9) + pad);
    ctx.beginPath();
    ctx.roundRect(x, y, cell, cell * (wide ? 0.55 : 0.85), 12);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Screen({ color, wide = false, args }) {
  const texture = useMemo(() => drawScreen(color, wide), [color, wide]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position-z={0.001}>
      <planeGeometry args={args} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Phone({ color }) {
  return (
    <group rotation={[0.1, -0.5, 0.08]} scale={0.82}>
      <RoundedBox args={[1.3, 2.6, 0.14]} radius={0.12} smoothness={6}>
        <Chrome />
      </RoundedBox>
      <group position={[0, 0, 0.075]}>
        <Screen color={color} args={[1.12, 2.38]} />
      </group>
      <mesh position={[0, 1.08, 0.08]}>
        <capsuleGeometry args={[0.04, 0.22, 4, 12]} />
        <meshBasicMaterial color="#05060b" />
      </mesh>
      <group position={[-0.38, 0.95, -0.08]}>
        {[0, 0.28].map((y) => (
          <mesh key={y} position={[0, -y, 0]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
            <Chrome color="#0b0d14" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Laptop({ color }) {
  return (
    <group rotation={[0.25, -0.6, 0]} scale={0.8}>
      <RoundedBox args={[3, 0.1, 2]} radius={0.05} smoothness={4}>
        <Chrome />
      </RoundedBox>
      <mesh position={[0, 0.055, 0.25]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.5, 1]} />
        <Glow color={color} intensity={0.25} />
      </mesh>
      <group position={[0, 0.05, -1]} rotation-x={-0.25}>
        <RoundedBox args={[3, 1.95, 0.07]} radius={0.04} smoothness={4} position={[0, 0.97, 0]}>
          <Chrome />
        </RoundedBox>
        <group position={[0, 0.97, 0.04]}>
          <Screen color={color} wide args={[2.8, 1.75]} />
        </group>
      </group>
    </group>
  );
}

function Headphones({ color }) {
  const waves = useRef();
  useFrame(({ clock }) => {
    if (!waves.current) return;
    waves.current.children.forEach((ring, index) => {
      const t = (clock.elapsedTime * 0.45 + index / 3) % 1;
      ring.scale.setScalar(0.6 + t * 1.6);
      ring.material.opacity = 0.7 * (1 - t);
    });
  });

  return (
    <group rotation={[0, -0.4, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[1.05, 0.08, 16, 64, Math.PI]} />
        <Chrome />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, -0.05, 0]} rotation-z={Math.PI / 2}>
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 0.34, 40]} />
            <Chrome />
          </mesh>
          <mesh position={[0, x > 0 ? 0.18 : -0.18, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 40]} />
            <Glow color={color} />
          </mesh>
        </group>
      ))}
      <group ref={waves}>
        {[0, 1, 2].map((index) => (
          <mesh key={index}>
            <torusGeometry args={[1, 0.008, 8, 96]} />
            <meshBasicMaterial color={color} transparent toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Controller({ color }) {
  return (
    <group rotation={[0.55, -0.35, 0]} scale={0.85}>
      <RoundedBox args={[2.6, 1.1, 0.5]} radius={0.24} smoothness={6}>
        <Chrome />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.95, -0.55, 0]} scale={[0.5, 0.8, 0.45]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <Chrome />
        </mesh>
      ))}
      <group position={[-0.75, 0.1, 0.26]}>
        <mesh>
          <boxGeometry args={[0.42, 0.12, 0.05]} />
          <Glow color={color} intensity={1.4} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.12, 0.42, 0.05]} />
          <Glow color={color} intensity={1.4} />
        </mesh>
      </group>
      {[
        [0.75, 0.28],
        [0.95, 0.1],
        [0.75, -0.08],
        [0.55, 0.1],
      ].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.26]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <Glow color={color} />
        </mesh>
      ))}
    </group>
  );
}

function Watch({ color }) {
  const orbit = useRef();
  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.z += delta * 0.4;
  });

  return (
    <group rotation={[0.2, -0.5, 0]}>
      <RoundedBox args={[1.1, 1.3, 0.32]} radius={0.22} smoothness={6}>
        <Chrome />
      </RoundedBox>
      <group position={[0, 0, 0.17]}>
        <Screen color={color} args={[0.8, 0.98]} />
      </group>
      {[1, -1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.8, 1.2, 0.12]}
          radius={0.06}
          smoothness={4}
          position={[0, side * 1.15, -0.08]}
          rotation-x={side * 0.35}
        >
          <meshStandardMaterial color="#10131c" roughness={0.6} metalness={0.3} />
        </RoundedBox>
      ))}
      <group ref={orbit} rotation-x={1.2}>
        <mesh>
          <torusGeometry args={[1.7, 0.012, 8, 120]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.6} />
        </mesh>
        {[0, 2.1, 4.2].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 1.7, Math.sin(angle) * 1.7, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <Glow color={color} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const MODELS = {
  phones: Phone,
  computers: Laptop,
  audio: Headphones,
  gaming: Controller,
  accessories: Watch,
};

export function CategoryModel({ category, color, float = true }) {
  const Model = MODELS[category] || Phone;
  if (!float) {
    return <Model color={color} />;
  }
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
      <Model color={color} />
    </Float>
  );
}
