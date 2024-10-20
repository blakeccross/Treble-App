import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshCw, Share, Trophy, X } from "@tamagui/lucide-icons";
import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3, Paragraph, Progress, Spinner, Theme, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function Index() {
  const router = useRouter();
  const { currentQuestionIndex, questions, currentModule } = useContext(QuizContext);

  function handleExitSection() {
    router.navigate({
      pathname: "/(tabs)/(home)/module-overview/[id]",
      params: { id: currentModule.id },
    });
  }
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    //   <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
    //     <H1>You've run out of lives</H1>
    //     <Paragraph>Try studying a bit more and try again later.</Paragraph>
    //     <Button onPress={handle} wi>Continue</Button>
    //   </YStack>
    // </SafeAreaView>
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack paddingHorizontal="$4">
          <Pressable onPress={handleExitSection}>
            <X size="$3" color={"white"} />
          </Pressable>
        </XStack>
        <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
          <YStack flex={1} gap="$6">
            <YStack alignItems="center" justifyContent="center" flex={1}>
              <H1 textAlign="center" fontWeight={800} color={"white"}>
                You've run out of lives!
              </H1>
            </YStack>
            <YStack alignItems="center" justifyContent="center" marginBottom="$10">
              {/* <H1 fontWeight={600} themeInverse>
                {highScore}
              </H1> */}
              {/* <H3 themeInverse>Best Score</H3> */}
            </YStack>
          </YStack>
          <YStack gap="$4" width={"100%"}>
            <Theme name={"alt1_Button"}>
              {/* <Link asChild href={"/pitch-perfect"}> */}
              <Button fontWeight={600} size={"$6"} width={"100%"} elevate icon={<RefreshCw />} onPress={handleExitSection}>
                Play Again
              </Button>
              {/* </Link> */}
            </Theme>
          </YStack>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
