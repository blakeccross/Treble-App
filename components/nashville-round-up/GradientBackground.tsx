import { LinearGradient } from "tamagui/linear-gradient";
import { Canvas, Rect, FractalNoise, Skia, Shader, Fill, vec } from "@shopify/react-native-skia";

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient width="100%" height="100%" colors={["$green10", "$green8"]} start={[0.5, 1]} end={[0, 0]}>
      {children}
    </LinearGradient>
  );
}

const FractalNoiseDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="white" />
      <Rect x={0} y={0} width={256} height={256}>
        <FractalNoise freqX={0.05} freqY={0.05} octaves={4} />
      </Rect>
    </Canvas>
  );
};
