import React, { useRef, useState, useContext, useEffect } from "react";
import { FlatList, SafeAreaView, useWindowDimensions } from "react-native";
import SheetMusic from "@/components/sheet-music";
import { Card, H1, H2, H3, Paragraph, View } from "tamagui";
import { Stack } from "expo-router";
import AnswerDrawer from "@/components/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";

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
      <View padding="$4" flex={1}>
        <View flex={1} style={{ width: "100%", justifyContent: "center" }}>
          <H3 fontWeight={600}>Question:</H3>
          <Paragraph marginBottom="$8">{question.current.question}</Paragraph>
        </View>

        <View>
          {question.current.question_options && (
            <FlatList
              data={question.current.question_options}
              // columnWrapperStyle={{ gap: 10 }}
              contentContainerStyle={{ gap: 10 }}
              style={{ overflow: "visible" }}
              // numColumns={2}
              renderItem={({ item }) => (
                <Card
                  bordered
                  elevate
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
