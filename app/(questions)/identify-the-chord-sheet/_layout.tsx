import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} getId={({ params }) => String(Date.now())} />
    </Stack>
  );
}
