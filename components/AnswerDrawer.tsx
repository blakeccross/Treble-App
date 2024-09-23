import { QuizContext } from "@/context/quiz-context";
import { Link, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { RefAttributes, useContext, useEffect, useRef, useState } from "react";
import { View, Animated, SafeAreaView } from "react-native";
import { Button, H1, H2, H3, Paragraph, Sheet, XStack, YStack } from "tamagui";
import { AVPlaybackSource, Audio } from "expo-av";
import * as Haptics from "expo-haptics";

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
  const router = useRouter();
  const { currentQuestionIndex, nextQuestion, lives, setLives } = useContext(QuizContext);
  const [open, setOpen] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    if (answerIsCorrect !== undefined) {
      startAnimation();
    }
  }, [answerIsCorrect]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function playSFX(sfx: AVPlaybackSource, interrupt?: boolean) {
    const { sound } = await Audio.Sound.createAsync(sfx);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    if (interrupt) {
      setSound(sound);
    }

    await sound.playAsync();
  }

  const startAnimation = () => {
    setOpen(true);
  };

  function handleValidateAnswer() {
    if (validateAnswer) {
      const validateFunction = validateAnswer();
      setAnswerIsCorrect(validateFunction);
      if (validateFunction === false) setLives(lives - 1);
      else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        playSFX(correctSFX);
      }
    }
  }

  function handleContinue() {
    setOpen(false);
    nextQuestion();
  }

  return (
    <>
      {/* <SafeAreaView style={{ height: 120 }} /> */}
      <SafeAreaView />
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[30, 50]}
        position={0}
        zIndex={100_000}
        animation="quick"
        dismissOnOverlayPress={false}
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5" backgroundColor={answerIsCorrect ? "$green7" : "$red9"}>
          <H3 fontWeight={600} color={answerIsCorrect ? "$green7Dark" : "$red5Dark"}>
            {answerIsCorrect ? "Correct!" : "Incorrect"}
          </H3>
          <Paragraph color={answerIsCorrect ? "$green7Dark" : "$red5Dark"}>{explanation}</Paragraph>
          <Button
            onPress={handleContinue}
            width={"100%"}
            backgroundColor={answerIsCorrect ? "$green7Dark" : "$red5Dark"}
            fontWeight={600}
            fontSize={"$7"}
            height={"$5"}
          >
            Continue
          </Button>
        </Sheet.Frame>
      </Sheet>
      <View style={{ height: 120 }}>
        <View
          style={{
            position: "absolute",
            padding: 25, // Adjust padding as needed
            justifyContent: "flex-end",
            //alignItems: "flex-start",
            // flex: 1,
            marginBottom: 30,
            width: "100%",
            bottom: 0,
          }}
        >
          {validateAnswer && answerIsCorrect === undefined ? (
            <Button onPress={handleValidateAnswer} width={"100%"} fontWeight={600} disabled={!enabled} fontSize={"$7"} height={"$5"}>
              Check
            </Button>
          ) : (
            <Button onPress={nextQuestion} width={"100%"} fontWeight={600} fontSize={"$7"} height={"$5"}>
              Continue
            </Button>
          )}
        </View>
      </View>
    </>
  );
}
