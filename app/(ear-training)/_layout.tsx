import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="pitch-perfect" options={{ headerShown: false }} />
      <Stack.Screen name="game-over/[id]" options={{ headerShown: false, presentation: "fullScreenModal" }} />
    </Stack>
  );
}
