import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { H5, Button } from "tamagui";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MusicalStaff from "./sheet-music copy";
import PianoKeys from "./PianoKeys";

// Example usage of the MusicalStaff component
const ExampleUsage = () => {
  const inset = useSafeAreaInsets();
  const [exitAnimation, setExitAnimation] = useState(false);
  const [key, setKey] = useState(0); // Key to force re-render

  // Sample music data - just notes! Bar lines are automatically calculated for 4/4 time
  const sampleNotes = [
    // First measure (4 quarter notes)
    { type: "quarter" as const, pitch: "a3" as const },
    { type: "quarter" as const, pitch: "b3" as const },
    { type: "quarter" as const, pitch: "e5" as const },
    { type: "quarter" as const, pitch: "f5" as const },

    // Second measure (2 half notes)
    // { type: "half" as const, pitch: "g5" as const },
    // { type: "half" as const, pitch: "a5" as const },

    // Third measure (1 whole note)
    // { type: "whole" as const, isRest: true as const },
    // { type: "quarter" as const, isRest: true as const },

    // Fourth measure (4 quarter notes)
    // { type: "quarter" as const, pitch: "a5" as const },
    // { type: "quarter" as const, pitch: "g5" as const },
    // { type: "quarter" as const, pitch: "f5" as const },
    // { type: "quarter" as const, pitch: "e5" as const },

    // Fifth measure (2 half notes)
    // { type: "half" as const, isRest: true as const },
    // { type: "quarter" as const, pitch: "c5" as const },
    // { type: "half" as const, pitch: "c5" as const },
    // { type: "half" as const, pitch: "d5" as const },
  ];

  const handleExitAnimation = () => {
    setExitAnimation(true);
  };

  const handleReset = () => {
    setExitAnimation(false);
    setKey((prev) => prev + 1); // Force re-render
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: inset.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size="$2" />
          </TouchableOpacity>
          <H5 fontWeight={600} style={styles.title}>
            Sheet Music Example
          </H5>
          <View style={styles.spacer} />
        </View>
      </View>

      {/* Control buttons */}
      <View style={styles.controls}>
        <Button onPress={handleExitAnimation} disabled={exitAnimation} style={styles.button}>
          Trigger Exit Animation
        </Button>
        <Button onPress={handleReset} variant="outlined" style={styles.button}>
          Reset
        </Button>
      </View>

      {/* Musical staff content */}
      <View style={styles.content}>
        <MusicalStaff
          key={key}
          scale={1.5}
          animateIn="right"
          notes={sampleNotes}
          keySignature="C"
          centerLastLine={true}
          exitAnimation={exitAnimation}
          showBarLines={false}
        />
      </View>
      <PianoKeys />
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#1d1d1d" }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default ExampleUsage;
