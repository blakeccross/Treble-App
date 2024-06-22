import { QuizContext } from "@/context/quiz-context";
import { Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import { Link, usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { Button, H3, Paragraph, Progress, Sheet, XStack } from "tamagui";

export default function ProgressHeader() {
  const route = useRouter();
  const { currentQuestionIndex, questions, lives } = useContext(QuizContext);
  const [open, setOpen] = useState(false);
  let quizPercentage = (currentQuestionIndex / questions?.length) * 100;

  return (
    <>
      <SafeAreaView />
      <XStack padding="$3" gap="$4" alignItems="center">
        {/* <Link href="/(tabs)/home/module-overview/${id}" asChild> */}
        <Pressable onPress={() => setOpen(true)}>
          <X size="$3" />
        </Pressable>
        {/* </Link> */}
        <Progress value={quizPercentage} flex={1} backgroundColor={"$gray1"}>
          <Progress.Indicator animation="bouncy" backgroundColor={"$blue10"} />
        </Progress>
        <XStack gap="$1">
          <Heart size="$2" color={"$red10"} fill={red.red10} />
          <Paragraph fontWeight={600}>{lives}</Paragraph>
        </XStack>
      </XStack>

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
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5">
          <H3>Are you sure you want to exit?</H3>
          <Paragraph>All of your progress will be lost.</Paragraph>
          <Button onPress={() => route.navigate(`(tabs)/(home)/module-overview/123`)} fontWeight={600}>
            Continue
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
