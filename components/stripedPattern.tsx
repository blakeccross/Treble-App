import React from "react";
import { View } from "react-native";
import Svg, { Defs, Pattern, Rect, Line, G } from "react-native-svg";

type props = {
  color1: string;
  color2: string;
  size: number;
  strokeWidth: number;
};

export default function DiagonalStripedPattern({ color1, color2, size, strokeWidth }: props) {
  return (
    <Svg width={"100%"} height={"100%"} style={{ backgroundColor: color1 }}>
      <Defs>
        <Pattern id="diagonalPattern" width={size} height={size} patternUnits="userSpaceOnUse">
          <Line x1={(size / 2) * -1} x2={size / 2} y1={size / 2} y2={(size / 2) * -1} stroke={color2} strokeWidth={strokeWidth} />
          <Line x1={0} x2={size} y1={size} y2={0} stroke={color2} strokeWidth={strokeWidth} />
          <Line x1={size / 2} x2={size + size / 2} y1={size + size / 2} y2={size / 2} stroke={color2} strokeWidth={strokeWidth} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#diagonalPattern)" />
    </Svg>
  );
}
