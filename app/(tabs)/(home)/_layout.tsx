import { Stack, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="hearts" options={{ headerShown: false, presentation: "transparentModal", animation: "none" }} />
      <Stack.Screen name="module/[id]" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="module-overview/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
