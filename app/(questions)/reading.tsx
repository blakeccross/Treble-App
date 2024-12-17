import AnswerDrawer from "@/components/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";
import useMarkdown from "@/hooks/parseSymbolsFromText";
import React, { useContext, useRef } from "react";
import { SafeAreaView } from "react-native";
import { ScrollView, View } from "tamagui";

export default function Index() {
  const { currentQuestionIndex, questions, nextQuestion } = useContext(QuizContext);
  const questionTextRef = useRef(questions?.[currentQuestionIndex]?.reading_text || "");
  const markdownElement = useMarkdown((questions?.[currentQuestionIndex]?.reading_text || "")?.replace(/(\r\n|\r|\n)/g, "\n"));

  return (
    <>
      <SafeAreaView />
      <ScrollView backgroundColor={"$background"}>
        <View padding="$4">{markdownElement}</View>
        <AnswerDrawer enabled />
      </ScrollView>
    </>
  );
}
