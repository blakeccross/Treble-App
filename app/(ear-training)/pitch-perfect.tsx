import Ionicons from "@expo/vector-icons/Ionicons";
import { color, red } from "@tamagui/themes";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, ReduceMotion } from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop } from "react-native-svg";
import { Avatar, Card, H3, H5, Paragraph, Circle, Separator, Square, XStack, YStack, useEvent, useControllableState, H1, H2 } from "tamagui";
import { window } from "@/utils";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Heart, X } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";

const PAGE_WIDTH = window.width;
const colorOptions = ["blue", "orange", "green", "red", "yellow", "purple", "pink"];

export default function TabTwoScreen() {
  const [sound, setSound] = useState<Audio.Sound>();
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [colorSceme, setColorSceme] = useState<string>("blue");
  // Shared values for scale animations
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);

  // Shared value for translationY animation
  const translationY = useSharedValue(window.height);

  // Animated styles
  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: scale4.value }],
  }));
  const animatedStyleFlatList = useAnimatedStyle(() => ({
    transform: [{ translateY: translationY.value }],
    // height: translationY.value,
  }));

  function validateAnswer(selectedId: number) {
    setSelectedAnswer(selectedId);
    // Replace with real value
    if (selectedId === 1) {
      setAnswerIsCorrect(true);
      setCurrentScore(currentScore + 1);
    } else {
      setAnswerIsCorrect(false);
      setLives(lives - 1);
    }
    springOut();
  }

  async function playAudio() {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/audio/notec.mp3"));
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to trigger the bounce effect
  async function bounce() {
    const randomColorOption = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorSceme(randomColorOption);
    springIn();
    const bounceAnimation = withSpring(
      1.2,
      {
        duration: 0,
        dampingRatio: 0.5,
        stiffness: 200,
      },
      () => {
        scale4.value = withSpring(1);
      }
    );

    scale4.value = bounceAnimation;

    scale1.value = withDelay(
      0,
      withSpring(1.2, { duration: 300, dampingRatio: 0.5, stiffness: 400 }, () => {
        scale1.value = withSpring(1);
      })
    );

    scale2.value = withDelay(
      0,
      withSpring(1.2, { duration: 200, dampingRatio: 0.5, stiffness: 200, overshootClamping: false }, () => {
        scale2.value = withSpring(1);
      })
    );

    scale3.value = withDelay(
      0,
      withSpring(1.2, { duration: 100, dampingRatio: 0.5, stiffness: 300, overshootClamping: false }, () => {
        scale3.value = withSpring(1);
      })
    );
    await playAudio();
  }

  function springIn() {
    setSelectedAnswer(null);
    translationY.value = withSpring(0, {
      damping: 12,
      stiffness: 50,
    });
  }

  function springOut() {
    translationY.value = withDelay(
      200,
      withSpring(window.height, {
        damping: 12,
        stiffness: 15,
      })
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0 }} />

      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
        <Pressable>
          <X size="$3" />
        </Pressable>
        <H1 fontWeight={600}>{currentScore}</H1>
        <XStack gap="$1">
          <Heart size="$2" color={"$red10"} fill={red.red10} />
          <Paragraph fontWeight={600}>{lives}</Paragraph>
        </XStack>
      </XStack>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center", height: PAGE_WIDTH * 0.85 }}>
          <Animated.View style={[animatedStyle1, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.85} backgroundColor={`$${colorSceme}10Dark`} elevation="$0.25" overflow="hidden">
              {/* <LinearGradient width={"100%"} height={"100%"} colors={["$blue10Dark", "$blue1"]} start={[1, 1]} end={[0, 0]} /> */}
            </Circle>
          </Animated.View>
          <Animated.View style={[animatedStyle2, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.7} backgroundColor={`$${colorSceme}8Dark`} elevation="$0.25" />
          </Animated.View>
          <Animated.View style={[animatedStyle3, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.55} backgroundColor={`$${colorSceme}7Dark`} elevation="$0.25" />
          </Animated.View>
          <TapGestureHandler onActivated={bounce}>
            <Animated.View style={[animatedStyle4, { position: "absolute" }]}>
              <Circle
                size={PAGE_WIDTH * 0.4}
                // backgroundColor="$blue3Dark"
                elevation="$0.25"
                pressStyle={{ scale: 0.95 }}
                animation="bouncy"
                overflow="hidden"
              >
                <LinearGradient
                  width={"100%"}
                  height={"100%"}
                  colors={[`$${colorSceme}3Dark`, `$${colorSceme}4Dark`]}
                  start={[1, 1]}
                  end={[0, 0]}
                  justifyContent="center"
                  alignItems="center"
                >
                  <H3 color="white">Play</H3>
                </LinearGradient>
              </Circle>
            </Animated.View>
          </TapGestureHandler>
        </View>
      </View>
      <Animated.View style={[{ padding: 10 }, animatedStyleFlatList]}>
        <FlatList
          data={[
            { id: 1, option_text: "C" },
            { id: 2, option_text: "D" },
            { id: 3, option_text: "Eb" },
            { id: 4, option_text: "F" },
          ]}
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
              onPress={() => validateAnswer(item.id)}
              backgroundColor={
                selectedAnswer === item.id ? (answerIsCorrect ? "$green5" : answerIsCorrect !== undefined ? "$red5" : "$gray6") : "$background"
              }
              borderColor={
                selectedAnswer === item.id ? (answerIsCorrect ? "$green8" : answerIsCorrect !== undefined ? "$red10" : "$gray6") : "$background"
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
      </Animated.View>
      <SafeAreaView style={{ flex: 0 }} />
    </View>
  );
}
