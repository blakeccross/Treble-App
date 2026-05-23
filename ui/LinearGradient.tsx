import { useAppTheme } from "@/theme/ThemeContext";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { resolveColor, type TokenValue } from "./resolveToken";
import { useResolvedViewStyle, type StyledViewProps } from "./styledProps";

type Point = [number, number];

export function LinearGradient({
  colors,
  start = [0, 0],
  end = [1, 1],
  style,
  children,
  ...layout
}: StyledViewProps & {
  colors: (TokenValue | string)[];
  start?: Point;
  end?: Point;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const { tokens, name } = useAppTheme();
  const resolved = useResolvedViewStyle(layout);
  const resolvedColors = colors.map((c) => resolveColor(c, tokens, name) ?? String(c)) as [string, string, ...string[]];

  return (
    <ExpoLinearGradient colors={resolvedColors} start={start} end={end} style={[resolved, style]}>
      {children}
    </ExpoLinearGradient>
  );
}
