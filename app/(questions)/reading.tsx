import { QuizContext } from "@/context/quiz-context";
import React, { useContext } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import AnswerDrawer from "@/components/AnswerDrawer";

export default function Index() {
  const { currentQuestionIndex, questions, nextQuestion } = useContext(QuizContext);
  const question = questions[currentQuestionIndex];

  return (
    <>
      <SafeAreaView />
      <ScrollView style={{ padding: 20 }}>
        {/* <H1>BONJOUR Hi</H1> */}
        <Markdown mergeStyle>{question?.reading_text.replace(/(\r\n|\r|\n)/g, "\n")}</Markdown>
        {/* <Button onPress={nextQuestion}>Continue</Button> */}
      </ScrollView>
      <AnswerDrawer enabled />
    </>
  );
}
