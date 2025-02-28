import React, { useRef, useState, useContext } from "react";
import { FlatList, SafeAreaView, useWindowDimensions } from "react-native";
import SheetMusic from "@/components/sheet-music";
import { Card, H3, Paragraph, View } from "tamagui";
import AnswerDrawer from "@/components/questions/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";

export default function Page() {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const { height, width } = useWindowDimensions();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const question = useRef(questions && questions[currentQuestionIndex]);

  function validate() {
    setAnswerIsCorrect(selectedAnswer === question.current?.answer_id?.[0]);
    if (selectedAnswer === question.current?.answer_id?.[0]) return true;
    else return false;
  }

  return (
    <>
      <SafeAreaView />
      {question.current?.question && (
        <View paddingHorizontal="$4" style={{ width: "100%", justifyContent: "center" }} paddingBottom="$4">
          <H3 fontWeight={600}>Question:</H3>
          <Paragraph>{question.current?.question}</Paragraph>
        </View>
      )}
      <View flex={1} justifyContent="center" alignItems="center">
        {question.current?.sheet_music && <SheetMusic maxWidth={width * 0.5} data={question.current.sheet_music} />}
      </View>

      <View paddingHorizontal="$4" marginTop="$4">
        {question.current?.question_options && (
          <FlatList
            data={question.current.question_options}
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
                // animation="bouncy"
                flex={1}
                borderWidth={"$1"}
                onPress={() => setSelectedAnswer(item.id)}
                backgroundColor={
                  selectedAnswer === item.id ? (answerIsCorrect ? "$green5" : answerIsCorrect !== undefined ? "$red5" : "$gray6") : "$background"
                }
                borderColor={
                  selectedAnswer === item.id ? (answerIsCorrect ? "$green8" : answerIsCorrect !== undefined ? "$red10" : "$gray6") : "$background"
                }
              >
                <Card.Header alignItems="center">
                  <Paragraph fontWeight={600} paddingVertical={"$3"}>
                    {item.option_text}
                  </Paragraph>
                </Card.Header>
              </Card>
            )}
          />
        )}
      </View>
      <AnswerDrawer validateAnswer={validate} explanation={question.current?.answer_explanation || ""} enabled />
    </>
  );
}
