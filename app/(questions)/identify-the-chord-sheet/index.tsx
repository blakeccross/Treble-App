import React, { useRef, useState, useContext } from "react";
import { FlatList, SafeAreaView, View, useWindowDimensions } from "react-native";
import SheetMusic from "@/components/sheet-music";
import { Card, H1, H2, H3 } from "tamagui";
import { Stack } from "expo-router";
import AnswerDrawer from "@/components/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";

export default function Page() {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const { height, width } = useWindowDimensions();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const question = questions[currentQuestionIndex];

  function validate() {
    setAnswerIsCorrect(selectedAnswer === question.answer_id);
    if (selectedAnswer === question.answer_id) return true;
    else return false;
  }

  return (
    <>
      <SafeAreaView />
      <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
        {question.sheet_music && <SheetMusic maxWidth={width * 0.5} data={question.sheet_music} clef="treble" timeSig="4/4" />}
      </View>

      <View style={{ padding: 10 }}>
        <FlatList
          data={question.options}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          style={{ overflow: "visible" }}
          numColumns={2}
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
                selectedAnswer === item.id ? (answerIsCorrect ? "$green10" : answerIsCorrect !== undefined ? "$red10" : "$gray6") : "$background"
              }
            >
              <Card.Header alignItems="center">
                <H2 fontWeight={600} paddingVertical={"$3"}>
                  {item.option_text}
                </H2>
              </Card.Header>
            </Card>
          )}
        />
      </View>
      <AnswerDrawer validateAnswer={validate} explanation={question.explanation} enabled />
    </>
  );
}
