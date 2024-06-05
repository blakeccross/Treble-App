import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3, Progress, Spinner, YStack } from "tamagui";

export default function Index() {
  const router = useRouter();
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }
  useEffect(() => {
    // API CALL WILL GO HERE
    async function wait() {
      await timeout(10);
      router.dismiss();
      router.navigate("/(questions)/reading");
    }
    wait();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "blue" }}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <Progress value={20}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
      </YStack>
    </SafeAreaView>
  );
}
