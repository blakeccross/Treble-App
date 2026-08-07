import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ChevronLeft, Paragraph, XStack } from "@/ui";

const useNativeGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

const BTN_SIZE = 44;

type GlassBackButtonProps = {
  onPress: () => void;
  label?: string;
  /** Light glyphs for use over photography */
  onMedia?: boolean;
  /** Icon-only control (e.g. collapsed header slot) */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function GlassBackButton({
  onPress,
  label = "",
  onMedia = true,
  compact = false,
  style,
}: GlassBackButtonProps) {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";
  const reveal = useSharedValue(compact ? 0 : 0);

  useEffect(() => {
    if (compact) return;
    reveal.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [compact, reveal]);

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateX: interpolate(reveal.value, [0, 1], [-8, 0]) }],
    marginLeft: interpolate(reveal.value, [0, 1], [0, 8]),
  }));

  const textColor = onMedia ? "#FFFFFF" : isDark ? "#F5F5F7" : "#111111";
  const border = onMedia
    ? "rgba(255, 255, 255, 0.22)"
    : isDark
      ? "rgba(255, 255, 255, 0.14)"
      : "rgba(60, 60, 67, 0.10)";

  const circleStyle = [
    styles.circle,
    { borderRadius: BTN_SIZE / 2, borderColor: border },
    style,
  ];

  const icon = <ChevronLeft size="$2" color={textColor} strokeWidth={2.5} />;

  const glass = useNativeGlass ? (
    <GlassView
      isInteractive
      glassEffectStyle="clear"
      colorScheme={onMedia ? "dark" : "auto"}
      style={circleStyle}
    >
      {icon}
    </GlassView>
  ) : (
    <BlurView
      intensity={onMedia ? 40 : isDark ? 48 : 72}
      tint={onMedia ? "dark" : isDark ? "dark" : "light"}
      style={circleStyle}
    >
      {icon}
    </BlurView>
  );

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <XStack alignItems="center">
        {glass}
        {!compact && label ? (
          <Animated.View style={labelAnimStyle}>
            <Paragraph
              fontSize="$4"
              fontFamily="InterBold"
              color={textColor}
              numberOfLines={1}
            >
              {label}
            </Paragraph>
          </Animated.View>
        ) : null}
      </XStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
