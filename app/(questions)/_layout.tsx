import { Stack, Tabs, usePathname } from "expo-router";
import React from "react";
import ProgressHeader from "@/components/progress-header";
import QuizProvider from "@/context/quiz-context";

export default function TabLayout() {
  const currentRoute = usePathname();

  return (
    <>
      <QuizProvider>
        {currentRoute !== "/loading" && currentRoute !== "/quiz-complete" ? <ProgressHeader /> : <></>}
        <Stack>
          <Stack.Screen name="loading" options={{ headerShown: false, presentation: "fullScreenModal" }} />
          <Stack.Screen name="quiz-complete" options={{ headerShown: false, presentation: "fullScreenModal" }} />
          <Stack.Screen name="module-complete" options={{ headerShown: false, presentation: "fullScreenModal" }} />
          <Stack.Screen name="reading" options={{ headerShown: false }} getId={({ params }) => String(Date.now())} />
          <Stack.Screen name="identify-the-chord-sheet" options={{ headerShown: false }} getId={({ params }) => String(Date.now())} />
          <Stack.Screen name="fill-in-the-blank" options={{ headerShown: false }} getId={({ params }) => String(Date.now())} />
        </Stack>
      </QuizProvider>
    </>
  );
}
