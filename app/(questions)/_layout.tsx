import { Stack, usePathname } from "expo-router";
import React from "react";
import ProgressHeader from "@/components/questions/progress-header";
import QuizProvider from "@/context/quiz-context";

export default function TabLayout() {
  const currentRoute = usePathname();

  return (
    <>
      <QuizProvider>
        {currentRoute !== "/loading" &&
        currentRoute !== "/out-of-lives" &&
        currentRoute !== "/quiz-complete" &&
        currentRoute !== "module-complete" &&
        !currentRoute.includes("module-overview") ? (
          <ProgressHeader />
        ) : (
          <></>
        )}
        <></>
        <Stack screenOptions={{ gestureEnabled: false }}>
          <Stack.Screen name="reading" options={{ headerShown: false }} dangerouslySingular />
          <Stack.Screen name="identify-the-chord-sheet" options={{ headerShown: false }} dangerouslySingular />
          <Stack.Screen name="fill-in-the-blank/index" options={{ headerShown: false }} dangerouslySingular />
          <Stack.Screen name="multiple-choice" options={{ headerShown: false }} dangerouslySingular />
          <Stack.Screen name="quiz-complete" options={{ headerShown: false, animation: "slide_from_bottom" }} />
          <Stack.Screen name="module-complete" options={{ headerShown: false, presentation: "fullScreenModal" }} />
          <Stack.Screen name="out-of-lives" options={{ headerShown: false, presentation: "modal" }} />
        </Stack>
      </QuizProvider>
    </>
  );
}
