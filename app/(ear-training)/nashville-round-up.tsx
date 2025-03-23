import GradientCircle from "@/components/gradient-circle";
import AnswerFeedback from "@/components/nashville-round-up/AnswerFeedback";
import CardAnswerOptions from "@/components/nashville-round-up/CardAnswerOptions";
import QuestionCardOption from "@/components/nashville-round-up/QuestionCardOption";
import { CHORDS } from "@/constants/chords";
import { progressions } from "@/constants/progressions/easyProgressions";
import { useUser } from "@/context/user-context";
import usePlayMidi from "@/hooks/usePlayMidi";
import { usePlaySFX } from "@/hooks/usePlaySFX";
import { ChordProgression } from "@/types/chordProgression";
import { PianoKey } from "@/types/pianoKeys";
import { window } from "@/utils";
import { delay } from "@/utils/delay";
import { shuffle } from "@/utils/shuffle";
import { BarChart2, Heart, X } from "@tamagui/lucide-icons";
import { red } from "@tamagui/themes";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import Animated, { BounceIn, BounceOut, useSharedValue } from "react-native-reanimated";
import { H1, Paragraph, View, XStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");
const shuffleAudio = require("@/assets/audio/fx/shuffle.mp3");

export default function App() {
  const { currentUser, updatedLives, lives: userLives } = useUser();
  const { playSong, stopSong } = usePlayMidi();
  const { playSFX } = usePlaySFX();
  const isFlippedArray = [useSharedValue(false), useSharedValue(false), useSharedValue(false), useSharedValue(false), useSharedValue(false)];
  const correctAnswer = useRef("");
  const cardAnswerOptionsRef = useRef<any>(null);
  const [showCard, setShowCard] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [nashvilleNumbersSolutionSet, setNashvilleNumbersSolutionSet] = useState<ChordProgression>();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [availableAnswers, setAvailableAnswers] = useState<string[]>([]);
  const gameDuration = 15;

  const theta = useSharedValue(2 * Math.PI);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isRunning) {
        handleTimerFinished();
      }
    }, gameDuration * 1000);

    return () => clearTimeout(timeoutId);
  }, [isRunning]);

  async function handleTimerFinished() {
    setSelectedAnswer("101");
    setAnswerIsCorrect(false);
    setIsRunning(false);
    handleIncorrect();
    stopSong();

    isFlippedArray.forEach((isFlipped, index) => {
      isFlipped.value = true;
    });

    await delay(2000);

    if (lives > 1) {
      handleFlip();
    }
  }

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
    // stopSong();
    const convertedNotes = progression?.midi.map((note) => ({
      duration: note.end - note.start,
      note: note.name as PianoKey,
      time: note.start,
      // velocity: note.velocity * 128,
    }));
    playSong(convertedNotes || []);
  };

  function getRandomProgression() {
    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
    return randomProgression;
  }

  function resetGame() {
    setAnswerIsCorrect(undefined);
    theta.value = 2 * Math.PI;
  }

  function handleStartGame() {
    if (userLives !== undefined && userLives <= 0 && !currentUser?.is_subscribed) {
      stopSong();
      router.push("/out-of-lives");
      return;
    } else {
      updatedLives(-1);
      playSFX(shuffleAudio);
      setGameHasStarted(true);
      handleFlip();
    }
  }

  const handleFlip = () => {
    resetGame();
    setIsRunning(true);
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
      playSFX(correctSFX, 0.3);
      setCurrentScore(currentScore + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      handleIncorrect();
    }

    setIsRunning(false);
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
    playSFX(incorrectSFX);
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
            <XStack gap="$1" alignItems="center">
              <Heart size="$2" color={"$red10"} fill={red.red10} />
              <Paragraph fontSize={"$5"} fontWeight={600} color={"white"}>
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
      <View alignItems="center" minHeight={window.height * 0.15}>
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <GradientCircle
            size={window.width * 0.2}
            strokeWidth={40}
            time={gameDuration}
            color={"black"}
            opacity={0.2}
            theta={theta}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
          />
          <View
            onPress={gameHasStarted ? () => nashvilleNumbersSolutionSet && playProgression(nashvilleNumbersSolutionSet) : handleStartGame}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph fontWeight={800} color={"white"}>
              Play
            </Paragraph>
          </View>
        </View>
        <View position="absolute" width={"100%"}>
          {selectedAnswer && <AnswerFeedback isCorrect={answerIsCorrect} />}
        </View>
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
