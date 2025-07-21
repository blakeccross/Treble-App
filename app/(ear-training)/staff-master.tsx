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
  BEGINNER: { minScore: 0, octaves: [4], accidentals: [""], duration: 10, notesPerMeasure: 1 },
  INTERMEDIATE: { minScore: 10, octaves: [4, 5], accidentals: [""], duration: 10, notesPerMeasure: 2 },
  ADVANCED: { minScore: 15, octaves: [4, 5], accidentals: [""], duration: 8, notesPerMeasure: 4 },
  ADVANCED2: { minScore: 20, octaves: [4, 5], accidentals: ["sharp"], duration: 8, notesPerMeasure: 4 },
  EXPERT: { minScore: 25, octaves: [3, 4, 5, 6], accidentals: ["", "sharp", "flat"], duration: 6, notesPerMeasure: 4 },
} as const;

interface NotesQueue {
  previous: NoteProps[];
  current: NoteProps[];
}

interface DifficultyConfig {
  octaves: readonly number[];
  accidentals: readonly string[];
  duration: number;
  notesPerMeasure: number; // Add notes per measure to difficulty config
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
    <View alignItems="center">
      <H1 fontWeight={600}>{currentScore}</H1>
      {/* {gameHasStarted && totalNotes > 0 && (
        <Paragraph fontSize="$3" color="$gray10">
          {playedNotes}/{totalNotes} notes
        </Paragraph>
      )} */}
    </View>
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [notesQueue, setNotesQueue] = useState<NotesQueue>({
    previous: [],
    current: [],
  });
  const [playedNoteCounts, setPlayedNoteCounts] = useState<Map<string, number>>(new Map());
  const [totalNotesInRound, setTotalNotesInRound] = useState(0);

  const correctAnswers = useRef<NoteProps[]>([]);
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
  const generateRandomNote = (octave: number): NoteProps => {
    const config = getDifficultyConfig(currentScore);
    const selectedNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    const selectedAccidental = config.accidentals[Math.floor(Math.random() * config.accidentals.length)];

    return {
      type: config.notesPerMeasure === 1 ? "whole" : config.notesPerMeasure === 2 ? "half" : "quarter",
      pitch: (selectedNote + octave) as Pitch,
      accidental: selectedAccidental === "" ? undefined : (selectedAccidental as "sharp" | "flat" | "natural"),
    };
  };

  const generateRandomOctave = (): number => {
    const config = getDifficultyConfig(currentScore);
    return config.octaves[Math.floor(Math.random() * config.octaves.length)];
  };

  const generateTwoMeasures = (): NoteProps[] => {
    const config = getDifficultyConfig(currentScore);
    const totalNotes = config.notesPerMeasure;
    const notes: NoteProps[] = [];
    const octave = generateRandomOctave();

    for (let i = 0; i < totalNotes; i++) {
      notes.push(generateRandomNote(octave));
    }

    return notes;
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
    setQuestionIndex(0);
    setNotesQueue({ previous: [], current: [] });
    setPlayedNoteCounts(new Map());
    setTotalNotesInRound(0);
    theta.value = 2 * Math.PI;
  };

  const handleStart = () => {
    const newNotes = generateTwoMeasures();
    correctAnswers.current = newNotes;
    setPlayedNoteCounts(new Map());
    setTotalNotesInRound(newNotes.length);

    const isEvenQuestion = questionIndex % 2 === 0;

    setNotesQueue((prev) => {
      if (isEvenQuestion) {
        // Even questions (0, 2, 4...): new notes go in slot 1 (previous)
        return {
          previous: newNotes,
          current: prev.current.length > 0 ? prev.current : [],
        };
      } else {
        // Odd questions (1, 3, 5...): new notes go in slot 2 (current)
        return {
          previous: prev.previous.length > 0 ? prev.previous : [],
          current: newNotes,
        };
      }
    });

    setQuestionIndex((prev) => prev + 1);
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

    const correctNotes = correctAnswers.current;
    if (!correctNotes || correctNotes.length === 0) return;

    const octave = correctNotes[0].pitch.slice(-1);
    const noteWithOctave = (note + String(Number(octave) - 1)) as PianoKey;
    playSong([{ note: noteWithOctave, time: 0, duration: NOTE_DURATION }]);

    // Check if this note matches any of the expected notes
    let foundMatch = false;
    let matchedNote: NoteProps | null = null;

    for (const correctNote of correctNotes) {
      const expectedNote = getExpectedNote(correctNote);
      if (note.toLowerCase() === expectedNote) {
        // Check if this note hasn't been played enough times yet
        const noteKey = `${correctNote.pitch}${correctNote.accidental || ""}`;
        const currentCount = playedNoteCounts.get(noteKey) || 0;
        const totalCount = correctNotes.filter((n) => {
          const nKey = `${n.pitch}${n.accidental || ""}`;
          return nKey === noteKey;
        }).length;

        if (currentCount < totalCount) {
          foundMatch = true;
          matchedNote = correctNote;
          break;
        }
      }
    }

    if (foundMatch && matchedNote) {
      // Mark this note as played
      const noteKey = `${matchedNote.pitch}${matchedNote.accidental || ""}`;
      setPlayedNoteCounts((prev) => {
        const newCounts = new Map(prev);
        const currentCount = newCounts.get(noteKey) || 0;
        newCounts.set(noteKey, currentCount + 1);

        // Check if round is complete immediately after updating
        const totalPlayed = Array.from(newCounts.values()).reduce((sum, count) => sum + count, 0);
        if (totalPlayed === totalNotesInRound) {
          // All notes have been played correctly
          setIsRunning(false); // Stop timer immediately
          handleCorrectAnswer();
          setFeedbackKey((prev) => prev + 1);

          // Start next round after delay
          setTimeout(async () => {
            await delay(1000);
            handleStart();
            setAnswerIsCorrect(undefined);
          }, 1000);
        }

        return newCounts;
      });
    } else {
      // Wrong note or already played note
      incorrectAnswer();
      setIsRunning(false);
      setFeedbackKey((prev) => prev + 1);

      setTimeout(async () => {
        await delay(1000);
        handleStart();
        setAnswerIsCorrect(undefined);
      }, 1000);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: top, paddingBottom: bottom }}>
      <StatusBar translucent={true} backgroundColor="transparent" />

      <GameHeader currentScore={currentScore} lives={lives} gameHasStarted={gameHasStarted} />

      <LinearGradient colors={["#f1f0f5", "#ffffff", "#e8e8e8"]} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <View style={styles.content}>
          <MusicalStaff
            key={`${key}-${questionIndex}`}
            scale={1.5}
            animateIn="right"
            notes1={notesQueue.previous}
            notes2={notesQueue.current}
            keySignature="C"
            centerLastLine={true}
            exitAnimation={false}
            showBarLines={false}
            questionIndex={questionIndex}
          />

          {/* {gameHasStarted && currentNotes.length > 0 && <NoteProgressIndicator currentNotes={currentNotes} playedNoteCounts={playedNoteCounts} />} */}

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
  progressContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  noteIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    minWidth: 32,
    alignItems: "center",
  },
});

export default StaffMasterGame;
