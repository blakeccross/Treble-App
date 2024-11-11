import React, { useRef, useState, useContext, useEffect } from "react";
import { FlatList, SafeAreaView, useWindowDimensions } from "react-native";
import SheetMusic from "@/components/sheet-music";
import { Card, H1, H2, H3, Paragraph, View } from "tamagui";
import { Stack } from "expo-router";
import AnswerDrawer from "@/components/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";
import { Image } from "expo-image";

export default function MultipleCHoice() {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const { height, width } = useWindowDimensions();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const question = useRef(questions[currentQuestionIndex]);

  function validate() {
    setAnswerIsCorrect(selectedAnswer === question.current.answer_id);
    if (selectedAnswer === question.current.answer_id) return true;
    else return false;
  }

  return (
    <>
      <SafeAreaView />
      <View padding="$4" paddingBottom="0" flex={1}>
        <View flex={1} style={{ width: "100%", justifyContent: "center" }} paddingBottom="$4">
          <H3 fontWeight={800}>Question:</H3>
          <Paragraph marginBottom="$2" fontSize={"$7"}>
            {question.current.question}
          </Paragraph>
          {question.current.image && (
            <Image
              source={question.current.image}
              style={{ borderRadius: 20, aspectRatio: "16/9", maxWidth: "100%", backgroundColor: "white" }}
              contentFit="contain"
            />
          )}
        </View>

        <View>
          {question.current.question_options && (
            <FlatList
              data={question.current.question_options}
              contentContainerStyle={{ gap: 10 }}
              style={{ overflow: "visible" }}
              renderItem={({ item }) => (
                <Card
                  bordered
                  borderRadius="$8"
                  pressStyle={{ scale: 0.95 }}
                  animation="bouncy"
                  flex={1}
                  onPress={() => setSelectedAnswer(item.id)}
                  backgroundColor={
                    selectedAnswer === item.id ? (answerIsCorrect ? "$green5" : answerIsCorrect !== undefined ? "$red5" : "$gray6") : "$background"
                  }
                  borderColor={
                    selectedAnswer === item.id ? (answerIsCorrect ? "$green8" : answerIsCorrect !== undefined ? "$red10" : "$gray6") : undefined
                  }
                >
                  <Card.Header>
                    <Paragraph fontWeight={600}>{item.option_text}</Paragraph>
                  </Card.Header>
                </Card>
              )}
            />
          )}
        </View>
      </View>
      <AnswerDrawer validateAnswer={validate} explanation={question.current.answer_explanation || ""} enabled />
    </>
  );
}
