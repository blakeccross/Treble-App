import { useAppTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import { LayoutChangeEvent, View as RNView } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { resolveColor, resolveSize, type TokenValue } from "./resolveToken";
import { View } from "./View";

export type SliderProps = {
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  width?: TokenValue | "100%";
  onSlideEnd?: (event: unknown, value: number) => void;
  onValueChange?: (value: number[]) => void;
  children?: React.ReactNode;
};

function SliderRoot({
  defaultValue = [50],
  min = 0,
  max = 100,
  step = 1,
  width = "100%",
  onSlideEnd,
  onValueChange,
  children,
}: SliderProps) {
  const { tokens, name } = useAppTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const value = useSharedValue(defaultValue[0] ?? 50);
  const trackBg = resolveColor("$gray5", tokens, name) ?? "#e0e0e0";
  const activeBg = resolveColor("$blue10", tokens, name) ?? "#0588f0";
  const thumbSize = resolveSize("$2", tokens, name) ?? 28;

  const updateValue = (x: number) => {
    const pct = Math.max(0, Math.min(1, x / trackWidth));
    let next = min + pct * (max - min);
    if (step > 0) next = Math.round(next / step) * step;
    value.value = next;
    onValueChange?.([next]);
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      runOnJS(updateValue)(e.x);
    })
    .onEnd(() => {
      if (onSlideEnd) runOnJS(onSlideEnd)(null, value.value);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth ? `${((value.value - min) / (max - min)) * 100}%` : "0%",
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trackWidth ? ((value.value - min) / (max - min)) * trackWidth - thumbSize / 2 : 0 }],
  }));

  const childArray = React.Children.toArray(children);
  const hasCustomTrack = childArray.some(
    (c) => React.isValidElement(c) && (c.type === SliderTrack || c.type === SliderThumb)
  );

  if (hasCustomTrack) {
    return <View width={width}>{children}</View>;
  }

  return (
    <View
      width={width}
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
      height={thumbSize}
      justifyContent="center"
    >
      <RNView style={{ height: 6, borderRadius: 3, backgroundColor: trackBg, overflow: "hidden" }}>
        <Animated.View style={[{ height: 6, backgroundColor: activeBg }, fillStyle]} />
      </RNView>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              position: "absolute",
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: activeBg,
              top: (thumbSize - 6) / -2 + 3,
            },
            thumbStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
}

function SliderTrack({ children, backgroundColor }: { children?: React.ReactNode; backgroundColor?: TokenValue }) {
  const { tokens, name } = useAppTheme();
  const bg = resolveColor(backgroundColor ?? "$gray5", tokens, name);
  return (
    <View height={6} borderRadius={3} backgroundColor={bg} width="100%" overflow="hidden">
      {children}
    </View>
  );
}

function SliderTrackActive({ backgroundColor }: { backgroundColor?: TokenValue }) {
  return <View height={6} backgroundColor={backgroundColor} width="50%" />;
}

function SliderThumb({ size = "$2", circular }: { size?: TokenValue; index?: number; circular?: boolean }) {
  const { tokens, name } = useAppTheme();
  const s = resolveSize(size, tokens, name) ?? 28;
  return (
    <View
      width={s}
      height={s}
      borderRadius={circular ? s / 2 : 4}
      backgroundColor="$background"
      borderWidth={2}
      borderColor="$blue10"
    />
  );
}

export const Slider = Object.assign(SliderRoot, {
  Track: SliderTrack,
  TrackActive: SliderTrackActive,
  Thumb: SliderThumb,
});
