import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshCw, Share, Trophy, X } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H2, H3, Theme, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useMMKVNumber } from "react-native-mmkv";
import { supabase } from "@/utils/supabase";
import { UserContext } from "@/context/user-context";

export default function Index() {
  const router = useRouter();
  const { score, gameName } = useLocalSearchParams();
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [highScore, setHighScore] = useMMKVNumber(String(gameName));

  useEffect(() => {
    if (!highScore || +score > highScore) {
      setHighScore(+score);
      updateLeaderboard();
    }
  }, []);

  async function updateLeaderboard() {
    if (currentUser) {
      const { data, error } = await supabase
        .from("leaderboard")
        .upsert({ ...{ [gameName as string]: Number(score) }, profile: currentUser?.id })
        .select();

      if (data) {
        console.log("UPDATED HIGH SCORE", data);
      }
      if (error) {
        console.error(error);
      }
    }
  }

  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack>
          <Pressable
            onPress={() => {
              router.push("/ear-training");
              router.dismissAll();
            }}
          >
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
              <Button fontWeight={600} size={"$6"} themeInverse elevate icon={<Share />}></Button>
              <Link asChild href={{ pathname: "/(ear-training)/leaderboard", params: { gameName: gameName } }}>
                <Button fontWeight={600} size={"$6"} themeInverse flex={1} elevate icon={<Trophy />}>
                  Leaderboard
                </Button>
              </Link>
            </XStack>
            <Theme name={"alt1_Button" as any}>
              <Button onPress={() => router.back()} fontWeight={600} size={"$6"} width={"100%"} elevate icon={<RefreshCw />}>
                Play Again
              </Button>
            </Theme>
          </YStack>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
