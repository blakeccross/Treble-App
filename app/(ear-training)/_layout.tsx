import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="pitch-perfect" options={{ headerShown: false }} />
      <Stack.Screen name="name-that-chord" options={{ headerShown: false }} />
      <Stack.Screen name="interval-training" options={{ headerShown: false }} />
      <Stack.Screen name="game-over" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false, presentation: "fullScreenModal" }} />
    </Stack>
  );
}
