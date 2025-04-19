import { Stack, Tabs, usePathname } from "expo-router";
import React from "react";

export default function TabLayout() {
  const currentRoute = usePathname();

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(sign-up)" options={{ headerShown: false }} />
    </Stack>
  );
}
