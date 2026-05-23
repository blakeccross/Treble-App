import { useAppTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import { Pressable, View as RNView, type ViewProps as RNViewProps, type ViewStyle } from "react-native";
import { IconStyleProvider } from "./IconStyleContext";
import { resolveColor } from "./resolveToken";
import { splitStyledViewProps, useResolvedViewStyle, type StyledViewProps } from "./styledProps";

export type ViewProps = StyledViewProps & Omit<RNViewProps, keyof StyledViewProps | "style">;

export function View({ style, children, onPress, pressStyle, color, ...props }: ViewProps) {
  const { tokens, name } = useAppTheme();
  const { layout, rest } = splitStyledViewProps(props);
  const [pressed, setPressed] = useState(false);
  const resolved = useResolvedViewStyle(layout);
  const cascadedColor = color ? resolveColor(color, tokens, name) : undefined;

  const scale = pressed && pressStyle?.scale != null ? pressStyle.scale : 1;
  const pressedBg =
    pressed && pressStyle?.backgroundColor ? resolveColor(pressStyle.backgroundColor, tokens, name) : undefined;

  const combinedStyle: ViewStyle[] = [
    resolved,
    pressedBg ? { backgroundColor: pressedBg } : undefined,
    style,
  ].filter(Boolean) as ViewStyle[];

  const isPressable = onPress != null || pressStyle != null;

  const inner = isPressable ? (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[{ transform: [{ scale }] }, ...combinedStyle]}
      {...rest}
    >
      {children}
    </Pressable>
  ) : (
    <RNView style={combinedStyle} {...rest}>
      {children}
    </RNView>
  );

  return <IconStyleProvider color={cascadedColor}>{inner}</IconStyleProvider>;
}
