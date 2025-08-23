import React from "react";
import { View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const DiamondPattern = ({ color, width, height }: { color: string; width: number; height: number }) => {
  const diamondSize = 20; // Size of each diamond
  const rows = Math.ceil(height / diamondSize);
  const cols = Math.ceil(width / diamondSize);

  const generateDiamond = (x: number, y: number) => {
    return (
      <Polygon
        key={`${x}-${y}`}
        points={`${x},${y - diamondSize / 2} ${x + diamondSize / 2},${y} ${x},${y + diamondSize / 2} ${x - diamondSize / 2},${y}`}
        fill={color}
      />
    );
  };

  const diamonds = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * diamondSize + diamondSize / 2;
      const y = row * diamondSize + diamondSize / 2;
      diamonds.push(generateDiamond(x, y));
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: width, height: height }}>
      <Svg width={width} height={height}>
        {diamonds}
      </Svg>
    </View>
  );
};

export default DiamondPattern;
