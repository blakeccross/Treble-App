import type { ViewStyle, Animated } from "react-native";

export declare type TransitionSpec =
  | {
      animation: "spring";
      config: Omit<Animated.SpringAnimationConfig, "toValue">;
    }
  | {
      animation: "timing";
      config: Omit<Animated.TimingAnimationConfig, "toValue">;
    };

export type ScreenInterpolatorProps = {
  position: Animated.AnimatedInterpolation<number>;
  scene: { index: number };
};

export type ScreenInterpolator = (props: ScreenInterpolatorProps) => Partial<ViewStyle>;

export type TransitionConfig = {
  transitionSpec: TransitionSpec;
  screenInterpolator: ScreenInterpolator;
  debug?: boolean;
};
