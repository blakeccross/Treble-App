import { AuthFlowHeader } from "@/components/auth/AuthFlowHeader";
import React from "react";
import { View, YStack } from "@/ui";
import Login from "./logIn";

export default function Auth() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <AuthFlowHeader title="Log in" />
      <View flex={1} paddingHorizontal="$5" paddingTop="$5">
        <Login />
      </View>
    </YStack>
  );
}
