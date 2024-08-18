import { QuizContext } from "@/context/quiz-context";
import { Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import { Link, usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { Button, H3, H5, Paragraph, Progress, Sheet, XStack, YStack } from "tamagui";

export default function ProgressHeader() {
  const route = useRouter();
  const { currentQuestionIndex, questions, section, currentModule, lives } = useContext(QuizContext);
  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);
  let quizPercentage = (currentQuestionIndex / questions?.length) * 100;

  return (
    <>
      <SafeAreaView />
      <YStack gap="$2" padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => setOpen(true)}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>{section.title}</H5>

          <XStack gap="$1" width={"$3"}>
            {currentRoute !== "/reading" && (
              <>
                <Heart size="$2" color={"$red10"} fill={red.red10} />
                <Paragraph fontWeight={600}>{lives}</Paragraph>
              </>
            )}
          </XStack>
        </XStack>
        <XStack>
          <Progress value={quizPercentage} flex={1} backgroundColor={"$gray1"}>
            <Progress.Indicator animation="bouncy" backgroundColor={"$blue10"} />
          </Progress>
        </XStack>
      </YStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[400]}
        snapPointsMode={"constant"}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation={"quick"}
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" backgroundColor={"$blue10"}>
          <YStack flex={1} justifyContent="center" alignItems="center" space="$5">
            <H3 fontWeight={600} color={"$background"}>
              Are you sure you want to exit?
            </H3>
            <Paragraph fontWeight={600} color={"$background"}>
              All of your progress will be lost.
            </Paragraph>
          </YStack>
          <Button
            onPress={() => route.navigate(`/module-overview/${currentModule.id}`)}
            fontWeight={600}
            themeInverse
            marginBottom="$4"
            fontSize={"$7"}
            height={"$5"}
          >
            Exit
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
