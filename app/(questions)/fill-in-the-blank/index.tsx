import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, Animated } from "react-native";

import WordList from "./components/word-list";
import Word from "./components/word";
import { Button, H1, H2, H3, Paragraph, XStack, YStack } from "tamagui";
import AnswerDrawer from "@/components/AnswerDrawer";

const data = {
  question: "Place the notes in the correct order",
  explanation: "The notes go up alphabetically but stop at G",
  options: [
    { id: 1, word: "C" },
    { id: 2, word: "D" },
    { id: 3, word: "E" },
    { id: 4, word: "F" },
    { id: 5, word: "G" },
    { id: 6, word: "A" },
    { id: 7, word: "B" },
    { id: 8, word: "CDFF" },
    { id: 9, word: "DEAGSGS" },
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

const Duolingo = () => {
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const wordListRef = useRef<any>();

  function handleCheckAnswer(answerIsCorrect: boolean) {
    setAnswerIsCorrect(answerIsCorrect);
    return answerIsCorrect;
  }

  function validateAnswer() {
    return answerIsCorrect || false;
  }

  return (
    <>
      <SafeAreaView style={{ flex: 0 }} />
      <View style={styles.container}>
        <YStack padding="$4" gap="$4" flex={1}>
          <H2 marginBottom="$8">{data.question}</H2>
          <WordList validateAnswer={handleCheckAnswer} ref={wordListRef}>
            {data.options.map((word) => (
              <Word key={word.id} {...word} />
            ))}
          </WordList>
        </YStack>
        <AnswerDrawer validateAnswer={validateAnswer} explanation={data.explanation} enabled />
      </View>
    </>
  );
};

export default Duolingo;
