import { usePlaySFX } from "@/hooks/usePlaySFX";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H3, Paragraph, Sheet, View, XStack, YStack } from "tamagui";
import { useQuiz } from "../../context/quiz-context";
import { useUser } from "../../context/user-context";
import { CircleCheck, CircleX } from "@tamagui/lucide-icons";
import { greenDark, redDark } from "@tamagui/themes";

const correctSFX = require("@/assets/audio/correct_sfx.mp3");

export default function AnswerDrawer({
  validateAnswer,
  explanation,
  enabled,
  selectedAnswers,
}: {
  validateAnswer?: () => boolean;
  explanation?: string;
  enabled: boolean;
  selectedAnswers?: number | number[];
}) {
  const { currentUser } = useUser();
  const { nextQuestion, lives, setLives, correctAnswers, incorrectAnswers, questions, currentQuestionIndex } = useQuiz();
  const [open, setOpen] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [correctAnswer, setCorrectAnswer] = useState<{ id: number; option_text: string }[]>([]);
  const { playSFX } = usePlaySFX();

  const question = useRef(questions && questions[currentQuestionIndex]);

  function validate() {
    const correctAnswers = question.current?.question_options.filter(
      (item: { id: number; option_text: string }) => item && item.id && question.current?.answer_id?.includes(item.id)
    );
    if (correctAnswers) setCorrectAnswer(correctAnswers);
  }

  useEffect(() => {
    if (answerIsCorrect !== undefined) {
      startAnimation();
      validate();
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
        <Sheet.Overlay animation="lazy" backgroundColor="$shadowColor" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Sheet.Frame borderTopLeftRadius={"$10"} borderTopRightRadius={"$10"} padding="$4" backgroundColor={answerIsCorrect ? "$green7" : "$red8"}>
          <View gap={"$4"} flex={1} justifyContent="space-between">
            <YStack flex={1} gap={"$4"}>
              <XStack alignItems="center" gap={"$2"}>
                {answerIsCorrect ? (
                  <CircleCheck color={"$green5Dark"} fill={greenDark.green10} />
                ) : (
                  <CircleX color={"$red5Dark"} fill={redDark.red10} />
                )}
                <H3 fontWeight={600} textAlign="left" color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                  {answerIsCorrect ? "Correct!" : "Incorrect"}
                </H3>
              </XStack>
              {answerIsCorrect ? (
                <Paragraph fontSize={"$6"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                  {explanation}
                </Paragraph>
              ) : (
                <>
                  <Paragraph fontSize={"$5"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                    Your Answer:{" "}
                    {selectedAnswers !== undefined
                      ? question.current?.question_options
                          .filter((item: { id: number; option_text: string }) => {
                            if (Array.isArray(selectedAnswers)) {
                              return item && item.id && selectedAnswers.includes(item.id);
                            } else {
                              return item && item.id && item.id === selectedAnswers;
                            }
                          })
                          .map((answer: { id: number; option_text: string }) => answer.option_text)
                          .join(", ")
                      : "No answer selected"}
                  </Paragraph>
                  <Paragraph fontWeight={"bold"} fontSize={"$6"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                    Correct Answer:
                  </Paragraph>
                  <Paragraph letterSpacing={0.3} fontSize={"$6"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                    {correctAnswer.map((answer) => answer.option_text).join(", ")}
                  </Paragraph>

                  <Paragraph letterSpacing={0.3} fontSize={"$6"} color={answerIsCorrect ? "$green12" : "$red5Dark"}>
                    {explanation}
                  </Paragraph>
                </>
              )}
              <View width={"100%"}>
                <Button
                  onPress={handleContinue}
                  textAlign="center"
                  backgroundColor={answerIsCorrect ? "$green12Light" : "$red12Light"}
                  borderWidth={0}
                  pressStyle={{ backgroundColor: answerIsCorrect ? "$green10Light" : "$red11Light" }}
                  fontWeight={600}
                  fontSize={"$7"}
                  height={"$5"}
                >
                  Continue
                </Button>
              </View>
            </YStack>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </Sheet.Frame>
      </Sheet>

      <View
        style={{
          width: "100%",
          marginBottom: 25,
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
    </>
  );
}
