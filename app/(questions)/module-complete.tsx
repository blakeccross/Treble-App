import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3, Progress, Spinner, YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  const { currentModule } = useContext(QuizContext);

  function handle() {
    // router.dismissAll();
    router.navigate({
      pathname: "/module-overview/[id]",
      params: { id: currentModule.id },
    });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <H1>Wow you finished an entire module!</H1>
        <Button onPress={handle}>Continue</Button>
      </YStack>
    </SafeAreaView>
  );
}
