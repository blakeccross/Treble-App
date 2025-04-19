import React, { useEffect } from "react";
import { QuizContext } from "../../context/quiz-context";
import { ChevronLeft, Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import { router, usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Button, H3, H5, Paragraph, Progress, View, XStack, YStack } from "tamagui";
import BottomSheet from "../BottomSheet";
import { useUser } from "../../context/user-context";
import Animated, { FadeIn, SlideOutUp } from "react-native-reanimated";

export default function SignUpProgressHeader() {
  const { currentUser } = useUser();
  const currentRoute = usePathname();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    switch (currentRoute) {
      case "/":
        setProgress(25);
        break;
      case "/email":
        setProgress(40);
        break;
      case "/password":
        setProgress(60);
        break;
      case "/instrument":
        setProgress(80);
        break;
    }
  }, [currentRoute]);

  return (
    <Animated.View entering={FadeIn} exiting={SlideOutUp}>
      <YStack backgroundColor={"$blue10"}>
        {/* <SafeAreaView /> */}
        <XStack position="relative" justifyContent="space-between" alignItems="center" padding="$4">
          <View width={"$3"} height={"$3"} themeInverse alignItems="center" justifyContent="center" onPress={() => router.back()}>
            <ChevronLeft size={"$2"} color={"white"} />
          </View>
          <Paragraph fontSize={"$6"} color={"white"} fontWeight={800}>
            Sign Up
          </Paragraph>
          <View width={"$3"} height={"$3"}></View>
        </XStack>
      </YStack>
      {/* <YStack gap="$2" padding="$3">
        <XStack alignItems="center" justifyContent="space-between" gap="$2">
          <Progress value={progress} flex={1} backgroundColor={"$gray1"}>
            <Progress.Indicator
              // animation="bouncy"
              backgroundColor={"$blue10"}
            />
          </Progress>
        </XStack>
      </YStack> */}
    </Animated.View>
  );
}
