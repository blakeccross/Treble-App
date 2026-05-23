import React from "react";
import { View, type ViewProps } from "./View";

export function XStack(props: ViewProps) {
  return <View flexDirection="row" {...props} />;
}

export function YStack(props: ViewProps) {
  return <View flexDirection="column" {...props} />;
}
