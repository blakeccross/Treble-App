import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3, Progress, Spinner, YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  const { currentQuestionIndex, questions, section } = useContext(QuizContext);

  function handle() {
    // router.dismiss();
    router.navigate({
      pathname: "/module-overview/[id]",
      params: { id: section.id },
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <H1>Hooray!!! You're done!</H1>
        <Button onPress={handle} fontWeight={600} width={"100%"}>
          Continue
        </Button>
      </YStack>
    </View>
  );
}
