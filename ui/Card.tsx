import React, { createContext, useContext, useState } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import { useResolvedViewStyle, type StyledViewProps } from "./styledProps";
import type { TokenValue } from "./resolveToken";
import { View, type ViewProps } from "./View";

const CardSizeContext = createContext<TokenValue>("$true");

type CardProps = StyledViewProps &
  Omit<React.ComponentProps<typeof Pressable>, "style" | "children"> & {
    bordered?: boolean;
    elevate?: boolean;
    disabled?: boolean;
    /** Size token for header padding / radius (Tamagui default: $true) */
    size?: TokenValue;
    pressStyle?: { scale?: number; backgroundColor?: string };
    transition?: string;
  };

function CardRoot({
  children,
  onPress,
  pressStyle,
  style,
  bordered,
  elevate,
  disabled,
  size = "$true",
  borderColor,
  borderWidth,
  ...props
}: CardProps) {
  const [pressed, setPressed] = useState(false);
  const scale = pressed && pressStyle?.scale != null ? pressStyle.scale : 1;

  const resolved = useResolvedViewStyle({
    overflow: "hidden",
    position: "relative",
    backgroundColor: "$backgroundStrong",
    borderRadius: "$6",
    elevate,
    ...(bordered
      ? {
          borderWidth: borderWidth ?? StyleSheet.hairlineWidth * 2,
          borderColor: borderColor ?? "$borderColor",
        }
      : {
          ...(borderWidth !== undefined ? { borderWidth } : {}),
          ...(borderColor !== undefined ? { borderColor } : {}),
        }),
    opacity: disabled ? 0.5 : props.opacity,
    ...props,
  });

  return (
    <CardSizeContext.Provider value={size}>
      {onPress || pressStyle ? (
        <Pressable
          disabled={disabled}
          onPress={disabled ? undefined : onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={[{ transform: [{ scale }] }, resolved, style as ViewStyle]}
        >
          {children}
        </Pressable>
      ) : (
        <View style={[resolved, style]}>{children}</View>
      )}
    </CardSizeContext.Provider>
  );
}

function CardHeader({
  size: sizeProp,
  padding,
  ...props
}: ViewProps & { size?: TokenValue }) {
  const cardSize = useContext(CardSizeContext);
  const size = sizeProp ?? cardSize;
  return <View zIndex={1} padding={padding ?? size} {...props} />;
}

function CardFooter(props: ViewProps) {
  return (
    <View
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      zIndex={2}
      {...props}
    />
  );
}

function CardBackground(props: ViewProps) {
  return (
    <View
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={0}
      padding={0}
      {...props}
    />
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Footer: CardFooter,
  Background: CardBackground,
});
