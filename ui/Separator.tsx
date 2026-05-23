import React from "react";
import { View, type ViewProps } from "./View";

export function Separator(props: ViewProps) {
  return <View height={1} backgroundColor="$borderColor" width="100%" {...props} />;
}
