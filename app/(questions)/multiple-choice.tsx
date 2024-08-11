import React, { useContext, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Index() {
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
      {/* <SafeAreaView /> */}
      {/* <ScrollView backgroundColor={"$background"}>
        <Markdown mergeStyle style={styles}>
          {questionTextRef.current?.replace(/(\r\n|\r|\n)/g, "\n")}
        </Markdown>
        <AnswerDrawer enabled />
      </ScrollView> */}
      {/* <Animated.View style={[{ padding: 10 }, animatedStyleFlatList]}>
        <FlatList
          data={availableAnswers}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          style={{ overflow: "visible" }}
          numColumns={2}
          renderItem={({ item }) => (
            <Card
              bordered
              elevate
              disabled={!isRunning}
              borderRadius="$8"
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
              flex={1}
              onPress={() => validateAnswer(item.value)}
              borderWidth={"$1"}
              backgroundColor={
                selectedAnswer === item.value
                  ? answerIsCorrect
                    ? "$green5"
                    : answerIsCorrect !== undefined
                    ? "$red5"
                    : "$gray6"
                  : correctAnswer.current === item.value && selectedAnswer !== ""
                  ? "$green5"
                  : "$background"
              }
              borderColor={
                selectedAnswer === item.value
                  ? answerIsCorrect
                    ? "$green8"
                    : answerIsCorrect !== undefined
                    ? "$red10"
                    : "$gray6"
                  : correctAnswer.current === item.value && selectedAnswer !== ""
                  ? "$green8"
                  : "$background"
              }
            >
              <Card.Header alignItems="center">
                <H2 fontWeight={600} paddingVertical={"$3"}>
                  {item.option_text.charAt(0).toUpperCase()}
                  {item.option_text.charAt(1) === "s" && "#"}
                </H2>
              </Card.Header>
            </Card>
          )}
        />
      </Animated.View> */}
      <SafeAreaView style={{ flex: 0 }} />
    </>
  );
}
