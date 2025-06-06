import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="pitch-perfect" options={{ headerShown: false }} dangerouslySingular />
      <Stack.Screen name="nashville-round-up" options={{ headerShown: false }} dangerouslySingular />
      <Stack.Screen name="name-that-chord" options={{ headerShown: false }} dangerouslySingular />
      <Stack.Screen name="interval-training" options={{ headerShown: false }} dangerouslySingular />
      <Stack.Screen name="sheet-music-test" options={{ headerShown: false }} dangerouslySingular />
      <Stack.Screen name="game-over" options={{ headerShown: false, animation: "slide_from_bottom" }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false, presentation: "fullScreenModal" }} />
    </Stack>
  );
}
