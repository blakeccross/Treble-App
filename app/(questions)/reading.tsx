import { QuizContext } from "@/context/quiz-context";
import React, { useContext, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import AnswerDrawer from "@/components/AnswerDrawer";
import { ScrollView, View } from "tamagui";
import { Appearance, useColorScheme } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import useMarkdown from "@/hooks/parseSymbolsFromText";
import WholeNote from "@/assets/icons/wholeNote";

export default function Index() {
  let colorScheme = useColorScheme();
  const { currentQuestionIndex, questions, nextQuestion } = useContext(QuizContext);
  const questionTextRef = useRef(questions[currentQuestionIndex]?.reading_text || "");
  const markdownElement = useMarkdown(questionTextRef.current?.replace(/(\r\n|\r|\n)/g, "\n"));

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
    text: {
      color: colorScheme === "light" ? "black" : "white",
    },
  });

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
