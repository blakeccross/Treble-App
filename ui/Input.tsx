import React from "react";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";
import { resolveColor, resolveFontSize, resolveRadius, resolveSize, resolveSpace } from "./resolveToken";
import type { TokenValue } from "./resolveToken";

export type InputProps = Omit<TextInputProps, "style"> & {
  size?: TokenValue;
  backgroundColor?: TokenValue;
  borderColor?: TokenValue;
  color?: TokenValue;
  borderRadius?: TokenValue;
  paddingHorizontal?: TokenValue;
  height?: TokenValue;
};

export function Input({
  size = "$6",
  backgroundColor = "$gray2",
  borderColor = "$borderColor",
  color = "$color",
  borderRadius = "$5",
  paddingHorizontal = "$4",
  height,
  ...props
}: InputProps) {
  const { tokens, name } = useAppTheme();
  const h = resolveSize(height ?? size, tokens, name) ?? 52;

  return (
    <TextInput
      placeholderTextColor={resolveColor("$placeholderColor", tokens, name)}
      style={{
        height: h,
        fontSize: resolveFontSize(size, tokens, name) ?? 18,
        backgroundColor: resolveColor(backgroundColor, tokens, name),
        borderColor: resolveColor(borderColor, tokens, name),
        color: resolveColor(color, tokens, name),
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderRadius: resolveRadius(borderRadius, tokens, name) ?? 18,
        paddingHorizontal: resolveSpace(paddingHorizontal, tokens, name) ?? 16,
        fontFamily: "Inter",
        fontWeight: "400",
      }}
      {...props}
    />
  );
}
