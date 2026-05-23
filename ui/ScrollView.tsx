import React from "react";
import { ScrollView as RNScrollView, type ScrollViewProps as RNScrollViewProps } from "react-native";
import { splitStyledViewProps, useResolvedViewStyle, type StyledViewProps } from "./styledProps";

export type ScrollViewProps = StyledViewProps & Omit<RNScrollViewProps, keyof StyledViewProps | "style">;

export function ScrollView({ style, children, contentContainerStyle, ...props }: ScrollViewProps) {
  const { layout, rest } = splitStyledViewProps(props);
  const resolved = useResolvedViewStyle(layout);
  return (
    <RNScrollView style={[resolved, style]} contentContainerStyle={contentContainerStyle} {...rest}>
      {children}
    </RNScrollView>
  );
}
