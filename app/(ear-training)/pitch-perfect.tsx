import Ionicons from "@expo/vector-icons/Ionicons";
import { color, colorTokens, red } from "@tamagui/themes";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated";
import { Card, H3, Paragraph, Circle, XStack, H1, H2 } from "tamagui";
import { window } from "@/utils";
import { TapGestureHandler } from "react-native-gesture-handler";
import { AVPlaybackSource, Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, X, FileLineChart, BarChart, BarChart2 } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import { Link, router, useFocusEffect, useNavigation, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import GradientCircle from "@/components/gradient-circle";

const PAGE_WIDTH = window.width;
const colorOptions = ["blue", "orange", "green", "red", "yellow", "purple", "pink"];
const notes = ["c3", "d3", "e3", "f3", "g3", "a3", "b3"];
const notesHard = ["c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3"];

// Static imports for audio files
const noteToFile = {
  c3: require("@/assets/audio/piano_c3.mp3"),
  cs3: require("@/assets/audio/piano_cs3.mp3"),
  d3: require("@/assets/audio/piano_d3.mp3"),
  ds3: require("@/assets/audio/piano_ds3.mp3"),
  e3: require("@/assets/audio/piano_e3.mp3"),
  f3: require("@/assets/audio/piano_f3.mp3"),
  fs3: require("@/assets/audio/piano_fs3.mp3"),
  g3: require("@/assets/audio/piano_g3.mp3"),
  gs3: require("@/assets/audio/piano_gs3.mp3"),
  a3: require("@/assets/audio/piano_a3.mp3"),
  as3: require("@/assets/audio/piano_as3.mp3"),
  b3: require("@/assets/audio/piano_b3.mp3"),
};

const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");

export default function Page() {
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [totalTime, setTotalTime] = useState<number>(15);
  const [colorSceme, setColorSceme] = useState<string>("blue");
  const [availableAnswers, setAvailableAnswers] = useState([
    { value: "c4", option_text: "C" },
    { value: "d4", option_text: "D" },
    { value: "e4", option_text: "Eb" },
    { value: "f4", option_text: "F" },
  ]);
  const [playEnabled, setTapEnabled] = useState(true);

  const correctAnswer = useRef("");
  // Shared values for scale animations
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);

  const theta = useSharedValue(2 * Math.PI);

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

  function validateAnswer(selectedId: string) {
    try {
      setTapEnabled(false);
      setSelectedAnswer(selectedId);
      if (selectedId === correctAnswer.current) {
        setAnswerIsCorrect(true);
        setCurrentScore(currentScore + 1);
        playSFX(correctSFX);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsRunning(false);
      } else {
        handleIncorrect();
      }
      setIsRunning(false);
      springOut();
    } catch (error) {
      console.error("Error validating answer:", error);
    }
  }

  function handleIncorrect() {
    setLives(lives - 1);
    if (lives <= 1) {
      router.push({ pathname: "/game-over", params: { score: currentScore, gameName: "pitch_perfect" } });
    }
    setAnswerIsCorrect(false);
    playSFX(incorrectSFX, true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  useFocusEffect(
    useCallback(() => {
      // Reset Game
      setLives(3);
      setCurrentScore(0);

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  function shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getRandomNotes(excludeNote: string, notesArray: string[]): string[] {
    // Filter out the excludeNote from the notesArray
    const filteredNotes = notesArray.filter((note) => note !== excludeNote);

    // Shuffle the array
    const shuffledOptions = shuffle(filteredNotes).slice(0, 3); // Shuffle and take first 3
    const quizOptions = shuffledOptions.slice(0, 3).concat(excludeNote);

    // Return the first three elements
    return shuffle(quizOptions);
  }

  function newQuestion() {
    let answerOptions = notes;

    if (currentScore <= 10) {
      setTotalTime(10);
    } else if (currentScore <= 25) {
      setTotalTime(5);
      answerOptions = notesHard;
    } else if (currentScore <= 50) {
      setTotalTime(3);
    }
    correctAnswer.current = "";
    startAnimation();
    let randomNote: keyof typeof noteToFile = "c3";

    if (currentScore > 0) {
      randomNote = answerOptions[Math.floor(Math.random() * notes.length)] as keyof typeof noteToFile;
    }

    correctAnswer.current = randomNote;
    console.log(randomNote);
    const options = getRandomNotes(randomNote, answerOptions);
    setAvailableAnswers(options.map((item) => ({ value: item, option_text: item })));
  }

  async function playSFX(sfx: AVPlaybackSource, interrupt?: boolean) {
    try {
      const { sound } = await Audio.Sound.createAsync(sfx);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      if (interrupt) {
        setSound(sound);
      }

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing SFX:", error);
    }
  }

  async function playAudio() {
    const { sound } = await Audio.Sound.createAsync(noteToFile[correctAnswer.current as keyof typeof noteToFile]);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    setSound(sound);
    await sound.playAsync();
  }

  function handlePressPlay() {
    if (lives >= 1) {
      console.log("lives", lives);
      if (!isRunning) {
        if (!gameHasStarted) setGameHasStarted(true);
        setSelectedAnswer("");
        setTapEnabled(true);
        newQuestion();
        changeColor();
        bounce();
        playAudio();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        bounce();
        playAudio();
      }
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  function changeColor() {
    const randomColorOption = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorSceme(randomColorOption);
  }

  // Function to trigger the bounce effect
  async function bounce() {
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
  }

  function springIn() {
    translationY.value = withSpring(0, {
      damping: 12,
      stiffness: 50,
    });
  }

  function springOut() {
    translationY.value = withDelay(
      500,
      withSpring(window.height, {
        damping: 12,
        stiffness: 15,
      })
    );
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isRunning) {
        handleTimerFinished();
      }
    }, totalTime * 1000);

    if (!isRunning && lives >= 1 && gameHasStarted) {
      setTimeout(() => {
        handlePressPlay();
      }, 1000); // Wait for 1 second (1000 milliseconds)
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [isRunning]); // Empty dependency array ensures the effect runs only once

  const startAnimation = () => {
    setIsRunning(true);
    theta.value = 2 * Math.PI;
  };

  function handleTimerFinished() {
    setSelectedAnswer("1");
    setIsRunning(false);
    handleIncorrect();
    springOut();
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0 }} />

      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
        <Pressable onPress={() => router.back()}>
          <X size="$3" />
        </Pressable>
        <H1 fontWeight={600}>{currentScore}</H1>
        {gameHasStarted ? (
          <XStack gap="$1">
            <Heart size="$2" color={"$red10"} fill={red.red10} />
            <Paragraph fontWeight={600}>{lives}</Paragraph>
          </XStack>
        ) : (
          <Link asChild href={{ pathname: "/leaderboard", params: { gameName: "pitch_perfect" } }}>
            <BarChart2 size="$2" />
          </Link>
        )}
      </XStack>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center", height: PAGE_WIDTH * 0.85 }}>
          <Animated.View style={[animatedStyle1, { position: "absolute" }]}>
            <Circle
              size={PAGE_WIDTH * 0.85}
              backgroundColor={`$${colorSceme}10Dark`}
              elevation="$0.25"
              overflow="hidden"
              position="absolute"
            ></Circle>
            <GradientCircle
              size={PAGE_WIDTH * 0.85}
              strokeWidth={100}
              time={totalTime}
              color={"black"}
              opacity={0.2}
              theta={theta}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </Animated.View>

          <Animated.View style={[animatedStyle2, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.7} backgroundColor={`$${colorSceme}8Dark`} elevation="$0.25" />
          </Animated.View>
          <Animated.View style={[animatedStyle3, { position: "absolute" }]}>
            <Circle size={PAGE_WIDTH * 0.55} backgroundColor={`$${colorSceme}7Dark`} elevation="$0.25" />
          </Animated.View>
          <TapGestureHandler onActivated={handlePressPlay} enabled={playEnabled}>
            <Animated.View style={[animatedStyle4, { position: "absolute" }]}>
              <Circle size={PAGE_WIDTH * 0.4} elevation="$0.25" pressStyle={{ scale: 0.95 }} animation="bouncy" overflow="hidden">
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
      </Animated.View>
      <SafeAreaView style={{ flex: 0 }} />
    </View>
  );
}
