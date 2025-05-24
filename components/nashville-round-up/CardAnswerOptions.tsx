import { window } from "@/utils";
import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import { lightColors, red } from "@tamagui/themes";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { H1 } from "tamagui";
import NashvilleNumber from "./NashvilleNumber";

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

  const pulsingEffect = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const correctAnswerStyle = {
    shadowColor: "gold",
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "gold",
  };

  const incorrectAnswerStyle = {
    shadowColor: lightColors.red9,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: lightColors.red9,
  };

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

  useEffect(() => {
    if (selectedAnswer !== "" && !isSelected) {
      animatedValue.value = withTiming(animatedValue.value - window.height * -0.25, { duration: 600 });
    }
  }, [selectedAnswer]);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: window.height * 0.07, // Start off-screen
          left: "50%",
          marginLeft: -CARD_WIDTH / 2,
          width: CARD_WIDTH,
          aspectRatio: 100 / 140,
          borderRadius: 12,
        },
        pulsingEffect,
        animatedStyle,
        isSelected ? (answerIsCorrect ? correctAnswerStyle : incorrectAnswerStyle) : {},
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 10,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderColor: "transparent",
        }}
      >
        <Pressable disabled={selectedAnswer !== ""} onPress={handlePress} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <H1 fontWeight={800} color={getTextColor(text)}>
            <NashvilleNumber text={text} />
          </H1>
        </Pressable>
      </View>
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
      availableAnswers: string[];
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
        {animatedValues.map((animatedValue, index) => (
          <Card
            key={index}
            onPress={() => onCardPress(availableAnswers[index])}
            index={index}
            animatedValue={animatedValue}
            text={availableAnswers[index]}
            selectedAnswer={selectedAnswer}
            answerIsCorrect={answerIsCorrect}
          />
        ))}
      </View>
    );
  }
);

CardAnswerOptions.displayName = "CardAnswerOptions";

export default CardAnswerOptions;
