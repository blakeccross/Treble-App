import { Animated } from "react-native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";

export default function GoldenRaysCardEffect({ isSelected }: { isSelected: boolean }) {
  const raysStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0, { duration: 300 }),
    transform: [{ scale: withTiming(isSelected ? 1.2 : 0.5, { duration: 300 }) }],
  }));
  return (
    <Animated.View style={[{ position: "absolute", top: "-30%", left: "-20%" }]}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        {[...Array(10)].map((_, i) => (
          <Line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 40 * Math.cos((i * 36 * Math.PI) / 180)}
            y2={50 + 40 * Math.sin((i * 36 * Math.PI) / 180)}
            stroke="gold"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </Animated.View>
  );
}
