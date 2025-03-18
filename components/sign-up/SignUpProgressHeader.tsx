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
      <SafeAreaView />
      <YStack gap="$2" padding="$3">
        <XStack alignItems="center" justifyContent="space-between" gap="$2">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size="$3" />
          </Pressable>
          <Progress value={progress} flex={1} backgroundColor={"$gray1"}>
            <Progress.Indicator
              // animation="bouncy"
              backgroundColor={"$blue10"}
            />
          </Progress>
        </XStack>
      </YStack>
    </Animated.View>
  );
}
