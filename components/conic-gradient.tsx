import React from "react";
import { Canvas, Rect, SweepGradient, Skia, Shader, vec, Mask, Group, Circle } from "@shopify/react-native-skia";
import { rotate } from "react-native-redash";
type props = {
  colors: string[];
  size: number;
};

export default function ConicCircle({ colors, size }: props) {
  return (
    <Canvas style={{ flex: 1, transform: "rotate(90deg)" }}>
      <Circle cx={size / 2} cy={size / 2} r={size / 2}>
        <SweepGradient c={vec(size / 2, size / 2)} colors={colors} />
      </Circle>
    </Canvas>
  );
}
