import { router } from "expo-router";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withRepeat, withSequence } from "react-native-reanimated";
import { window } from "@/utils";
import { H1 } from "tamagui";
import GoldenRaysCardEffect from "./goldenRaysCardEffect";

const CARD_WIDTH = window.width * 0.33;
const CARD_HEIGHT = 140;
const FAN_SPREAD = 15;
const HORIZONTAL_SPREAD = window.width * 0.25;

const Card = ({
  index,
  animatedValue,
  text,
  onPress,
  selectedAnswer,
  answerIsCorrect,
}: {
  index: number;
  animatedValue: any;
  text: string;
  onPress: () => void;
  selectedAnswer: string;
  answerIsCorrect: boolean | undefined;
}) => {
  const isSelected = selectedAnswer === text;

  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }), // Glow in
          withTiming(0.3, { duration: 1000 }) // Glow out
        ),
        -1, // Infinite loop
        true // Reverse direction
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isSelected]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: "gold",
    shadowOpacity: glowOpacity.value,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "gold",
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: animatedValue.value },
        { translateX: (index - 1) * HORIZONTAL_SPREAD }, // Spread cards horizontally
        { rotateZ: `${(index - 1) * FAN_SPREAD}deg` },
      ],
      zIndex: index,
    };
  });

  const handlePress = () => {
    animatedValue.value = withTiming(animatedValue.value - window.height * 0.05, { duration: 300 });
    onPress();
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: window.height * 0.07, // Start off-screen
          left: "50%",
          marginLeft: -CARD_WIDTH / 2,
          width: CARD_WIDTH,
          //   height: CARD_HEIGHT,
          aspectRatio: 100 / 140,
          //backgroundColor: ["#ff6666", "#66ff66", "#6666ff"][index],
          backgroundColor: "white",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderRadius: 10,
          // opacity: 0.5,
        },
        animatedStyle,
        isSelected && answerIsCorrect ? glowStyle : {},
      ]}
    >
      <Pressable disabled={selectedAnswer !== ""} onPress={handlePress} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <H1 color={["#ff6666", "#171717", "#ff6666"][index]}>{text}</H1>
      </Pressable>
    </Animated.View>
  );
};

const CardAnswerOptions = forwardRef(
  (
    {
      availableAnswers,
      onCardPress,
      selectedAnswer,
      answerIsCorrect,
    }: {
      availableAnswers: { option_text: string; value: string }[];
      onCardPress: (index: string) => void;
      selectedAnswer: string;
      answerIsCorrect: boolean | undefined;
    },
    ref
  ) => {
    const animatedValues = [useSharedValue(300), useSharedValue(300), useSharedValue(300)];

    const handlePress = () => {
      if (animatedValues.every((animatedValue) => animatedValue.value === 0)) {
        animatedValues.forEach((animatedValue, index) => {
          animatedValue.value = withDelay(index * 100, withTiming(300, { duration: 500 }));
        });
      } else {
        animatedValues.forEach((animatedValue, index) => {
          animatedValue.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
        });
      }
    };

    useImperativeHandle(ref, () => ({
      handlePress,
    }));

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <Pressable onPress={handlePress} style={{ marginTop: 20, padding: 10, backgroundColor: "black" }}>
        <Text style={{ color: "white" }}>Show Cards</Text>
      </Pressable>
      <Pressable onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: "black" }}>
        <Text style={{ color: "white" }}>Go Back</Text>
      </Pressable> */}

        {animatedValues.map((animatedValue, index) => (
          <Card
            key={index}
            onPress={() => onCardPress(availableAnswers[index].value)}
            index={index}
            animatedValue={animatedValue}
            text={availableAnswers[index].option_text}
            selectedAnswer={selectedAnswer}
            answerIsCorrect={answerIsCorrect}
          />
        ))}
      </View>
    );
  }
);

export default CardAnswerOptions;
