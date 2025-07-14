import { delay } from "@/utils/delay";
import { BarChart2, Heart, X } from "@tamagui/lucide-icons";
import { blue, greenA, red } from "@tamagui/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StatusBar, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { BounceIn, FadeOut, SlideInDown, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H1, Paragraph, View, XStack } from "tamagui";
import GradientCircle from "../../components/gradient-circle";
import KeyPressAnimation from "../../components/sheet-music/KeyPressAnimation";
import PianoKeys from "../../components/sheet-music/PianoKeys";
import MusicalStaff, { NoteProps, Pitch } from "../../components/sheet-music/sheet-music";
import usePlayMidi from "@/hooks/usePlayMidi";
import { PianoKey } from "@/types/pianoKeys";
import { usePlaySFX } from "@/hooks/usePlaySFX";

// Constants
const GAME_DURATION = 5;
const INITIAL_LIVES = 3;
const MAX_ATTEMPTS = 50;
const SFX_VOLUME = 0.1;
const NOTE_DURATION = 0.5;

// Audio assets
const correctSFX = require("@/assets/audio/correct_sfx.mp3");
const incorrectSFX = require("@/assets/audio/incorrect_sfx.mp3");

// Musical constants
const NOTES = ["a", "b", "c", "d", "e", "f", "g"] as const;
const FLAT_TO_SHARP_MAP: Record<string, string> = {
  b: "a#", // B flat = A sharp
  e: "d#", // E flat = D sharp
  a: "g#", // A flat = G sharp
  d: "c#", // D flat = C sharp
  g: "f#", // G flat = F sharp
  c: "b", // C flat = B (though this is rare)
  f: "e", // F flat = E (though this is rare)
};

// Difficulty configuration
const DIFFICULTY_LEVELS = {
  BEGINNER: { minScore: 0, octaves: [4], accidentals: [""], duration: 7 },
  INTERMEDIATE: { minScore: 10, octaves: [4, 5], accidentals: [""], duration: 5 },
  ADVANCED: { minScore: 20, octaves: [4, 5], accidentals: ["", "sharp", "flat"], duration: 3 },
  EXPERT: { minScore: 30, octaves: [3, 4, 5, 6], accidentals: ["", "sharp", "flat"], duration: 2 },
} as const;

// Types
interface NotesQueue {
  previous: NoteProps[];
  current: NoteProps[];
}

interface DifficultyConfig {
  octaves: readonly number[];
  accidentals: readonly string[];
  duration: number;
}

// Utility functions
const getDifficultyConfig = (score: number): DifficultyConfig => {
  if (score >= DIFFICULTY_LEVELS.EXPERT.minScore) return DIFFICULTY_LEVELS.EXPERT;
  if (score >= DIFFICULTY_LEVELS.ADVANCED.minScore) return DIFFICULTY_LEVELS.ADVANCED;
  if (score >= DIFFICULTY_LEVELS.INTERMEDIATE.minScore) return DIFFICULTY_LEVELS.INTERMEDIATE;
  return DIFFICULTY_LEVELS.BEGINNER;
};

const convertFlatToSharp = (baseNote: string): string => {
  return FLAT_TO_SHARP_MAP[baseNote] || baseNote;
};

const getExpectedNote = (correctNote: NoteProps): string => {
  const baseNote = correctNote.pitch[0].toLowerCase();
  const accidental = correctNote.accidental;

  if (accidental === "sharp") {
    return baseNote + "#";
  } else if (accidental === "flat") {
    return convertFlatToSharp(baseNote);
  }

  return baseNote;
};

// Feedback Components
const AnswerFeedback = ({ isCorrect }: { isCorrect: boolean | undefined }) => {
  return isCorrect ? <CorrectAnswerFeedback /> : <IncorrectAnswerFeedback />;
};

const CorrectAnswerFeedback = () => (
  <Animated.View entering={SlideInDown.duration(500)} exiting={FadeOut.duration(1000)}>
    <Animated.View entering={BounceIn.duration(1000)} exiting={FadeOut.duration(1000)}>
      <H1 textAlign="center" color="$blue10" fontWeight={800}>
        +1
      </H1>
    </Animated.View>
  </Animated.View>
);

const IncorrectAnswerFeedback = () => (
  <Animated.View entering={SlideInDown.duration(500)} exiting={FadeOut.duration(1000)}>
    <Animated.View entering={BounceIn.duration(1000)} exiting={FadeOut.duration(1000)}>
      <X size="$10" color="$red10" />
    </Animated.View>
  </Animated.View>
);

// Game Header Component
const GameHeader = ({ currentScore, lives, gameHasStarted }: { currentScore: number; lives: number; gameHasStarted: boolean }) => (
  <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4">
    <View style={{ width: 50 }}>
      <Pressable onPress={() => router.back()}>
        <X size="$3" />
      </Pressable>
    </View>
    <H1 fontWeight={600}>{currentScore}</H1>
    <View style={{ width: 50, alignItems: "flex-end" }}>
      {gameHasStarted ? (
        <XStack gap="$1" alignItems="center">
          <Heart size="$2" color="$red10" fill={red.red10} />
          <Paragraph fontSize="$5" fontWeight={600}>
            {lives}
          </Paragraph>
        </XStack>
      ) : (
        <Link asChild href={{ pathname: "/leaderboard", params: { gameName: "staff_master" } }}>
          <BarChart2 size="$2" />
        </Link>
      )}
    </View>
  </XStack>
);

// Main Game Component
const StaffMasterGame = () => {
  const GameTimer = GradientCircle;
  const { top, bottom } = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { playSong } = usePlayMidi();
  const { playSFX } = usePlaySFX();

  // Game state
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [key, setKey] = useState(0);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [previousNote, setPreviousNote] = useState<string | null>(null);
  const [notesQueue, setNotesQueue] = useState<NotesQueue>({
    previous: [],
    current: [],
  });

  const correctAnswer = useRef<NoteProps | null>(null);
  const theta = useSharedValue(2 * Math.PI);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const config = getDifficultyConfig(currentScore);
    const timeoutId = setTimeout(() => {
      timerFinished();
    }, config.duration * 1000);

    return () => clearTimeout(timeoutId);
  }, [isRunning, currentScore]);

  // Game logic functions
  const generateRandomNote = (): NoteProps => {
    const config = getDifficultyConfig(currentScore);
    const selectedNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    const selectedOctave = config.octaves[Math.floor(Math.random() * config.octaves.length)];
    const selectedAccidental = config.accidentals[Math.floor(Math.random() * config.accidentals.length)];

    return {
      type: "quarter" as const,
      pitch: (selectedNote + selectedOctave) as Pitch,
      accidental: selectedAccidental === "" ? undefined : (selectedAccidental as "sharp" | "flat" | "natural"),
    };
  };

  const getRandomNote = (): NoteProps => {
    let attempts = 0;
    let noteString: string;
    let newNote: NoteProps;

    do {
      newNote = generateRandomNote();
      const baseNote = newNote.pitch[0].toLowerCase();
      const accidental = newNote.accidental;
      noteString = baseNote + (accidental || "");
      attempts++;
    } while (noteString === previousNote && attempts < MAX_ATTEMPTS);

    return newNote;
  };

  const startTimer = () => {
    theta.value = 2 * Math.PI;
    setIsRunning(true);
  };

  const timerFinished = async () => {
    setIsRunning(false);
    incorrectAnswer();
    await delay(1000);
    handleStart();
  };

  const resetGameState = () => {
    setCurrentScore(0);
    setLives(INITIAL_LIVES);
    setGameHasStarted(false);
    setIsRunning(false);
    setAnswerIsCorrect(undefined);
    setFeedbackKey(0);
    setNotesQueue({ previous: [], current: [] });
    theta.value = 2 * Math.PI;
  };

  const handleStart = () => {
    const newNote = getRandomNote();
    correctAnswer.current = newNote;

    const baseNote = newNote.pitch[0].toLowerCase();
    const accidental = newNote.accidental;
    const noteString = baseNote + (accidental || "");
    setPreviousNote(noteString);

    setNotesQueue((prev) => ({
      previous: prev.current.length > 0 ? prev.current : [],
      current: [newNote],
    }));

    setKey((prev) => prev + 1);
    startTimer();
  };

  const startGame = () => {
    setGameHasStarted(true);
    handleStart();
  };

  const incorrectAnswer = () => {
    const updatedLives = lives - 1;

    if (updatedLives <= 0) {
      resetGameState();
      router.push({ pathname: "/game-over", params: { score: currentScore, gameName: "nashville_round_up" } });
      return;
    }

    setAnswerIsCorrect(false);
    setLives(updatedLives);
    playSFX(incorrectSFX, SFX_VOLUME);
  };

  const handleCorrectAnswer = () => {
    setAnswerIsCorrect(true);
    setCurrentScore((prev) => prev + 1);
    playSFX(correctSFX, SFX_VOLUME);
  };

  const handleKeyPress = async (note: string) => {
    setAnswerIsCorrect(undefined);

    const correctNote = correctAnswer.current;
    if (!correctNote) return;

    const octave = correctNote.pitch.slice(-1);
    const noteWithOctave = (note + String(Number(octave) - 1)) as PianoKey;
    playSong([{ note: noteWithOctave, time: 0, duration: NOTE_DURATION }]);

    const expectedNote = getExpectedNote(correctNote);
    const isCorrect = note.toLowerCase() === expectedNote;

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      incorrectAnswer();
    }

    setIsRunning(false);
    setFeedbackKey((prev) => prev + 1);

    await delay(1000);
    handleStart();
    setAnswerIsCorrect(undefined);
  };

  return (
    <View style={{ flex: 1, paddingTop: top, paddingBottom: bottom }}>
      <StatusBar translucent={true} backgroundColor="transparent" />

      <GameHeader currentScore={currentScore} lives={lives} gameHasStarted={gameHasStarted} />

      <LinearGradient colors={["#f1f0f5", "#ffffff", "#e8e8e8"]} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <View style={styles.content}>
          <MusicalStaff
            key={key}
            scale={1.5}
            animateIn="right"
            notes1={notesQueue.previous}
            notes2={notesQueue.current}
            keySignature="C"
            centerLastLine={true}
            exitAnimation={false}
            showBarLines={false}
          />

          {!gameHasStarted && (
            <View style={styles.playButtonContainer}>
              <Button unstyled color={blue.blue10} fontSize="$7" fontWeight={800} onPress={startGame} size="$4">
                Play
              </Button>
            </View>
          )}

          <View style={[styles.timerContainer, { marginTop: -windowHeight * 0.05, position: "relative" }]}>
            <GameTimer
              size={windowWidth * 0.2}
              strokeWidth={25}
              time={getDifficultyConfig(currentScore).duration}
              color={greenA.greenA10}
              opacity={1}
              theta={theta}
              isRunning={isRunning}
            />
            {answerIsCorrect !== undefined && (
              <View style={{ position: "absolute" }}>
                <AnswerFeedback key={feedbackKey} isCorrect={answerIsCorrect} />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      <KeyPressAnimation onKeyPress={handleKeyPress}>
        <PianoKeys />
      </KeyPressAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  playButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    zIndex: 1000,
  },
  timerContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default StaffMasterGame;
