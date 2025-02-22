import React from "react";
import { View } from "react-native";
import Animated, { SharedValue, useAnimatedProps, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  size,
  strokeWidth,
  time,
  color,
  opacity,
  theta,
  isRunning,
  setIsRunning,
}: //   startAnimation,
{
  size: number;
  strokeWidth: number;
  time: number;
  color: string;
  opacity: number;
  theta: SharedValue<number>;
  isRunning: boolean;
  setIsRunning: any;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    theta.value = withTiming(0, {
      duration: time * 1000,
    });
    if (isRunning) {
      return {
        strokeDashoffset: theta.value * radius,
      };
    } else {
      return {
        strokeDashoffset: 2 * Math.PI * radius,
      };
    }
  });

  return (
    <View style={{ width: size, height: size, opacity: opacity }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* <Circle stroke="#e6e6e6" fill="none" cx={size / 2} cy={size / 2} r={radius} {...{ strokeWidth }} /> */}
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeLinecap="butt"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          {...{ strokeWidth }}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;
