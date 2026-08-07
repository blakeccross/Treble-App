import { blue } from "@/theme/colors";
import { useAppTheme } from "@/theme/ThemeContext";
import type { ThemeTokens } from "@/theme/themes";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  resolveColor,
  resolveFontSize,
  resolveRadius,
  resolveSize,
  type TokenValue,
} from "./resolveToken";
import { Text } from "./Text";
import { useResolvedViewStyle, type StyledViewProps } from "./styledProps";
import { XStack } from "./Stack";

type NeumoPalette = {
  surface: string;
  surfacePressed: string;
  shadowDark: string;
  shadowLight: string;
  darkOpacity: number;
  lightOpacity: number;
  rimLight: string;
  rimDark: string;
};

function getNeumoPalette(
  tokens: ThemeTokens,
  themeName: "light" | "dark",
  opts: { white: boolean; outlined: boolean; accent: boolean },
): NeumoPalette {
  const isDark = themeName === "dark";

  if (opts.outlined) {
    const surface = tokens.background ?? (isDark ? "#121212" : "#ffffff");
    return {
      surface,
      surfacePressed: tokens.backgroundPress ?? (isDark ? "#1e1e1e" : "#ececed"),
      shadowDark: isDark ? "rgba(0,0,0,0.85)" : "rgba(163,177,198,0.55)",
      shadowLight: isDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.95)",
      darkOpacity: isDark ? 0.55 : 0.45,
      lightOpacity: isDark ? 0.35 : 0.9,
      rimLight: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.85)",
      rimDark: isDark ? "rgba(0,0,0,0.5)" : "rgba(174,188,208,0.45)",
    };
  }

  if (opts.white) {
    return {
      surface: "#ecf0f3",
      surfacePressed: "#e2e6eb",
      shadowDark: "rgba(163,177,198,0.55)",
      shadowLight: "rgba(255,255,255,0.95)",
      darkOpacity: 0.45,
      lightOpacity: 0.9,
      rimLight: "rgba(255,255,255,0.9)",
      rimDark: "rgba(174,188,208,0.4)",
    };
  }

  if (isDark) {
    const surface = opts.accent
      ? (tokens.blue4 ?? "#152a44")
      : (tokens.backgroundStrong ?? "#1c1c1e");
    return {
      surface,
      surfacePressed: opts.accent
        ? (tokens.blue5 ?? "#004074")
        : (tokens.backgroundPress ?? "#2c2c2e"),
      shadowDark: "rgba(0,0,0,0.75)",
      shadowLight: "rgba(255,255,255,0.12)",
      darkOpacity: 0.65,
      lightOpacity: 0.4,
      rimLight: "rgba(255,255,255,0.1)",
      rimDark: "rgba(0,0,0,0.55)",
    };
  }

  if (opts.accent) {
    return {
      surface: tokens.blue3 ?? blue.blue3,
      surfacePressed: tokens.blue4 ?? blue.blue4,
      shadowDark: "rgba(0,80,180,0.35)",
      shadowLight: "rgba(255,255,255,0.9)",
      darkOpacity: 0.4,
      lightOpacity: 0.85,
      rimLight: "rgba(255,255,255,0.75)",
      rimDark: "rgba(0,102,214,0.28)",
    };
  }

  return {
    surface: tokens.blue2 ?? blue.blue2,
    surfacePressed: tokens.blue3 ?? blue.blue3,
    shadowDark: "rgba(0,102,214,0.32)",
    shadowLight: "rgba(255,255,255,0.92)",
    darkOpacity: 0.38,
    lightOpacity: 0.88,
    rimLight: "rgba(255,255,255,0.8)",
    rimDark: "rgba(0,102,214,0.22)",
  };
}

export type ButtonProps = StyledViewProps &
  Omit<PressableProps, "style" | "children"> & {
    children?: React.ReactNode;
    disabled?: boolean;
    theme?: string;
    white?: boolean;
    variant?: "outlined";
    circular?: boolean;
    textAlign?: TextStyle["textAlign"];
    icon?: React.ReactNode | React.ComponentType<Record<string, unknown>>;
    iconAfter?: React.ReactNode | React.ComponentType<Record<string, unknown>>;
    unstyled?: boolean;
    pressStyle?: { backgroundColor?: string; scale?: number };
    transition?: string;
    elevate?: boolean;
    size?: string;
    color?: string;
    fontSize?: TokenValue;
    fontWeight?: TextStyle["fontWeight"] | string | number;
  };

export function Button({
  children,
  disabled,
  theme: themeName,
  white,
  variant,
  circular,
  pressStyle,
  onPress,
  style,
  textAlign,
  icon,
  iconAfter,
  unstyled,
  elevate,
  size: sizeProp,
  color: colorProp,
  fontSize: fontSizeProp,
  fontWeight: fontWeightProp,
  ...layoutProps
}: ButtonProps) {
  const { tokens, name } = useAppTheme();
  const [pressed, setPressed] = useState(false);

  const isOutlined =
    variant === "outlined" ||
    themeName === "alt1" ||
    themeName === "alt1_Button";
  const isAccent = themeName === "accent";

  const hasCustomBackground = layoutProps.backgroundColor != null;
  const useNeumo = !unstyled && !hasCustomBackground;
  const neumo = useNeumo
    ? getNeumoPalette(tokens, name, {
        white: !!white,
        outlined: isOutlined,
        accent: isAccent,
      })
    : null;

  const bgDefault = unstyled
    ? "transparent"
    : useNeumo
      ? neumo!.surface
      : white
        ? "rgba(255,255,255,0.92)"
        : isOutlined
          ? "transparent"
          : themeName === "accent"
            ? (tokens.blue10 ?? blue.blue10)
            : (tokens.blue10 ?? blue.blue10);

  const pressedBg =
    pressStyle?.backgroundColor ??
    (useNeumo
      ? neumo!.surfacePressed
      : isOutlined
        ? tokens.backgroundPress
        : (tokens.blue11 ?? blue.blue11));

  const resolvedBackground =
    resolveColor(layoutProps.backgroundColor, tokens, name) ??
    layoutProps.backgroundColor;

  const bg =
    pressed && !disabled
      ? unstyled
        ? (resolveColor(
            pressStyle?.backgroundColor ?? layoutProps.backgroundColor,
            tokens,
            name,
          ) ??
          pressStyle?.backgroundColor ??
          resolvedBackground ??
          bgDefault)
        : (resolveColor(pressedBg, tokens, name) ?? pressedBg)
      : (resolvedBackground ?? bgDefault);

  const height = unstyled
    ? undefined
    : (resolveSize(sizeProp ?? layoutProps.height ?? "$5", tokens, name) ?? 52);
  const width = circular ? height : layoutProps.width;
  const borderRadiusVal = circular
    ? 9999
    : unstyled
      ? resolveRadius(layoutProps.borderRadius, tokens, name)
      : resolveRadius(layoutProps.borderRadius ?? "$6", tokens, name) ?? 20;

  const neumoPressed = pressed && !disabled;
  const shadowDistance = elevate ? 8 : 6;

  const scale =
    pressed && !disabled && pressStyle?.scale != null
      ? pressStyle.scale
      : pressed && !disabled && !unstyled
        ? 0.99
        : 1;

  const resolved = useResolvedViewStyle({
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "$2",
    borderRadius: circular ? 9999 : unstyled ? undefined : "$6",
    height,
    width,
    paddingHorizontal: unstyled ? 0 : circular ? 0 : "$5",
    paddingVertical: unstyled ? 0 : undefined,
    borderWidth: unstyled ? layoutProps.borderWidth : useNeumo ? 0 : isOutlined ? 1 : layoutProps.borderWidth,
    borderColor: isOutlined && !useNeumo ? "$borderColor" : layoutProps.borderColor,
    ...layoutProps,
    backgroundColor: useNeumo ? "transparent" : bg,
    overflow: useNeumo ? "visible" : layoutProps.overflow,
    opacity: disabled ? 0.55 : layoutProps.opacity,
    elevation: unstyled || useNeumo ? 0 : elevate ? 3 : layoutProps.elevation,
    shadowColor: useNeumo ? undefined : !unstyled && !isOutlined && !circular ? "$shadowColor" : layoutProps.shadowColor,
    shadowOffset:
      useNeumo ? undefined : !unstyled && !isOutlined && !circular ? { width: 0, height: 6 } : layoutProps.shadowOffset,
    shadowOpacity:
      useNeumo ? undefined : !unstyled && !isOutlined && !circular ? 0.18 : layoutProps.shadowOpacity,
    shadowRadius: useNeumo ? undefined : !unstyled && !isOutlined && !circular ? 14 : layoutProps.shadowRadius,
  });

  const textColor = colorProp
    ? colorProp.startsWith("$")
      ? (resolveColor(colorProp, tokens, name) ?? colorProp)
      : colorProp
    : unstyled
      ? (resolveColor("$color", tokens, name) ?? "#111")
      : white
        ? "#111"
        : useNeumo && isOutlined
          ? (resolveColor("$color", tokens, name) ?? "#111")
          : "#fff";
  const fontSizeVal = resolveFontSize(fontSizeProp ?? "$7", tokens, name);

  const iconSize = fontSizeVal ?? resolveFontSize("$7", tokens, name) ?? 20;

  const renderIcon = (iconProp: ButtonProps["icon"]) =>
    iconProp && typeof iconProp === "function"
      ? React.createElement(
          iconProp as React.ComponentType<Record<string, unknown>>,
          { color: textColor, size: iconSize },
        )
      : iconProp;

  const IconEl = renderIcon(icon);
  const IconAfterEl = renderIcon(iconAfter);

  const content =
    typeof children === "string" ? (
      <Text
        color={textColor}
        fontWeight={fontWeightProp ?? "normal"}
        fontSize={fontSizeVal}
        textAlign={textAlign ?? "center"}
        fontFamily="InterBold"
        letterSpacing={0.2}
      >
        {children}
      </Text>
    ) : (
      children
    );

  const faceSurface: string =
    neumoPressed && neumo
      ? neumo.surfacePressed
      : neumo?.surface ?? (typeof bg === "string" ? bg : String(bg));

  const neumoLayers =
    useNeumo && neumo && borderRadiusVal != null ? (
      <>
        {!neumoPressed && (
          <>
            <View
              pointerEvents="none"
              style={[
                styles.neumoShadow,
                {
                  borderRadius: borderRadiusVal,
                  backgroundColor: neumo.surface,
                  shadowColor: neumo.shadowDark,
                  shadowOffset: { width: shadowDistance, height: shadowDistance },
                  shadowOpacity: neumo.darkOpacity,
                  shadowRadius: shadowDistance,
                },
              ]}
            />
            <View
              pointerEvents="none"
              style={[
                styles.neumoShadow,
                {
                  borderRadius: borderRadiusVal,
                  backgroundColor: neumo.surface,
                  shadowColor: neumo.shadowLight,
                  shadowOffset: { width: -shadowDistance, height: -shadowDistance },
                  shadowOpacity: neumo.lightOpacity,
                  shadowRadius: shadowDistance,
                },
              ]}
            />
          </>
        )}
        <View
          pointerEvents="none"
          style={[
            styles.neumoFace,
            {
              borderRadius: borderRadiusVal,
              backgroundColor: faceSurface,
              borderTopColor: neumoPressed ? neumo.rimDark : neumo.rimLight,
              borderLeftColor: neumoPressed ? neumo.rimDark : neumo.rimLight,
              borderBottomColor: neumoPressed ? neumo.rimLight : neumo.rimDark,
              borderRightColor: neumoPressed ? neumo.rimLight : neumo.rimDark,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
            },
          ]}
        />
      </>
    ) : null;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[{ transform: [{ scale }] }, resolved as ViewStyle, style]}
    >
      {neumoLayers}
      {IconEl && !children && !IconAfterEl ? (
        IconEl
      ) : (
        <XStack alignItems="center" gap="$2">
          {IconEl}
          {content}
          {IconAfterEl}
        </XStack>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  neumoShadow: {
    ...StyleSheet.absoluteFill,
  },
  neumoFace: {
    ...StyleSheet.absoluteFill,
  },
});

export type ButtonPropsType = ButtonProps;
