import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshCw, Share, Trophy, X } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H2, H3, Theme, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useMMKVNumber } from "react-native-mmkv";

export default function Index() {
  const router = useRouter();
  const { score, gameName } = useLocalSearchParams();
  const [highScore, setHighScore] = useMMKVNumber(String(gameName));

  useEffect(() => {
    if (!highScore || +score > highScore) {
      setHighScore(+score);
    }
  }, []);

  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack paddingHorizontal="$4">
          <Pressable onPress={() => router.navigate("/ear-training")}>
            <X size="$3" color={"white"} />
          </Pressable>
        </XStack>
        <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
          <YStack flex={1} gap="$6">
            <YStack alignItems="center" justifyContent="center" flex={1}>
              <H1 fontSize={"$15"} fontWeight={600} themeInverse lineHeight={"$15"}>
                {score}
              </H1>
              <H3 themeInverse>Score</H3>
            </YStack>
            <YStack alignItems="center" justifyContent="center" marginBottom="$10">
              <H1 fontWeight={600} themeInverse>
                {highScore}
              </H1>
              <H3 themeInverse>Best Score</H3>
            </YStack>
          </YStack>
          <YStack gap="$4" width={"100%"}>
            <XStack gap="$4">
              <Button fontWeight={600} size={"$6"} flex={1} themeInverse elevate icon={<Share />}>
                Share
              </Button>
              <Button fontWeight={600} size={"$6"} flex={1} themeInverse elevate icon={<Trophy />}>
                Leaderboard
              </Button>
            </XStack>
            <Theme name={"alt1_Button"}>
              <Link asChild href={"/pitch-perfect"}>
                <Button fontWeight={600} size={"$6"} width={"100%"} elevate icon={<RefreshCw />}>
                  Play Again
                </Button>
              </Link>
            </Theme>
          </YStack>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
