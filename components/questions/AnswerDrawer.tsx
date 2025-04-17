import { QuizContext, useQuiz } from "../../context/quiz-context";
import * as Haptics from "expo-haptics";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H3, Paragraph, ScrollView, Sheet, View, YStack } from "tamagui";
import BottomSheet from "../BottomSheet";
import { useUser } from "../../context/user-context";
import { usePlaySFX } from "@/hooks/usePlaySFX";

const correctSFX = require("@/assets/audio/correct_sfx.mp3");

export default function AnswerDrawer({
  validateAnswer,
  explanation,
  enabled,
}: {
  validateAnswer?: () => boolean;
  explanation?: string;
  enabled: boolean;
}) {
  const { currentUser } = useUser();
  const { nextQuestion, lives, setLives, correctAnswers, incorrectAnswers } = useQuiz();
  const [open, setOpen] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const { playSFX } = usePlaySFX();

  useEffect(() => {
    if (answerIsCorrect !== undefined) {
      startAnimation();
    }
  }, [answerIsCorrect]);

  const startAnimation = () => {
    setOpen(true);
  };

  function handleValidateAnswer() {
    if (validateAnswer) {
      const validateFunction = validateAnswer();
      setAnswerIsCorrect(validateFunction);
      if (validateFunction === true) {
        correctAnswers.current = correctAnswers.current + 1;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        playSFX(correctSFX);
      } else {
        incorrectAnswers.current = incorrectAnswers.current + 1;
      }
      if (validateFunction === false && lives !== undefined && !currentUser?.is_subscribed) {
        setLives(lives - 1);
      }
    }
  }

  function handleContinue() {
    setOpen(false);
    nextQuestion();
  }

  return (
    <>
      <Sheet snapPointsMode="fit" dismissOnOverlayPress={false} zIndex={100_000} animation="quick" open={open} onOpenChange={setOpen}>
        <Sheet.Overlay animation="lazy" backgroundColor="$shadow6" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Sheet.Frame borderTopLeftRadius={"$10"} borderTopRightRadius={"$10"} padding="$4" backgroundColor={answerIsCorrect ? "$green7" : "$red9"}>
          <View gap={"$4"} flex={1} justifyContent="space-between">
            <YStack flex={1}>
              <H3 fontWeight={600} textAlign="center" color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                {answerIsCorrect ? "Correct!" : "Incorrect"}
              </H3>

              <Paragraph fontSize={"$6"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                {explanation}
              </Paragraph>
            </YStack>
            <View width={"100%"}>
              <Button
                onPress={handleContinue}
                textAlign="center"
                backgroundColor={answerIsCorrect ? "$green12Light" : "$red12Light"}
                pressStyle={{ backgroundColor: answerIsCorrect ? "$green10Light" : "$red11Light" }}
                fontWeight={600}
                fontSize={"$7"}
                height={"$5"}
              >
                Continue
              </Button>
            </View>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </Sheet.Frame>
      </Sheet>
      {/* </BottomSheet> */}

      <View>
        <View
          style={{
            width: "100%",
            bottom: 0,
          }}
          padding="$4"
        >
          {validateAnswer && answerIsCorrect === undefined ? (
            <Button
              onPress={handleValidateAnswer}
              width={"100%"}
              fontWeight={600}
              disabled={!enabled}
              animation="quick"
              opacity={enabled ? 1 : 0.7}
              fontSize={"$7"}
              height={"$5"}
            >
              Check
            </Button>
          ) : (
            <Button onPress={nextQuestion} width={"100%"} fontWeight={600} fontSize={"$7"} height={"$5"}>
              Continue
            </Button>
          )}
        </View>
      </View>
      <SafeAreaView edges={["bottom"]} />
    </>
  );
}
