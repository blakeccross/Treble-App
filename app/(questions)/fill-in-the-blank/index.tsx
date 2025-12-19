import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native";

import AnswerDrawer from "@/components/questions/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";
import { SectionItem } from "@/types";
import { Paragraph, View, YStack } from "tamagui";
import Word from "./components/word";
import WordList from "./components/word-list";

const testData = {
  answer_explanation: null,
  answer_id: null,
  created_at: "2025-01-12T01:23:10.932408+00:00",
  id: 1189,
  image: null,
  local_image_uri: "",
  question: "Arrange these notes in order from shortest duration to longest duration.",
  question_options: [
    { id: 1, option_text: "Sixteenth" },
    { id: 2, option_text: "Eighth" },
    { id: 3, option_text: "Quarter" },
    { id: 4, option_text: "Half" },
    { id: 5, option_text: "Whole" },
    { id: 6, option_text: "Breve" },
  ],
  reading_text: "NULL",
  section: 47,
  sheet_music: null,
  type: "fill-in-the-blank",
};

const Duolingo = () => {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const wordListRef = useRef<any>(null);
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
      <View flex={1}>
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
