import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { IconStyleProvider } from "./IconStyleContext";
import {
  splitStyledTextProps,
  useResolvedTextStyle,
  type StyledTextProps,
} from "./styledProps";

export type TextProps = StyledTextProps &
  Omit<RNTextProps, keyof StyledTextProps | "style">;

export const Text = React.forwardRef<RNText, TextProps>(function Text(
  { style, children, numberOfLines, color, ...props },
  ref,
) {
  const { styled, rest } = splitStyledTextProps({
    color,
    numberOfLines,
    ...props,
  });
  const resolved = useResolvedTextStyle(styled);
  const cascadedColor =
    typeof resolved.color === "string" ? resolved.color : undefined;

  return (
    <IconStyleProvider color={cascadedColor}>
      <RNText
        ref={ref}
        style={[resolved, style]}
        numberOfLines={numberOfLines}
        {...rest}
      >
        {children}
      </RNText>
    </IconStyleProvider>
  );
});

const heading =
  (fontSize: string, lineHeight: string, letterSpacing: number) =>
  function Heading(props: TextProps) {
    return (
      <Text
        fontFamily="InterBold"
        fontWeight="normal"
        fontSize={fontSize}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        {...props}
      />
    );
  };

/** Display / hero */
export const H1 = heading("$14", "$14", -1);
/** Large section */
export const H2 = heading("$11", "$11", -0.6);
/** Section title */
export const H3 = heading("$9", "$9", -0.45);
/** Card / list title */
export const H4 = heading("$7", "$7", -0.25);
/** Subheading */
export const H5 = heading("$6", "$6", -0.1);

type SizedTextProps = TextProps & { size?: TextProps["fontSize"] };

export function Paragraph({ size, fontSize, ...props }: SizedTextProps) {
  return (
    <Text
      fontSize={fontSize ?? size ?? "$5"}
      lineHeight="$5"
      fontFamily="Inter"
      fontWeight="normal"
      {...props}
    />
  );
}

export function SizableText({ size, fontSize, ...props }: SizedTextProps) {
  return (
    <Text
      fontSize={fontSize ?? size}
      fontFamily="Inter"
      fontWeight="normal"
      {...props}
    />
  );
}

export function Label(props: TextProps) {
  return (
    <Text
      fontSize="$2"
      fontWeight="500"
      fontFamily="Inter"
      letterSpacing={0.2}
      {...props}
    />
  );
}
