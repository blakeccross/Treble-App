import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshCw, Share, Trophy, X } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H2, H3, Paragraph, Progress, Spinner, Theme, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);
  const { id } = useLocalSearchParams();
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("pitch-perfect-score");
      if (value !== null) {
        if (Number(value) < Number(id)) {
          setHighScore(Number(id));
          storeData(String(id));
        } else {
          setHighScore(Number(value));
        }
      } else {
        // First time playing game
        storeData(String(id));
        setHighScore(Number(id));
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem("pitch-perfect-score", value);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    getData();
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
                {id}
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
