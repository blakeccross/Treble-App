import React from "react";
import { YStack } from "./Stack";
import type { ViewProps } from "./View";

export function CardHeader(props: ViewProps) {
  return <YStack gap="$2" {...props} />;
}
