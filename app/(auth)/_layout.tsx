import { Stack, Tabs, usePathname } from "expo-router";
import React from "react";

export default function TabLayout() {
  const currentRoute = usePathname();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="welcome" options={{ headerShown: false }} /> */}
      <Stack.Screen name="auth" options={{ headerShown: false, animation: "slide_from_bottom" }} />
      <Stack.Screen name="(sign-up)" options={{ headerShown: false, animation: "slide_from_bottom" }} />
    </Stack>
  );
}
