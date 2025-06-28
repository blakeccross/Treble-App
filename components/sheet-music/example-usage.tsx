import React from "react";
import { View, StyleSheet } from "react-native";
import MusicalStaff from "./sheet-music copy";

// Example usage of the MusicalStaff component
const ExampleUsage = () => {
  // Sample music data - just notes! Bar lines are automatically calculated for 4/4 time
  const sampleNotes = [
    // First measure (4 quarter notes)
    { type: "quarter" as const, pitch: "c5" as const },
    { type: "quarter" as const, pitch: "d5" as const },
    { type: "quarter" as const, pitch: "e5" as const },
    { type: "quarter" as const, pitch: "f5" as const },

    // Second measure (2 half notes)
    { type: "half" as const, pitch: "g5" as const },
    { type: "half" as const, pitch: "a5" as const },

    // Third measure (1 whole note)
    // { type: "whole" as const, isRest: true as const },
    // { type: "quarter" as const, isRest: true as const },

    // Fourth measure (4 quarter notes)
    { type: "quarter" as const, pitch: "a5" as const },
    { type: "quarter" as const, pitch: "g5" as const },
    { type: "quarter" as const, pitch: "f5" as const },
    { type: "quarter" as const, pitch: "e5" as const },

    // Fifth measure (2 half notes)
    // { type: "half" as const, isRest: true as const },
    // { type: "quarter" as const, pitch: "c5" as const },
    // { type: "half" as const, pitch: "c5" as const },
    // { type: "half" as const, pitch: "d5" as const },
  ];

  return (
    <View style={styles.container}>
      <MusicalStaff notes={sampleNotes} keySignature="C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ExampleUsage;
