import SquareProgress from "@/components/aquare-progress";
import usePlayMidi from "@/hooks/usePlayMidi";
import { PianoKey } from "@/types/pianoKeys";
import { window } from "@/utils";
import { Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import { AVPlaybackSource, Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, SafeAreaView, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { Button, Card, H1, H2, H3, Paragraph, Square, XStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useAudioPlayer } from "expo-audio";

const PAGE_WIDTH = window.width;
const colorOptions = ["blue", "orange", "green", "red", "yellow", "purple", "pink"];
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
type ChordType = "major" | "minor" | "major7" | "minor7" | "dim";
const chordTypes: { type: ChordType; intervals: number[] }[] = [
  { type: "major", intervals: [0, 4, 7] }, // Root, Major Third, Perfect Fifth
  { type: "minor", intervals: [0, 3, 7] }, // Root, Minor Third, Perfect Fifth
  { type: "major7", intervals: [0, 4, 7, 11] }, // Root, Major Third, Perfect Fifth, Major Seventh
  { type: "minor7", intervals: [0, 3, 7, 11] }, // Root, Major Third, Perfect Fifth, Major Seventh
  { type: "dim", intervals: [0, 3, 6] }, // Root, Major Third, Perfect Fifth, Major Seventh
];
const availableAnswers = [
  { value: "major", option_text: "maj" },
  { value: "minor", option_text: "min" },
  { value: "major7", option_text: "maj7" },
  { value: "minor7", option_text: "min7" },
  { value: "dim", option_text: "dim" },
];

const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");

export default function Page() {
  const navigation = useNavigation();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound>();
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [totalTime, setTotalTime] = useState<number>(15);
  const [colorSceme, setColorSceme] = useState<string>("blue");

  const { playSong, stopSong } = usePlayMidi();
  // const [availableAnswers, setAvailableAnswers] = useState([
  //   { value: "c4", option_text: "C" },
  //   { value: "d4", option_text: "D" },
  //   { value: "e4", option_text: "Eb" },
  //   { value: "f4", option_text: "F" },
  // ]);

  const correctAnswer = useRef({ type: "major", chord: ["c3", "e3", "g3"] });
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
    setSelectedAnswer(selectedId);
    // Replace with real value
    if (selectedId === correctAnswer.current.type) {
      setAnswerIsCorrect(true);
      setCurrentScore(currentScore + 1);
      playSFX(correctSFX);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      handleIncorrect();
    }
    // correctAnswer.current = "";
    setIsRunning(false);

    // springOut();
  }

  function handleIncorrect() {
    if (lives <= 1) {
      router.push({ pathname: "/game-over", params: { score: currentScore, gameName: "name-that-chord" } });
    } else {
      setLives(lives - 1);
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

  function getChordNotes(root: string, type: ChordType): string[] {
    // Find the index of the root note in the array
    const rootIndex = notes.indexOf(root.toLowerCase());

    if (rootIndex === -1) {
      throw new Error("Invalid root note");
    }

    // Get the appropriate chord pattern
    const chordPattern = chordTypes.find((chord) => chord.type === type)?.intervals;
    if (!chordPattern) {
      throw new Error("Invalid chord type");
    }

    // Calculate the notes of the chord
    const chordNotes = chordPattern.map((interval) => notes[(rootIndex + interval) % notes.length] + "3");
    return chordNotes;
  }

  function newQuestion() {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomType = chordTypes[Math.floor(Math.random() * chordTypes.length)].type as ChordType;
    const randomChord = getChordNotes(randomNote, randomType);
    console.log(randomChord, randomType);
    // let answerOptions = notes;
    if (currentScore >= 10) {
      setTotalTime(10);
    } else if (currentScore >= 25) {
      setTotalTime(5);
    } else if (currentScore >= 50) {
      setTotalTime(3);
    }
    // correctAnswer.current = "";
    startAnimation();
    // const randomNote = answerOptions[Math.floor(Math.random() * notes.length)] as keyof typeof noteToFile;
    correctAnswer.current = { type: randomType, chord: randomChord };

    // console.log(randomNote);
    // const options = getRandomChordT(randomNote, answerOptions);
    // setAvailableAnswers(options.map((item) => ({ value: item, option_text: item })));
  }

  async function playSFX(sfx: AVPlaybackSource, interrupt?: boolean) {
    const { sound } = await Audio.Sound.createAsync(sfx);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    if (interrupt) {
      setSound(sound);
    }

    await sound.playAsync();
  }

  async function playAudio() {
    const chord = correctAnswer.current?.chord.map((note) => ({ note: note as PianoKey, time: 0, duration: 5 }));
    playSong(chord, 7);
  }

  function handlePressPlay() {
    if (!isRunning) {
      setSelectedAnswer("");
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

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [isRunning]); // Empty dependency array ensures the effect runs only once

  const startAnimation = () => {
    setIsRunning(true);
    theta.value = 1;
  };

  function handleTimerFinished() {
    setSelectedAnswer("1");
    setIsRunning(false);
    handleIncorrect();
    // springOut();
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0 }} />

      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
        <Pressable onPress={() => router.navigate("/(ear-training)")}>
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
            <Square
              size={PAGE_WIDTH * 0.85}
              backgroundColor={`$${colorSceme}10Dark`}
              elevation="$0.25"
              overflow="hidden"
              position="absolute"
            ></Square>
            <SquareProgress
              size={PAGE_WIDTH * 0.85}
              strokeWidth={(PAGE_WIDTH * (0.85 - 0.7)) / 2}
              time={totalTime}
              color={"black"}
              opacity={0.2}
              theta={theta}
              isRunning={isRunning}
            />
          </Animated.View>

          <Animated.View style={[animatedStyle2, { position: "absolute" }]}>
            <Square size={PAGE_WIDTH * 0.7} backgroundColor={`$${colorSceme}8Dark`} elevation="$0.25" />
          </Animated.View>
          <Animated.View style={[animatedStyle3, { position: "absolute" }]}>
            <Square size={PAGE_WIDTH * 0.55} backgroundColor={`$${colorSceme}7Dark`} elevation="$0.25" />
          </Animated.View>
          <TapGestureHandler onActivated={handlePressPlay}>
            <Animated.View style={[animatedStyle4, { position: "absolute" }]}>
              <Square
                size={PAGE_WIDTH * 0.4}
                // backgroundColor="$blue3Dark"
                elevation="$0.25"
                pressStyle={{ scale: 0.95 }}
                // animation="bouncy"
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
              </Square>
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
              // animation="bouncy"
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
                  : correctAnswer.current.type === item.value && selectedAnswer !== ""
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
                  : correctAnswer.current.type === item.value && selectedAnswer !== ""
                  ? "$green8"
                  : "$background"
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
