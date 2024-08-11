import { QuizContext } from "@/context/quiz-context";
import React, { useContext, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import AnswerDrawer from "@/components/AnswerDrawer";
import { ScrollView } from "tamagui";

export default function Index() {
  const { currentQuestionIndex, questions, nextQuestion } = useContext(QuizContext);
  const questionTextRef = useRef(questions[currentQuestionIndex]?.reading_text || "");

  const styles = StyleSheet.create({
    heading1: {
      fontSize: 40,
      fontWeight: 700,
    },
    paragraph: {
      fontSize: 20,
      lineHeight: 30,
    },
    bullet_list: {
      fontSize: 20,
    },
    ordered_list: {
      fontSize: 20,
    },
    body: {
      marginBottom: 50,
      padding: 20,
    },
  });

  return (
    <>
      <SafeAreaView />
      <ScrollView backgroundColor={"$background"}>
        <Markdown mergeStyle style={styles}>
          {questionTextRef.current?.replace(/(\r\n|\r|\n)/g, "\n")}
        </Markdown>
        <AnswerDrawer enabled />
      </ScrollView>
    </>
  );
}
