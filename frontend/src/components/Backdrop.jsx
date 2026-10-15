import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useReducedMotion } from "../hooks";

export default function Backdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="backdrop" aria-hidden="true">
      <ShaderGradientCanvas
        className="backdrop-canvas"
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
        powerPreference="low-power"
        lazyLoad={false}
        style={{ position: "absolute", inset: 0 }}
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate={reducedMotion ? "off" : "on"}
          uTime={0.4}
          uSpeed={0.12}
          uStrength={2.6}
          uDensity={1.3}
          uFrequency={5.5}
          uAmplitude={1}
          positionX={0}
          positionY={0.9}
          positionZ={0}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          color1="#05060b"
          color2="#3b2bd1"
          color3="#0fb5d6"
          reflection={0.1}
          cAzimuthAngle={180}
          cPolarAngle={80}
          cDistance={2.6}
          cameraZoom={9}
          lightType="3d"
          brightness={0.9}
          grain="off"
        />
      </ShaderGradientCanvas>
      <div className="backdrop-veil" />
    </div>
  );
}
