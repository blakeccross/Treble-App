import { useQuiz } from "@/context/quiz-context";
import useMarkdown from "@/hooks/parseSymbolsFromText";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, View } from "tamagui";

export default function Index() {
  const { currentQuestionIndex, questions, nextQuestion } = useQuiz();
  const [readingText, setReadingText] = useState(questions?.[currentQuestionIndex]?.reading_text);

  useEffect(() => {
    setReadingText(questions?.[currentQuestionIndex]?.reading_text);
  }, [currentQuestionIndex, questions]);

  const markdownElement = useMarkdown((readingText || "")?.replace(/(\r\n|\r|\n)/g, "\n"));

  return (
    <>
      <ScrollView backgroundColor={"$background"}>
        <View padding="$4">{markdownElement}</View>
        <View
          style={{
            width: "100%",
            bottom: 0,
          }}
          padding="$4"
        >
          <Button onPress={nextQuestion} width={"100%"} fontWeight={600} fontSize={"$7"} height={"$5"}>
            Continue
          </Button>
        </View>
        <SafeAreaView edges={["bottom"]} />
      </ScrollView>
    </>
  );
}
