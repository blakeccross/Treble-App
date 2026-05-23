import { blue } from "@/theme/colors";
import { useAppTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
  Pressable,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  resolveColor,
  resolveFontSize,
  resolveSize,
  type TokenValue,
} from "./resolveToken";
import { Text } from "./Text";
import { useResolvedViewStyle, type StyledViewProps } from "./styledProps";
import { XStack } from "./Stack";

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

  const bgDefault = unstyled
    ? "transparent"
    : white
      ? "rgba(255,255,255,0.92)"
      : isOutlined
        ? "transparent"
        : themeName === "accent"
          ? (tokens.blue10 ?? blue.blue10)
          : (tokens.blue10 ?? blue.blue10);

  const pressedBg =
    pressStyle?.backgroundColor ??
    (isOutlined ? tokens.backgroundPress : (tokens.blue11 ?? blue.blue11));

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
  const scale =
    pressed && !disabled && pressStyle?.scale != null
      ? pressStyle.scale
      : pressed && !disabled && !unstyled
        ? 0.98
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
    borderWidth: unstyled
      ? layoutProps.borderWidth
      : isOutlined
        ? 1
        : layoutProps.borderWidth,
    borderColor: isOutlined ? "$borderColor" : layoutProps.borderColor,
    ...layoutProps,
    backgroundColor: bg,
    opacity: disabled ? 0.55 : layoutProps.opacity,
    elevation: unstyled ? undefined : elevate ? 3 : layoutProps.elevation,
    shadowColor:
      !unstyled && !isOutlined && !circular
        ? "$shadowColor"
        : layoutProps.shadowColor,
    shadowOffset: !unstyled && !isOutlined && !circular ? { width: 0, height: 6 } : layoutProps.shadowOffset,
    shadowOpacity:
      !unstyled && !isOutlined && !circular ? 0.18 : layoutProps.shadowOpacity,
    shadowRadius: !unstyled && !isOutlined && !circular ? 14 : layoutProps.shadowRadius,
  });

  const textColor = colorProp
    ? colorProp.startsWith("$")
      ? (resolveColor(colorProp, tokens, name) ?? colorProp)
      : colorProp
    : unstyled
      ? (resolveColor("$color", tokens, name) ?? "#111")
      : white
        ? "#111"
        : isOutlined
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

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[{ transform: [{ scale }] }, resolved as ViewStyle, style]}
    >
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

export type ButtonPropsType = ButtonProps;
