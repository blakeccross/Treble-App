import React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";
import { resolveColor, resolveFontSize, resolveRadius, resolveSize, resolveSpace, type TokenValue } from "./resolveToken";

export type TextAreaProps = Omit<TextInputProps, "style"> & {
  minHeight?: TokenValue;
  backgroundColor?: TokenValue;
  borderColor?: TokenValue;
  color?: TokenValue;
  borderRadius?: TokenValue;
  padding?: TokenValue;
};

export function TextArea({
  minHeight = "$10",
  backgroundColor = "$background",
  borderColor = "$borderColor",
  color = "$color",
  borderRadius = "$4",
  padding = "$3",
  ...props
}: TextAreaProps) {
  const { tokens, name } = useAppTheme();

  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={resolveColor("$placeholderColor", tokens, name)}
      style={{
        minHeight: resolveSize(minHeight, tokens, name) ?? 104,
        backgroundColor: resolveColor(backgroundColor, tokens, name),
        borderColor: resolveColor(borderColor, tokens, name),
        color: resolveColor(color, tokens, name),
        borderWidth: 1,
        borderRadius: resolveRadius(borderRadius, tokens, name) ?? 9,
        padding: resolveSpace(padding, tokens, name) ?? 12,
        fontFamily: "Karmina",
        fontSize: 16,
      }}
      {...props}
    />
  );
}
