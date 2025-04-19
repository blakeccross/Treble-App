import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="appearance" options={{ headerShown: false }} />
      <Stack.Screen name="audio" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ headerShown: false }} />
    </Stack>
  );
}
