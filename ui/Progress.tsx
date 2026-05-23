import { useAppTheme } from "@/theme/ThemeContext";
import React, { isValidElement } from "react";
import { View as RNView } from "react-native";
import { resolveColor, resolveRadius, resolveSize, type TokenValue } from "./resolveToken";
import { View } from "./View";

export type ProgressProps = {
  value?: number;
  max?: number;
  backgroundColor?: TokenValue;
  color?: TokenValue;
  height?: TokenValue;
  borderRadius?: TokenValue;
  children?: React.ReactNode;
  flex?: number;
};

export type ProgressIndicatorProps = {
  backgroundColor?: TokenValue;
  color?: TokenValue;
  /** Tamagui compat — ignored */
  transition?: string;
};

function ProgressIndicator(_props: ProgressIndicatorProps) {
  return null;
}
ProgressIndicator.displayName = "ProgressIndicator";

function getIndicatorProps(children: React.ReactNode): ProgressIndicatorProps {
  let indicator: ProgressIndicatorProps = {};
  React.Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ProgressIndicator) {
      indicator = child.props as ProgressIndicatorProps;
    }
  });
  return indicator;
}

function ProgressRoot({
  value = 0,
  max = 100,
  backgroundColor = "$gray5",
  color = "$blue10",
  height = "$1",
  borderRadius = "$10",
  children,
  flex,
}: ProgressProps) {
  const { tokens, name } = useAppTheme();
  const indicator = getIndicatorProps(children);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = resolveSize(height, tokens, name) ?? 8;
  const br = resolveRadius(borderRadius, tokens, name) ?? 10;
  const bg = resolveColor(backgroundColor, tokens, name);
  const fill =
    resolveColor(indicator.backgroundColor ?? indicator.color ?? color, tokens, name) ??
    resolveColor(color, tokens, name);

  return (
    <View flex={flex} height={h} borderRadius={br} backgroundColor={bg} width="100%" overflow="hidden">
      <RNView style={{ width: `${pct}%`, height: h, backgroundColor: fill, borderRadius: br }} />
    </View>
  );
}

export const Progress = Object.assign(ProgressRoot, {
  Indicator: ProgressIndicator,
});
