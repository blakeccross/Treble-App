import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H2, H3, Progress, Spinner, YStack } from "tamagui";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "blue" }}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <H2 fontWeight={600}>Game Over</H2>
        <Link asChild href={"/(ear-training)/pitch-perfect"}>
          <Button>Try Again?</Button>
        </Link>
      </YStack>
    </SafeAreaView>
  );
}
