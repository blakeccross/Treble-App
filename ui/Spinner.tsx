import { useAppTheme } from "@/theme/ThemeContext";
import React from "react";
import { ActivityIndicator } from "react-native";
import { resolveColor, type TokenValue } from "./resolveToken";

export function Spinner({ color = "$color", size = "small" }: { color?: TokenValue; size?: "small" | "large" }) {
  const { tokens, name } = useAppTheme();
  return <ActivityIndicator color={resolveColor(color, tokens, name)} size={size} />;
}
