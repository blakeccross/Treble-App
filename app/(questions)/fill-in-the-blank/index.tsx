import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, Animated } from "react-native";

import WordList from "./components/word-list";
import Word from "./components/word";
import { Button, H1, H2, H3, Paragraph, View, XStack, YStack } from "tamagui";
import AnswerDrawer from "@/components/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";
import { SectionItem } from "@/types";

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
    // backgroundColor: "white",
  },
});

const Duolingo = () => {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const wordListRef = useRef<any>();
  const question = useRef<SectionItem>(questions && questions[currentQuestionIndex]);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  useEffect(() => {
    if (question.current?.question_options) {
      setShuffledOptions(shuffleArray([...question.current.question_options]));
    }
  }, [question.current?.question_options]);

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function validateAnswer() {
    if (wordListRef.current) {
      return wordListRef.current.validate();
    } else {
      return false;
    }
  }

  return (
    <>
      <SafeAreaView style={{ flex: 0 }} />
      <View style={styles.container}>
        <YStack padding="$4" gap="$4" flex={1}>
          <Paragraph marginBottom="$2" fontSize={"$7"}>
            {question.current?.question}
          </Paragraph>
          {shuffledOptions.length > 0 && (
            <WordList ref={wordListRef}>
              {shuffledOptions.map((word: { id: number; option_text: string }) => (
                <Word key={word?.id} id={word?.id} option_text={word?.option_text} />
              ))}
            </WordList>
          )}
        </YStack>
        <AnswerDrawer validateAnswer={validateAnswer} explanation={question.current?.answer_explanation || ""} enabled />
      </View>
    </>
  );
};

export default Duolingo;
