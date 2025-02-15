import PokerChip from "@/assets/icons/PokerChip";
import AnswerFeedback from "@/components/nashville-round-up/AnswerFeedback";
import CardAnswerOptions from "@/components/nashville-round-up/CardAnswerOptions";
import QuestionCardOption from "@/components/nashville-round-up/QuestionCardOption";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import usePlayMidi from "@/hooks/usePlayMidi";
import { ChordProgression } from "@/types/chordProgression";
import { PianoKey } from "@/types/pianoKeys";
import { window } from "@/utils";
import { delay } from "@/utils/delay";
import { BarChart2, Heart, X } from "@tamagui/lucide-icons";
import { lightColors, red } from "@tamagui/themes";
import { Link, router } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import Animated, { BounceIn, BounceOut, useSharedValue } from "react-native-reanimated";
import { Button, H1, H2, Paragraph, View, XStack } from "tamagui";
import { CHORDS } from "@/constants/chords";
import { progressions } from "@/constants/progressions/easyProgressions";
import { shuffle } from "@/utils/shuffle";
import { LinearGradient } from "tamagui/linear-gradient";
import * as Haptics from "expo-haptics";
import { useUser } from "@/context/user-context";

const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");
const shuffleAudio = require("@/assets/audio/fx/shuffle.mp3");

export default function App() {
  const { currentUser, updatedLives, lives: userLives } = useUser();
  const isFlippedArray = [useSharedValue(false), useSharedValue(false), useSharedValue(false), useSharedValue(false), useSharedValue(false)];
  const correctAnswer = useRef("");
  const cardAnswerOptionsRef = useRef<any>(null);
  const [showCard, setShowCard] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [nashvilleNumbersSolutionSet, setNashvilleNumbersSolutionSet] = useState<ChordProgression>();
  const { playSong, stopSong } = usePlayMidi();
  const { playAudio } = useAudioPlayer();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [availableAnswers, setAvailableAnswers] = useState<string[]>([]);

  const getRandomChords = (chords: string[], count: number) => {
    const shuffled = chords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  function getRandomAnswerOptions(correctAnswer: string, notesArray: string[]) {
    // Filter out the excludeNote from the notesArray
    const filteredNotes = notesArray.filter((note) => note !== correctAnswer);

    // Shuffle the array
    const shuffledOptions = shuffle(filteredNotes).slice(0, 3);
    const quizOptions = shuffledOptions.slice(0, 2).concat(correctAnswer);

    // Return the first three elements
    return shuffle(quizOptions);
  }

  const playProgression = (progression: ChordProgression) => {
    const convertedNotes = progression?.midi.map((note) => ({
      duration: note.end - note.start,
      note: note.name as PianoKey,
      time: note.start,
      // velocity: note.velocity * 128,
    }));
    playSong(convertedNotes || [], 3);
  };

  function getRandomProgression() {
    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
    return randomProgression;
  }

  function resetGame() {
    setAnswerIsCorrect(undefined);
  }

  function handleStartGame() {
    if (userLives !== undefined && userLives <= 0) {
      router.push("/out-of-lives");
      return;
    } else {
      updatedLives(-1);
      playAudio(shuffleAudio);
      setGameHasStarted(true);
      handleFlip();
    }
  }

  const handleFlip = () => {
    resetGame();
    const randomNashvilleNumbers = getRandomChords(CHORDS, 3);

    const randomProgression = getRandomProgression();

    setNashvilleNumbersSolutionSet(randomProgression);

    setShowCard(true);
    setSelectedAnswer("");
    cardAnswerOptionsRef.current?.handlePress();

    const indexToRemainUnflipped = Math.floor(Math.random() * randomProgression.value.length);

    correctAnswer.current = (randomProgression && randomProgression.value[indexToRemainUnflipped]) || "";
    setAvailableAnswers(getRandomAnswerOptions(randomProgression && randomProgression.value[indexToRemainUnflipped], randomNashvilleNumbers));

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = index !== indexToRemainUnflipped;
    });

    delay(1000).then(() => {
      playProgression(randomProgression);
    });
  };

  async function handleAnswerPress(answer: string) {
    const isCorrect = answer === correctAnswer.current;

    setAnswerIsCorrect(isCorrect);

    if (isCorrect) {
      playAudio(correctSFX, 0.3);
      setCurrentScore(currentScore + 1);
    } else {
      handleIncorrect();
    }

    stopSong();

    setSelectedAnswer(answer);

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = true;
    });

    await delay(2000);

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = false;
    });

    await delay(1000);

    handleFlip();
  }

  function handleIncorrect() {
    setLives(lives - 1);
    if (lives <= 1) {
      router.push({ pathname: "/game-over", params: { score: currentScore, gameName: "nashville_round_up" } });
    }
    playAudio(incorrectSFX);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  return (
    <LinearGradient width="100%" height="100%" colors={["$green10", "$green8"]} start={[0.5, 1]} end={[0, 0]}>
      <SafeAreaView style={{ flex: 0 }} />

      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
        <View width={"$3"}>
          <Pressable onPress={() => router.back()}>
            <X size="$3" color={"white"} />
          </Pressable>
        </View>
        <H1 fontWeight={600} color={"white"}>
          {currentScore}
        </H1>
        <View width={"$3"} alignItems="flex-end">
          {gameHasStarted ? (
            <XStack gap="$1">
              <Heart size="$2" color={"$red10"} fill={red.red10} />
              <Paragraph fontWeight={600} color={"white"}>
                {lives}
              </Paragraph>
            </XStack>
          ) : (
            <Pressable onPress={() => router.push(`/leaderboard?gameName=nashville_round_up`)}>
              <BarChart2 size="$2" color={"white"} />
            </Pressable>
          )}
        </View>
      </XStack>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {showCard &&
            nashvilleNumbersSolutionSet?.value.map((isFlipped, index) => (
              <Animated.View key={index} entering={BounceIn.duration(1000).delay(index * 300)} exiting={BounceOut.duration(500)}>
                <QuestionCardOption show={showCard} isFlipped={isFlippedArray[index]} value={nashvilleNumbersSolutionSet?.value[index] || ""} />
              </Animated.View>
            ))}
        </View>
      </View>

      <View style={{ marginTop: window.height * 0.1 }}>
        {!gameHasStarted && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button backgroundColor="$green10" pressStyle={{ backgroundColor: "$green11" }} onPress={handleStartGame} alignItems="center">
              <H2 fontWeight={800}>Play</H2>
            </Button>
          </View>
        )}
        {selectedAnswer && <AnswerFeedback isCorrect={answerIsCorrect} />}
      </View>

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
});
