import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3, Paragraph, Progress, Spinner, YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  const { currentQuestionIndex, questions, section } = useContext(QuizContext);

  function handle() {
    router.navigate({
      pathname: "/(tabs)/(home)/module-overview/[id]",
      params: { id: section.id },
    });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <H1>You've run out of lives</H1>
        <Paragraph>Try studying a bit more and try again later.</Paragraph>
        <Button onPress={handle}>Continue</Button>
      </YStack>
    </SafeAreaView>
  );
}
