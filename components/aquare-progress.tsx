import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SquareProgress = ({
  size,
  strokeWidth,
  time,
  color,
  opacity,
  theta,
  isRunning,
}: {
  size: number;
  strokeWidth: number;
  time: number;
  color: string;
  opacity: number;
  theta: SharedValue<number>;
  isRunning: boolean;
}) => {
  const sideLength = size - strokeWidth;
  const perimeter = 4 * sideLength;

  const animatedProps = useAnimatedProps(() => {
    theta.value = withTiming(0, {
      duration: time * 1000,
    });
    if (isRunning) {
      return {
        strokeDashoffset: theta.value * perimeter,
      };
    } else {
      return {
        strokeDashoffset: 0,
      };
    }
  });

  return (
    <View style={{ width: size, height: size, opacity: opacity }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <AnimatedRect
          stroke={color}
          fill="none"
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={sideLength}
          height={sideLength}
          strokeDasharray={perimeter}
          strokeLinecap="square"
          {...{ strokeWidth }}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default SquareProgress;
