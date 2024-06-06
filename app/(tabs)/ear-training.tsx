import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@tamagui/themes";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, ReduceMotion } from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop } from "react-native-svg";
import { Avatar, Card, H3, H5, Paragraph, Circle, Separator, Square, XStack, YStack, useEvent, useControllableState, H1, H2 } from "tamagui";
import { window } from "@/utils";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import "../../assets/audio/notec.mp3";
import { useEffect, useState } from "react";

const PAGE_WIDTH = window.width;

export default function TabTwoScreen() {
  const [sound, setSound] = useState<Audio.Sound>();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  // Shared values for scale animations
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);

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

  async function playAudio() {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/audio/notec.mp3"));
    sound.setRateAsync(1, false);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <H1 fontWeight={600}>
        Ear
        {`\n`}
        Training
      </H1> */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center", height: PAGE_WIDTH * 0.85 }}>
          <Animated.View style={[animatedStyle1, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.85} backgroundColor="$blue10Dark" elevation="$0.25" />
          </Animated.View>
          <Animated.View style={[animatedStyle2, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.7} backgroundColor="$blue8Dark" elevation="$0.25" />
          </Animated.View>
          <Animated.View style={[animatedStyle3, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.55} backgroundColor="$blue7Dark" elevation="$0.25" />
          </Animated.View>
          <TapGestureHandler onActivated={bounce}>
            <Animated.View style={[animatedStyle4, { position: "absolute" }]}>
              <Circle size={PAGE_WIDTH * 0.4} backgroundColor="$blue3Dark" elevation="$0.25" pressStyle={{ scale: 0.95 }} animation="bouncy">
                <H3 color="white">Play</H3>
              </Circle>
            </Animated.View>
          </TapGestureHandler>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <FlatList
          data={[
            { id: 1, option_text: "C maj" },
            { id: 2, option_text: "D min7" },
            { id: 3, option_text: "Eb" },
            { id: 4, option_text: "F sus" },
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
    </SafeAreaView>
  );
}
