import { LiquidMetal } from "@paper-design/shaders-react";
import { useReducedMotion } from "../hooks";

// The brand mark rendered in liquid metal (Paper Shaders, from paper-design/liquid-logo).
export default function LiquidMark({ size = 40, className = "" }) {
  const reducedMotion = useReducedMotion();

  return (
    <LiquidMetal
      className={`liquid-mark ${className}`}
      width={size}
      height={size}
      image="/aether-mark.svg"
      colorBack="#00000000"
      colorTint="#5ef2ff"
      repetition={4}
      softness={0.35}
      shiftRed={0.3}
      shiftBlue={0.3}
      distortion={0.1}
      contour={0.6}
      angle={70}
      shape="none"
      fit="contain"
      scale={0.9}
      speed={reducedMotion ? 0 : 0.8}
    />
  );
}
