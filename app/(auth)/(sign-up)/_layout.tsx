import { Stack, usePathname } from "expo-router";
import React from "react";
import SignUpProgressHeader from "../../../components/sign-up/SignUpProgressHeader";
import SignUpProvider from "../../../context/sign-up-context";
import { View } from "@/ui";

const ConditionalHeader = () => {
  const currentRoute = usePathname();
  const hidden =
    currentRoute?.endsWith("/paywall") ||
    currentRoute?.endsWith("/notifications") ||
    currentRoute?.includes("/paywall") ||
    currentRoute?.includes("/notifications");
  if (!hidden) {
    return <SignUpProgressHeader />;
  }
  return null;
};

export default function TabLayout() {
  return (
    <>
      <SignUpProvider>
        <ConditionalHeader />
        <View flex={1} backgroundColor="$background">
          <Stack screenOptions={{ gestureEnabled: false }}>
            <Stack.Screen name="name" options={{ headerShown: false }} />
            <Stack.Screen name="email" options={{ headerShown: false, animation: "simple_push" }} />
            <Stack.Screen name="password" options={{ headerShown: false, animation: "simple_push" }} />
            <Stack.Screen name="instrument" options={{ headerShown: false, animation: "simple_push" }} />
            <Stack.Screen name="notifications" options={{ headerShown: false, animation: "simple_push" }} />
            <Stack.Screen name="paywall" options={{ headerShown: false, animation: "slide_from_bottom" }} />
          </Stack>
        </View>
      </SignUpProvider>
    </>
  );
}
