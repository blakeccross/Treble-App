import React from "react";
import { View } from "./View";

export function Form({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit?: () => void;
}) {
  return <View>{children}</View>;
}
