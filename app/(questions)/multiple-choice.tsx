import AnswerDrawer from "@/components/questions/AnswerDrawer";
import { QuizContext } from "@/context/quiz-context";
import { Image } from "expo-image";
import React, { useContext, useRef, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { Card, Paragraph, View } from "tamagui";

export default function MultipleCHoice() {
  const { currentQuestionIndex, questions } = useContext(QuizContext);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const question = useRef(questions && questions[currentQuestionIndex]);

  function validate() {
    const isCorrect =
      selectedAnswers.every((answer) => question.current?.answer_id?.includes(answer)) &&
      selectedAnswers.length === question.current?.answer_id?.length;
    setAnswerIsCorrect(isCorrect);
    return isCorrect;
  }

  return (
    <>
      <SafeAreaView />
      <View padding="$4" paddingBottom={0} flex={1}>
        <View flex={1} style={{ width: "100%" }} paddingBottom="$4" justifyContent="flex-start">
          {/* <H5 fontWeight={800}>{question.current?.answer_id && question.current?.answer_id.length > 1 ? "Multiple Answer:" : "Multiple Choice:"}</H5> */}
          <Paragraph marginBottom="$2" fontSize={"$7"}>
            {question.current?.question}
          </Paragraph>
          {(question.current?.local_image_uri || question.current?.image) && (
            <Image
              source={question.current?.local_image_uri || question.current?.image}
              style={{ borderRadius: 20, aspectRatio: "16/9", maxWidth: "100%", backgroundColor: "white" }}
              contentFit="contain"
            />
          )}
        </View>

        <View>
          {question.current?.answer_id && question.current?.answer_id.length > 1 && <Paragraph textAlign="center">Select all that apply</Paragraph>}
          {question.current?.question_options && (
            <FlatList
              data={question.current.question_options}
              contentContainerStyle={{ gap: 10 }}
              style={{ overflow: "visible" }}
              renderItem={({ item }) => (
                <Card
                  bordered
                  borderRadius="$8"
                  pressStyle={{ scale: 0.95 }}
                  // animation="bouncy"
                  flex={1}
                  onPress={() => {
                    if (question.current?.answer_id) {
                      setSelectedAnswers((prev) => {
                        const isSelected = prev.includes(item.id);
                        const maxSelections = question.current?.answer_id?.length || 0;

                        if (isSelected) {
                          return prev.filter((id) => id !== item.id);
                        } else if (maxSelections === 1) {
                          return [item.id];
                        } else if (selectedAnswers.length < maxSelections) {
                          return [...prev, item.id];
                        }
                        return [...prev.slice(1), item.id];
                      });
                    }
                  }}
                  backgroundColor={
                    selectedAnswers.includes(item.id)
                      ? answerIsCorrect
                        ? "$green5"
                        : answerIsCorrect !== undefined
                        ? "$red5"
                        : "$gray6"
                      : "$background"
                  }
                  borderColor={
                    selectedAnswers.includes(item.id)
                      ? answerIsCorrect
                        ? "$green8"
                        : answerIsCorrect !== undefined
                        ? "$red10"
                        : "$gray6"
                      : undefined
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
      <AnswerDrawer validateAnswer={validate} explanation={question.current?.answer_explanation || ""} enabled />
    </>
  );
}
