import React, { useContext, useEffect } from "react";
import { Pressable, Share as RNShare, StatusBar } from "react-native";
import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import { RefreshCw, Share, Trophy, X } from "@tamagui/lucide-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useMMKVNumber } from "react-native-mmkv";
import { Button, H1, H3, Theme, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const Games: Record<string, { name: string; shareImage: string }> = {
  pitch_perfect: {
    name: "Pitch Perfect",
    shareImage: require("@/assets/images/pitch-perfect.jpg"),
  },
  nashville_round_up: {
    name: "Nashville Round Up",
    shareImage: require("@/assets/images/nashville-round-up-poster.jpg"),
  },
};

export default function Index() {
  const router = useRouter();
  const { score, gameName } = useLocalSearchParams();
  const { currentUser } = useContext(UserContext);
  const [highScore, setHighScore] = useMMKVNumber(String(gameName));

  useEffect(() => {
    if (!highScore || +score > highScore) {
      setHighScore(+score);
      if (currentUser?.id) {
        updateLeaderboard();
      }
    }
  }, []);

  async function updateLeaderboard() {
    if (currentUser) {
      const { data, error } = await supabase
        .from("leaderboard")
        .upsert({ ...{ [gameName as string]: Number(score) }, profile: currentUser?.id })
        .select();

      if (data) {
        // console.log("UPDATED HIGH SCORE", data);
      }
      if (error) {
        console.error(error);
      }
    }
  }

  async function shareScore() {
    try {
      await RNShare.share({
        message: `I just scored ${score} in ${Games[gameName as keyof typeof Games].name} on Treble! Can you beat my score?`,
        title: `Treble - ${Games[gameName as keyof typeof Games].name}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <StatusBar translucent={true} backgroundColor={"transparent"} />
      <SafeAreaView style={{ flex: 1 }}>
        <XStack>
          <Pressable
            onPress={() => {
              router.dismissTo("/ear-training");
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
              {/* <Button fontWeight={600} size={"$6"} themeInverse elevate icon={<Share />} onPress={shareScore}></Button> */}
              <Button
                onPress={() => router.push({ pathname: "/(ear-training)/leaderboard", params: { gameName } })}
                fontWeight={600}
                size={"$6"}
                variant="outlined"
                // themeInverse
                flex={1}
                elevate
                icon={<Trophy />}
              >
                Leaderboard
              </Button>
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
