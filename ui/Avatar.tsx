import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, View as RNView, type ViewStyle } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";
import { resolveColor, resolveRadius, resolveSize, type TokenValue } from "./resolveToken";
import { View, type ViewProps } from "./View";

type AvatarProps = ViewProps & {
  circular?: boolean;
  size?: TokenValue;
  pressStyle?: { scale?: number };
  children?: React.ReactNode;
};

function AvatarRoot({ circular = true, size = "$6", pressStyle, children, style, ...props }: AvatarProps) {
  const { tokens, name } = useAppTheme();
  const [pressed, setPressed] = useState(false);
  const s = resolveSize(size, tokens, name) ?? 64;
  const scale = pressed && pressStyle?.scale != null ? pressStyle.scale : 1;
  const borderRadius = circular ? s / 2 : resolveRadius(props.borderRadius, tokens, name) ?? 8;

  const content = (
    <View
      width={s}
      height={s}
      borderRadius={borderRadius}
      overflow="hidden"
      backgroundColor={props.backgroundColor ?? "$gray4"}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {children}
    </View>
  );

  if (pressStyle) {
    return (
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[{ transform: [{ scale }] }, style as ViewStyle]}
      >
        {content}
      </Pressable>
    );
  }

  return <RNView style={style}>{content}</RNView>;
}

function AvatarImage({
  src,
  accessibilityLabel,
}: {
  src?: string | null;
  accessibilityLabel?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      source={{ uri: src }}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      onError={() => setFailed(true)}
    />
  );
}

function AvatarFallback({ children, ...props }: ViewProps & { children?: React.ReactNode }) {
  const { tokens, name } = useAppTheme();
  const bg = resolveColor(props.backgroundColor ?? "$gray4", tokens, name);

  return (
    <RNView
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {children}
    </RNView>
  );
}

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
