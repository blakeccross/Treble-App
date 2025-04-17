import { QuizContext } from "@/context/quiz-context";
import { Check } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { Button, H1, Paragraph, Separator, Theme, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { currentModule, correctAnswers, incorrectAnswers } = useContext(QuizContext);
  const { numOfCorrectAnswers, moduleComplete } = useLocalSearchParams();

  function handle() {
    router.navigate({
      pathname: "/module-overview/[id]",
      params: { id: currentModule.id },
    });
  }

  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <XStack gap="$2">
          <Paragraph color={"$background"}>Completed</Paragraph>
          <Check color={"$background"} size={"$1"} />
        </XStack>
        <H1
          key={0}
          color={"$background"}
          fontWeight={800}
          enterStyle={{
            scale: 3,
            y: -10,
            opacity: 0,
          }}
          opacity={1}
          scale={1}
          y={0}
          // animation="lazy"
        >
          Nice work!
        </H1>
      </YStack>
      <YStack padding="$4" gap="$5">
        <Theme name="dark">
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <View>
              <Paragraph fontSize={"$5"}>Stats</Paragraph>
              <BlurView intensity={100} style={{ borderRadius: 20, overflow: "hidden", padding: 10, gap: 10 }}>
                <XStack justifyContent="space-between">
                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    Correct
                  </Paragraph>
                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    {correctAnswers.current}
                  </Paragraph>
                </XStack>
                <Separator themeInverse opacity={0.5} />
                <XStack justifyContent="space-between">
                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    Incorrect
                  </Paragraph>

                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    {incorrectAnswers.current}
                  </Paragraph>
                </XStack>
              </BlurView>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <View>
              <Paragraph fontSize={"$5"}>Rewards</Paragraph>
              <BlurView intensity={100} style={{ borderRadius: 20, overflow: "hidden", padding: 10, gap: 10 }}>
                {moduleComplete === "true" && (
                  <>
                    <XStack justifyContent="space-between">
                      <Paragraph fontSize={"$6"} fontWeight={800}>
                        Completed an entire module Bonus
                      </Paragraph>
                      <Paragraph fontSize={"$6"} fontWeight={800}>
                        10 XP
                      </Paragraph>
                    </XStack>
                    <Separator themeInverse opacity={0.5} />
                  </>
                )}
                <XStack justifyContent="space-between">
                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    Earned XP
                  </Paragraph>
                  <Paragraph fontSize={"$6"} fontWeight={800}>
                    {numOfCorrectAnswers}
                  </Paragraph>
                </XStack>
              </BlurView>
            </View>
          </Animated.View>
        </Theme>

        <View>
          <Button
            onPress={handle}
            fontWeight={600}
            fontSize={"$7"}
            height={"$5"}
            width={"100%"}
            backgroundColor={"$gray1"}
            pressStyle={{ backgroundColor: "$gray2" }}
            color={"$gray12"}
          >
            Continue
          </Button>
        </View>
      </YStack>

      <SafeAreaView />
    </LinearGradient>
  );
}
