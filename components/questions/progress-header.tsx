import React from "react";
import { QuizContext } from "../../context/quiz-context";
import { Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import { usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StatusBar } from "react-native";
import { Button, H3, H5, Paragraph, Progress, View, XStack, YStack } from "tamagui";
import BottomSheet from "../BottomSheet";
import { useUser } from "../../context/user-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressHeader() {
  const route = useRouter();
  const { currentUser } = useUser();
  const { currentQuestionIndex, questions, section, currentModule, lives } = useContext(QuizContext);
  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);
  let quizPercentage = Math.round((currentQuestionIndex / (questions?.length || 0)) * 100);

  return (
    <>
      <View>
        <SafeAreaView edges={["top"]} />
        <StatusBar translucent={true} backgroundColor={"transparent"} />
        <YStack gap="$2" padding="$3">
          <XStack alignItems="center" justifyContent="space-between">
            <Pressable onPress={() => setOpen(true)}>
              <X size="$3" />
            </Pressable>
            <H5 fontWeight={600}>{section.title}</H5>

            <XStack gap="$1" width={"$3"}>
              {currentRoute !== "/reading" && !currentUser?.is_subscribed && (
                <>
                  <Heart size="$2" color={"$red10"} fill={red.red10} />
                  <Paragraph fontWeight={600}>{lives}</Paragraph>
                </>
              )}
            </XStack>
          </XStack>
          <XStack>
            <Progress value={quizPercentage} flex={1} backgroundColor={"$gray1"}>
              {quizPercentage > 0 && <Progress.Indicator animation="quick" backgroundColor={"$blue10"} />}
            </Progress>
          </XStack>
        </YStack>
      </View>

      <BottomSheet isOpen={open} setIsOpen={setOpen} height={250} backgroundColor={"$blue10"}>
        <YStack flex={1} marginTop="$2" alignItems="center" gap="$2">
          <H3 fontWeight={600} color={"$background"}>
            Are you sure you want to exit?
          </H3>
          <Paragraph fontWeight={600} color={"$background"}>
            All of your progress will be lost.
          </Paragraph>
        </YStack>
        <Button
          onPress={() => route.dismissTo({ pathname: "/module-overview/[id]", params: { id: currentModule.id } })}
          fontWeight={600}
          theme={"alt1"}
          // marginBottom="$4"
          fontSize={"$7"}
          height={"$5"}
        >
          Exit
        </Button>
      </BottomSheet>
    </>
  );
}
