import React from "react";
import { View, type ViewProps } from "./View";

export function Circle({ size = "$4", ...props }: ViewProps & { size?: ViewProps["width"] }) {
  const s = size;
  return <View width={s} height={s} borderRadius={9999} alignItems="center" justifyContent="center" {...props} />;
}
