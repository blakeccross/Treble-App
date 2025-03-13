import React, { useEffect, useState } from "react";
import { Button, Card, H2, H3, H4, H5, Paragraph, Separator, View, YStack } from "tamagui";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";
import moment from "moment";
import { useUser } from "../../../context/user-context";
import { Heart, HeartCrack, LockOpen } from "@tamagui/lucide-icons";
import Animated, { Easing, FadeIn, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
        backgroundColor: "#00000030",
      }}
    >
      <Pressable onPress={() => router.dismiss()} style={StyleSheet.absoluteFill} />

      <Animated.View
        style={{ width: "100%" }}
        entering={SlideInDown.duration(500).easing(Easing.ease)}
        exiting={SlideOutDown.duration(500).easing(Easing.ease)}
      >
        <Card flex={0} width={"100%"} elevation={10} borderRadius={"$10"} padding={"$6"}>
          <YStack gap="$4">
            <View alignItems="center">
              {lives !== undefined && lives <= 0 ? <HeartCrack color={"$red10"} size={"$10"} /> : <Heart color={"$red10"} size={"$10"} />}
              <H2>{lives !== undefined && lives <= 0 ? "You are out of lives!" : "You have " + lives + " hearts"}</H2>
              {livesRefreshTime ? (
                <>
                  <Paragraph>Hearts will not reset until</Paragraph>
                  {countdown ? <H2>{countdown}</H2> : <H2>-</H2>}
                </>
              ) : (
                <Paragraph>Subscribe to unlock unlimited hearts</Paragraph>
              )}
            </View>
            <Button onPress={() => router.push("/paywall")}>
              <LockOpen />
              Unlock unlimited hearts
            </Button>
          </YStack>
        </Card>
      </Animated.View>
      <SafeAreaView edges={["bottom"]} />
    </Animated.View>
  );
}
