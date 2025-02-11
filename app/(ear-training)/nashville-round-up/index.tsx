import { X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming, BounceIn, SharedValue } from "react-native-reanimated";
import { WebView } from "react-native-webview";
import { Card, H1, H2, View } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import CardAnswerOptions from "./components/CardAnswerOptions";
import { CHORDS } from "./constants/chords";
import AnswerFeedback from "./components/AnswerFeedback";
import CardBackDesign from "./components/CardBackDesign";
import { color } from "@tamagui/themes";
import { useMidiJSON } from "@/hooks/useMidiJSON";
import usePlayMidi from "@/hooks/usePlayMidi";

const FlipCard = ({
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

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        isFlipped.value = true;
      }, 1000); // Matches BounceIn duration
    }
  }, [show, isFlipped, duration]);

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
      <Animated.View style={[flipCardStyles.regularCard, styles.flipCard, regularCardAnimatedStyle]}>
        <View flex={1} borderRadius={16} backgroundColor="$red9" borderWidth={5} borderColor="white" overflow="hidden">
          <CardBackDesign color={color.red10Dark as string} width={170} height={200} />
        </View>
      </Animated.View>
      <Animated.View style={[flipCardStyles.flippedCard, styles.flipCard, flippedCardAnimatedStyle]}>
        <View flex={1} borderRadius={16} backgroundColor="white" justifyContent="center" alignItems="center">
          <H1>{value}</H1>
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
});

export default function App() {
  const isFlippedArray = [useSharedValue(false), useSharedValue(false), useSharedValue(false)];
  const correctAnswer = useRef("");
  const cardAnswerOptionsRef = useRef<any>(null);
  const webViewRef = useRef<WebView>(null);
  const [showCard, setShowCard] = useState(false);
  const [nashvilleNumbersSolutionSet, setNashvilleNumbersSolutionSet] = useState([
    {
      option_text: "1",
      value: "1",
    },
    {
      option_text: "4",
      value: "4",
    },
    {
      option_text: "5",
      value: "5",
    },
  ]);
  const { playSong } = usePlayMidi();
  const midiToAudio = require("./components/midiPlayer.html");

  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  // const [injectedScript, setInjectedScript] = useState("");
  const [availableAnswers, setAvailableAnswers] = useState([
    { value: "c4", option_text: "C" },
    { value: "d4", option_text: "D" },
    { value: "e4", option_text: "Eb" },
  ]);

  const [midiJSON, setMidiJSON] = useState<any>(null);

  useEffect(() => {
    const fetchMidiJSON = async () => {
      const midiJSON = await useMidiJSON("./progressions/pirates.mid");
      setMidiJSON(midiJSON);
    };
    fetchMidiJSON();
  }, []);

  const getRandomChords = (chords: any[], count: number) => {
    const shuffled = chords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  function shuffle(array: { option_text: string; value: string }[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getRandomNotes(excludeNote: { option_text: string; value: string }, notesArray: { option_text: string; value: string }[]) {
    // Filter out the excludeNote from the notesArray
    const filteredNotes = notesArray.filter((note) => note.value !== excludeNote.value);

    // Shuffle the array
    const shuffledOptions = shuffle(filteredNotes).slice(0, 3); // Shuffle and take first 3
    const quizOptions = shuffledOptions.slice(0, 3).concat(excludeNote);

    // Return the first three elements
    return shuffle(quizOptions);
  }

  const playProgression = () => {
    const convertedNotes = midiJSON.tracks[0].notes.map((note: any) => ({
      duration: note.duration,
      note: note.name,
      time: note.time,
      // velocity: note.velocity * 128,
    }));
    playSong(convertedNotes.slice(0, 150));
  };

  const handleFlip = () => {
    playProgression();
    const randomNashvilleNumbers = getRandomChords(CHORDS, 3);
    setAvailableAnswers(randomNashvilleNumbers);

    setShowCard(true);
    setSelectedAnswer("");
    cardAnswerOptionsRef.current?.handlePress();

    const indexToRemainUnflipped = Math.floor(Math.random() * isFlippedArray.length);

    correctAnswer.current = nashvilleNumbersSolutionSet[indexToRemainUnflipped].value;
    setAvailableAnswers(getRandomNotes(nashvilleNumbersSolutionSet[indexToRemainUnflipped], randomNashvilleNumbers));

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = index !== indexToRemainUnflipped;
    });
  };

  function handleAnswerPress(answer: string) {
    setAnswerIsCorrect(answer === correctAnswer.current);

    setSelectedAnswer(answer);
    setSelectedAnswer(answer);

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = true;
    });
  }

  // useEffect(() => {
  //   const loadScript = async () => {
  //     try {
  //       const smplrPath = require("../../../node_modules/smplr/dist/index.js");
  //       console.log("smpl", smplrPath);
  //       // Resolve the local asset file
  //       const asset = Asset.fromModule(smplrPath);
  //       await asset.downloadAsync(); // Ensure the file is loaded
  //       const script = await FileSystem.readAsStringAsync(asset.localUri || "");

  //       setInjectedScript(script);
  //     } catch (error) {
  //       console.error("Error loading script:", error);
  //     }
  //   };

  //   loadScript();
  // }, []);

  const runFirst = `

  true; // note: this is required, or you'll sometimes get silent failures
`;

  return (
    <LinearGradient width="100%" height="100%" colors={["$green10", "$green8"]} start={[0.5, 1]} end={[0, 0]}>
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <X size="$3" />
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.toggleButton} onPress={handleFlip}>
            <Text style={styles.toggleButtonText}>Flip Cards</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {showCard &&
            isFlippedArray.map((isFlipped, index) => (
              <Animated.View key={index} entering={BounceIn.duration(1000).delay(index * 300)}>
                <FlipCard show={showCard} isFlipped={isFlipped} value={nashvilleNumbersSolutionSet[index].option_text} />
              </Animated.View>
            ))}
        </View>
        <WebView ref={webViewRef} originWhitelist={["*"]} source={midiToAudio} domStorageEnabled javaScriptEnabled injectedJavaScript={runFirst} />
      </SafeAreaView>

      {selectedAnswer && <AnswerFeedback isCorrect={answerIsCorrect} />}

      <CardAnswerOptions
        ref={cardAnswerOptionsRef}
        onCardPress={handleAnswerPress}
        availableAnswers={availableAnswers}
        selectedAnswer={selectedAnswer}
        answerIsCorrect={answerIsCorrect}
      />
      <SafeAreaView style={{ flex: 0 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: 300,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "#b58df1",
    padding: 12,
    borderRadius: 48,
  },
  toggleButtonText: {
    color: "#fff",
    textAlign: "center",
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
