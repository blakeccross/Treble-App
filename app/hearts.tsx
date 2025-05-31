import { Heart, HeartCrack, LockOpen } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, H2, H3, Paragraph, View, YStack } from "tamagui";
import { useUser } from "@/context/user-context";

export default function Hearts() {
  const { lives, livesRefreshTime } = useUser();
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (livesRefreshTime) {
      const interval = setInterval(() => {
        const now = moment();
        const refreshTime = moment(livesRefreshTime);
        const duration = moment.duration(refreshTime.diff(now));
        const formatted = `${duration.minutes()}m ${duration.seconds()}s`;
        setCountdown(formatted);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [livesRefreshTime]);

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "flex-end",
        alignItems: "center",
        // backgroundColor: "#00000030",
      }}
    >
      <Pressable onPress={() => router.dismiss()} style={StyleSheet.absoluteFill} />

      <View style={{ width: "100%" }}>
        <Card
          flex={0}
          width={"100%"}
          borderRadius={"$8"}
          padding={"$4"}
          elevation="$4"
          backgroundColor="$background"
          shadowColor={"#000000"}
          shadowOpacity={0.2}
          shadowRadius={30}
          shadowOffset={{ width: 0, height: 10 }}
        >
          <YStack gap="$4">
            <View alignItems="center">
              <View marginBottom={"$4"}>
                {lives !== undefined && lives <= 0 ? <HeartCrack color={"$red10"} size={"$10"} /> : <Heart color={"$red10"} size={"$10"} />}
              </View>
              <View marginBottom={"$4"} alignItems="center">
                <H3 fontWeight={800}>{lives !== undefined && lives <= 0 ? "You are out of lives!" : "You have " + lives + " hearts"}</H3>
                {livesRefreshTime ? (
                  <>
                    <Paragraph>Hearts will not reset until</Paragraph>
                    {countdown ? <H2>{countdown}</H2> : <H2>-</H2>}
                  </>
                ) : (
                  <Paragraph>Subscribe to unlock unlimited hearts</Paragraph>
                )}
              </View>
            </View>
            <Button
              icon={LockOpen}
              onPress={() => {
                router.navigate("/paywall");
              }}
              fontWeight={800}
              fontSize={"$6"}
              height={"$4"}
            >
              Unlock unlimited hearts
            </Button>
          </YStack>
        </Card>
      </View>
      <SafeAreaView edges={["bottom"]} />
    </Animated.View>
  );
}
