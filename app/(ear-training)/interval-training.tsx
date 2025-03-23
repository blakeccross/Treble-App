import usePlayMidi from "@/hooks/usePlayMidi";
import { usePlaySFX } from "@/hooks/usePlaySFX";
import { window } from "@/utils";
import { Canvas, Circle, SweepGradient, vec } from "@shopify/react-native-skia";
import { Heart, X } from "@tamagui/lucide-icons";
import { blueDark, darkColors, red } from "@tamagui/themes";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, SafeAreaView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Card, H1, H2, Paragraph, XStack, YStack } from "tamagui";

const PAGE_WIDTH = window.width;
const colorOptions = ["blue", "orange", "green", "red", "yellow", "purple", "pink"];

// Define all notes from C2 to C4
const notes = [
  "c2",
  "c#2",
  "d2",
  "d#2",
  "e2",
  "f2",
  "f#2",
  "g2",
  "g#2",
  "a2",
  "a#2",
  "b2",
  "c3",
  "c#3",
  "d3",
  "d#3",
  "e3",
  "f3",
  "f#3",
  "g3",
  "g#3",
  "a3",
  "a#3",
  "b3",
  "c4",
];

// Define intervals and their semitone distances
const intervals = [
  { name: "Perfect Unison", semitones: 0, display: "P1" },
  { name: "Minor Second", semitones: 1, display: "m2" },
  { name: "Major Second", semitones: 2, display: "M2" },
  { name: "Minor Third", semitones: 3, display: "m3" },
  { name: "Major Third", semitones: 4, display: "M3" },
  { name: "Perfect Fourth", semitones: 5, display: "P4" },
  { name: "Tritone", semitones: 6, display: "TT" },
  { name: "Perfect Fifth", semitones: 7, display: "P5" },
  { name: "Minor Sixth", semitones: 8, display: "m6" },
  { name: "Major Sixth", semitones: 9, display: "M6" },
  { name: "Minor Seventh", semitones: 10, display: "m7" },
  { name: "Major Seventh", semitones: 11, display: "M7" },
  { name: "Perfect Octave", semitones: 12, display: "P8" },
];

const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");

export default function Page() {
  const circleWidth = PAGE_WIDTH * 0.55;
  const router = useRouter();
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [totalTime, setTotalTime] = useState<number>(15);
  const [colorSceme, setColorSceme] = useState<string>("blue");
  const [playEnabled, setTapEnabled] = useState(true);
  const [availableAnswers, setAvailableAnswers] = useState(
    intervals.slice(0, 4).map((interval) => ({
      value: interval.semitones.toString(),
      option_text: interval.display,
    }))
  );

  const { playSFX } = usePlaySFX();
  const { playSong, stopSong } = usePlayMidi();

  const correctAnswer = useRef("");
  const currentInterval = useRef<{ firstNote: string; secondNote: string; interval: number }>({
    firstNote: "",
    secondNote: "",
    interval: 0,
  });

  // Shared values for scale animations
  const rotate1 = useSharedValue(2 * Math.PI);
  const scale1 = useSharedValue(1);

  const rotate2 = useSharedValue(0);
  const scale2 = useSharedValue(1);

  const theta = useSharedValue(2 * Math.PI);

  // Shared value for translationY animation
  const translationY = useSharedValue(window.height);

  // Animated styles
  const animatedStyleRotate1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate1.value}rad` }, { scale: scale1.value }],
  }));

  // const animatedStyleRotate2 = useAnimatedProps(() => ({
  //   transform: [{ rotate: rotate2.value }],
  // }));

  const animatedStyleRotate2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate2.value}rad` }, { scale: scale2.value }],
  }));

  const animatedStyleFlatList = useAnimatedStyle(() => ({
    transform: [{ translateY: translationY.value }],
    // height: translationY.value,
  }));

  const [showAnswer, setShowAnswer] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);

  function calculateInterval(note1: string, note2: string): number {
    // Convert notes to their base note and octave
    const [base1, octave1] = [note1.replace(/[0-9]/g, ""), parseInt(note1.match(/\d+/)?.[0] || "0")];
    const [base2, octave2] = [note2.replace(/[0-9]/g, ""), parseInt(note2.match(/\d+/)?.[0] || "0")];

    // Define the chromatic scale
    const chromaticScale = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];

    // Get positions in chromatic scale
    const pos1 = chromaticScale.indexOf(base1.toLowerCase());
    const pos2 = chromaticScale.indexOf(base2.toLowerCase());

    // Calculate total semitones considering octaves
    let semitones = pos2 - pos1 + (octave2 - octave1) * 12;

    // Ensure positive interval by adding octaves if necessary
    while (semitones < 0) {
      semitones += 12;
    }

    // Keep within one octave
    return semitones % 12;
  }

  function getRandomInterval(minSemitones: number = 1, maxSemitones: number = 12): [string, string] {
    // Get a random starting note that allows for the interval range
    const startingNoteIndex = Math.floor(Math.random() * (notes.length - maxSemitones));
    const firstNote = notes[startingNoteIndex];

    // Calculate possible second notes based on the interval range
    const possibleSecondNotes = notes.slice(startingNoteIndex + minSemitones, startingNoteIndex + maxSemitones + 1);

    const secondNote = possibleSecondNotes[Math.floor(Math.random() * possibleSecondNotes.length)];
    return [firstNote, secondNote];
  }

  function getIntervalOptions(correctInterval: number): typeof intervals {
    // Get 3 random incorrect intervals
    const incorrectOptions = intervals
      .filter((int) => int.semitones !== correctInterval)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Add the correct interval and shuffle
    const allOptions = [...incorrectOptions, intervals.find((int) => int.semitones === correctInterval)!];
    return allOptions.sort(() => Math.random() - 0.5);
  }

  function validateAnswer(selectedId: string) {
    setSelectedAnswer(selectedId);
    const isCorrect = selectedId === correctAnswer.current;
    setShowAnswer(true);

    if (isCorrect) {
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
  }

  function handleIncorrect() {
    const updatedLives = lives - 1;
    setLives(updatedLives);
    if (updatedLives <= 0) {
      setTapEnabled(true);
      setIsRunning(false);
      setGameHasStarted(false);
      router.push({ pathname: "/game-over", params: { score: currentScore, gameName: "interval_training" } });
    }
    stopSong();

    setAnswerIsCorrect(false);
    playSFX(incorrectSFX);
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

  function newQuestion() {
    // Adjust difficulty based on score
    if (currentScore <= 10) {
      setTotalTime(10);
    } else if (currentScore <= 25) {
      setTotalTime(5);
    } else if (currentScore <= 50) {
      setTotalTime(3);
    }

    // Generate random interval
    const [firstNote, secondNote] = getRandomInterval();
    const intervalDistance = calculateInterval(firstNote, secondNote);

    console.log(firstNote, secondNote, "intervalDistance", intervalDistance);
    currentInterval.current = {
      firstNote,
      secondNote,
      interval: intervalDistance,
    };

    correctAnswer.current = intervalDistance.toString();

    // Get interval options and update state
    const intervalOptions = getIntervalOptions(intervalDistance);
    setAvailableAnswers(
      intervalOptions.map((interval) => ({
        value: interval.semitones.toString(),
        option_text: interval.display,
      }))
    );

    startAnimation();
  }

  function handlePressPlay() {
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }

    if (!isRunning) {
      setSelectedAnswer("");
      setTapEnabled(true);
      setShowAnswer(false);
      newQuestion();
      changeColor();
      bounce();
      playInterval();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      bounce();
      playInterval();
    }
  }

  function playInterval() {
    if (currentInterval.current.firstNote && currentInterval.current.secondNote) {
      playSong([
        { note: currentInterval.current.firstNote as any, time: 0, duration: 1 },
        { note: currentInterval.current.secondNote as any, time: 1, duration: 1 },
      ]);
    }
  }

  function changeColor() {
    const randomColorOption = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorSceme(randomColorOption);
  }

  // Function to trigger the bounce effect
  async function bounce() {
    springIn();
    animateRotation();

    scale1.value = withDelay(
      0,
      withSpring(1.2, { duration: 300, dampingRatio: 0.5, stiffness: 400 }, () => {
        scale1.value = withSpring(1);
      })
    );

    scale2.value = withDelay(
      1000, // Add 300ms delay for the second circle
      withSpring(1.2, { duration: 300, dampingRatio: 0.5, stiffness: 400 }, () => {
        scale2.value = withSpring(1);
      })
    );
  }

  function animateRotation() {
    rotate1.value = withRepeat(withTiming(0, { duration: totalTime * 1000, easing: Easing.linear, reduceMotion: ReduceMotion.System }), 0);
    rotate2.value = withRepeat(withTiming(2 * Math.PI, { duration: totalTime * 1000, easing: Easing.linear, reduceMotion: ReduceMotion.System }), 0);
  }

  // useEffect(() => {
  //   animateRotation();
  // }, []);

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
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [isRunning]);

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

  const tapGesture = Gesture.Tap()
    .onTouchesUp(() => {
      if (playEnabled) {
        handlePressPlay();
      }
    })
    .runOnJS(true);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0 }} />

      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
        <Pressable onPress={() => router.back()}>
          <X size="$3" />
        </Pressable>
        <H1 fontWeight={600}>{currentScore}</H1>
        <XStack gap="$1">
          <Heart size="$2" color={"$red10"} fill={red.red10} />
          <Paragraph fontWeight={600}>{lives}</Paragraph>
        </XStack>
      </XStack>

      <YStack justifyContent="center" alignItems="center" marginTop="$4">
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[{ width: circleWidth, height: circleWidth }, animatedStyleRotate1]}>
            <Canvas style={{ flex: 1 }}>
              <Circle cx={circleWidth / 2} cy={circleWidth / 2} r={circleWidth / 2}>
                <SweepGradient
                  c={vec(circleWidth / 2, circleWidth / 2)}
                  colors={[darkColors[`${colorSceme}9` as keyof typeof darkColors], darkColors[`${colorSceme}8` as keyof typeof darkColors]]}
                />
              </Circle>
            </Canvas>
          </Animated.View>
        </GestureDetector>
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[{ width: circleWidth, height: circleWidth }, animatedStyleRotate2]}>
            <Canvas style={[{ flex: 1 }]}>
              <Circle cx={circleWidth / 2} cy={circleWidth / 2} r={circleWidth / 2} origin={{ x: circleWidth / 2, y: circleWidth / 2 }}>
                <SweepGradient
                  c={vec(circleWidth / 2, circleWidth / 2)}
                  colors={[darkColors[`${colorSceme}8` as keyof typeof darkColors], darkColors[`${colorSceme}9` as keyof typeof darkColors]]}
                />
              </Circle>
            </Canvas>
          </Animated.View>
        </GestureDetector>
      </YStack>

      {/* {showAnswer && (
        <YStack alignItems="center" marginTop="$4">
          <H2 color={answerIsCorrect ? "$green10" : "$red10"}>{intervals.find((int) => int.semitones.toString() === correctAnswer.current)?.name}</H2>
          {!answerIsCorrect && (
            <Paragraph color="$gray11" marginTop="$2">
              {currentInterval.current.firstNote.toUpperCase()} to {currentInterval.current.secondNote.toUpperCase()}
            </Paragraph>
          )}
        </YStack>
      )} */}

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
                <H2 fontWeight={600}>{item.option_text}</H2>
                <Paragraph color="$gray11">{intervals.find((int) => int.semitones.toString() === item.value)?.name}</Paragraph>
              </Card.Header>
            </Card>
          )}
        />
      </Animated.View>
      <SafeAreaView style={{ flex: 0 }} />
    </View>
  );
}
