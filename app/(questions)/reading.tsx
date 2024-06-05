import { QuizContext } from "@/context/quiz-context";
import { NavigationContainer } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import { Button, Card, H1, H3 } from "tamagui";
import Markdown from "react-native-markdown-display";
import AnswerDrawer from "@/components/AnswerDrawer";

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;

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
