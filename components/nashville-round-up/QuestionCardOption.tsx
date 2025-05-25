import Animated, { interpolate, SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import CardBackDesign from "./CardBackDesign";
import { color, red } from "@tamagui/themes";
import { H1, View } from "tamagui";
import { StyleSheet } from "react-native";
import { getTextColor } from "@/utils/nashville-round-up/getTextColor";
import NashvilleNumber from "./NashvilleNumber";

const QuestionCardOption = ({
  show,
  isFlipped,
  direction = "y",
  duration = 500,
  value,
}: {
  show: boolean;
  isFlipped: SharedValue<boolean>;
  direction?: "x" | "y";
  duration?: number;
  value: string;
}) => {
  const isDirectionX = direction === "x";

  // useEffect(() => {
  //   if (show) {
  //     setTimeout(() => {
  //       isFlipped.value = true;
  //     }, 1000); // Matches BounceIn duration
  //   }
  // }, [show, isFlipped, duration]);

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });
    const scaleValue = withTiming(1, { duration }); // Updated line for scaling

    return {
      transform: [{ scale: scaleValue }, isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });
    const scaleValue = withTiming(1, { duration }); // Updated line for scaling

    return {
      transform: [{ scale: scaleValue }, isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  return (
    <View>
      <Animated.View style={[flipCardStyles.regularCard, flipCardStyles.flipCard, regularCardAnimatedStyle]}>
        <View flex={1} borderRadius={16} backgroundColor="$red9" borderWidth={5} borderColor="white" overflow="hidden">
          <CardBackDesign color={color.red10Dark as string} width={170} height={200} />
        </View>
      </Animated.View>
      <Animated.View style={[flipCardStyles.flippedCard, flipCardStyles.flipCard, flippedCardAnimatedStyle]}>
        <View flex={1} borderRadius={16} backgroundColor="white" justifyContent="center" alignItems="center">
          <NashvilleNumber text={value} inversionChordSize={"$9"} />
        </View>
      </Animated.View>
    </View>
  );
};

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
  flipCard: {
    width: 80,
    aspectRatio: 170 / 200,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backfaceVisibility: "hidden",
  },
});

export default QuestionCardOption;
