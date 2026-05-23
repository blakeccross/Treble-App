import React from "react";
import { View, type ViewProps } from "./View";
import type { TokenValue } from "./resolveToken";

export function Square({ size, ...props }: ViewProps & { size?: TokenValue | number }) {
  return <View width={size} height={size} {...props} />;
}
