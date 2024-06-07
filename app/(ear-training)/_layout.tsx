import { Stack, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="pitch-perfect" options={{ headerShown: false }} />
    </Stack>
  );
}
