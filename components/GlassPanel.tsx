import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  type GlassStyle,
} from "expo-glass-effect";
import React from "react";
import {
  Platform,
  StyleSheet,
  useColorScheme,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const useNativeGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

type GlassPanelProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glassEffectStyle?: GlassStyle;
  borderRadius?: number;
};

export function GlassPanel({
  children,
  style,
  glassEffectStyle = "regular",
  borderRadius = 20,
}: GlassPanelProps) {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";
  const border = isDark
    ? "rgba(255, 255, 255, 0.14)"
    : "rgba(60, 60, 67, 0.10)";
  const panelStyle = [styles.panel, { borderRadius, borderColor: border }, style];

  if (useNativeGlass) {
    return (
      <GlassView glassEffectStyle={glassEffectStyle} style={panelStyle}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={isDark ? 48 : 72}
      tint={isDark ? "dark" : "light"}
      style={panelStyle}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
