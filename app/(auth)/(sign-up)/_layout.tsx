import { Stack, usePathname } from "expo-router";
import React from "react";
import SignUpProgressHeader from "../../../components/sign-up/SignUpProgressHeader";
import SignUpProvider from "../../../context/sign-up-context";

const ConditionalHeader = () => {
  const currentRoute = usePathname();
  if (!["/paywall", "/notifications"].includes(currentRoute)) {
    return <SignUpProgressHeader />;
  }
  return <></>;
};

export default function TabLayout() {
  return (
    <>
      <SignUpProvider>
        <ConditionalHeader />
        <Stack screenOptions={{ gestureEnabled: false }}>
          <Stack.Screen name="name" options={{ headerShown: false }} />
          <Stack.Screen name="email" options={{ headerShown: false, animation: "simple_push" }} />
          <Stack.Screen name="password" options={{ headerShown: false, animation: "simple_push" }} />
          <Stack.Screen name="instrument" options={{ headerShown: false, animation: "simple_push" }} />
          <Stack.Screen name="notifications" options={{ headerShown: false, animation: "simple_push" }} />
          <Stack.Screen name="paywall" options={{ headerShown: false, animation: "slide_from_bottom" }} />
        </Stack>
      </SignUpProvider>
    </>
  );
}
