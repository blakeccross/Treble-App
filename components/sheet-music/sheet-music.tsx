import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";

type NoteType = "whole" | "half" | "quarter";
type Pitch = "d4" | "e4" | "f4" | "g4" | "a5" | "b5" | "c5" | "d5" | "e5" | "f5" | "g5";

interface NoteProps {
  type: NoteType;
  pitch: Pitch;
}

interface BarProps {
  type?: "single" | "double";
  isEnd?: boolean;
}

interface MusicalStaffProps {
  notes: Array<NoteProps | BarProps>;
}

const MusicalStaff = ({ notes }: MusicalStaffProps) => {
  const StaffLines = () => (
    <View style={styles.staffLinesContainer}>
      {[0, 8, 16, 24, 32].map((top, index) => (
        <View key={index} style={[styles.staffLine, { top }]} />
      ))}
    </View>
  );

  const TrebleClef = () => (
    <View style={styles.trebleClefContainer}>
      <Text
        style={{
          fontFamily: "BravuraText",
          fontSize: 45,
          overflow: "visible",
          alignSelf: "center",
          textAlign: "center",
          paddingTop: 5,
          height: 70,
          width: 40,
        }}
      >
        &#119070;
      </Text>
    </View>
  );

  const Bar = ({ type = "single", isEnd = false }: BarProps) => (
    <View style={[styles.barContainer, { width: type === "double" || isEnd ? 4 : 2 }]}>
      <View style={styles.barLine} />
      {(type === "double" || isEnd) && <View style={[styles.barLine, { left: 0, width: isEnd ? 4 : 1 }]} />}
    </View>
  );

  const Note = ({ type, pitch }: NoteProps) => {
    const getNotePosition = (pitch: Pitch): number => {
      const positions: Record<Pitch, number> = {
        d4: 32,
        e4: 28,
        f4: 24,
        g4: 20,
        a5: 16,
        b5: 12,
        c5: 8,
        d5: 4,
        e5: 0,
        f5: -4,
        g5: -8,
      };
      return positions[pitch] - 32 || 0;
    };

    const getNoteHead = () => {
      if (type === "whole") {
        return <Text style={{ fontFamily: "BravuraText", fontSize: 45, height: 50, width: 100 }}>&#119133;</Text>;
      } else if (type === "half") {
        return <Text style={{ fontFamily: "BravuraText", fontSize: 45, height: 50, width: 100 }}>&#119134;</Text>;
      } else if (type === "quarter") {
        return <Text style={{ fontFamily: "BravuraText", fontSize: 45, height: 50, width: 100 }}>&#119135;</Text>;
      } else if (type === "single") {
        return <Text style={{ fontFamily: "BravuraText", fontSize: 45, height: 50, width: 100 }}>&#119040;</Text>;
      }
    };

    const noteTop = getNotePosition(pitch);
    const needsHighStem = ["d5", "e5", "f5", "g5"].includes(pitch);

    const headSpecificStyle = type === "whole" ? styles.wholeNote : type === "half" ? styles.halfNote : styles.quarterNote;

    return (
      <View style={[styles.noteContainer, { top: noteTop }]}>
        {getNoteHead()}
        {/* <View style={[styles.noteHead, headSpecificStyle]} />
        {(type === "half" || type === "quarter") && <View style={[styles.stem, { top: needsHighStem ? 4 : -24 }]} />} */}
      </View>
    );
  };

  const renderStaffElement = (element: NoteProps | BarProps, index: number) => {
    if ("pitch" in element) {
      return <Note key={index} {...element} />;
    } else {
      return <Bar key={index} {...element} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{
          // height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.staffContainer}>
          <StaffLines />
          <TrebleClef />
          <View style={styles.notesContainer}>{notes.map(renderStaffElement)}</View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  staffContainer: {
    marginTop: 50,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transform: [{ scale: 1.8 }],
  },
  staffLinesContainer: {
    position: "absolute",
    width: "100%",
    height: 80,
    top: "50%",
    transform: [{ translateY: -40 }],
  },
  staffLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#999",
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 40,
  },
  barContainer: {
    height: 32,
    marginHorizontal: 12,
    marginBottom: 48,
    // top: 32,
  },
  barLine: {
    position: "absolute",
    width: 1,
    height: 32,
    backgroundColor: "black",
    right: 0,
  },
  noteContainer: {
    width: 12,
    height: 32,
    marginHorizontal: 12,
    marginBottom: 48,
  },
  noteHead: {
    height: 8,
    width: 12,
  },
  wholeNote: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
  halfNote: {
    borderWidth: 1,
    borderTopWidth: 2.18,
    borderBottomWidth: 2.18,
    borderRadius: 50,
    transform: [{ rotate: "-15deg" }],
    backgroundColor: "transparent",
  },
  quarterNote: {
    backgroundColor: "black",
    borderRadius: 50,
    transform: [{ rotate: "-15deg" }],
  },
  stem: {
    position: "absolute",
    width: 1,
    height: 28,
    backgroundColor: "black",
    right: 0,
  },
  trebleClefContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    // top: "50%",
    // transform: [{ translateY: -50 }],
    width: 40,
    height: 70,
    // marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  trebleClef: {
    position: "absolute",
    width: 40,
    height: 80,
  },
  trebleClefCircle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    top: 20,
    left: 10,
  },
  trebleClefStem: {
    position: "absolute",
    width: 2,
    height: 60,
    backgroundColor: "black",
    top: 10,
    left: 20,
  },
  trebleClefTail: {
    position: "absolute",
    width: 20,
    height: 2,
    backgroundColor: "black",
    top: 30,
    left: 10,
    transform: [{ rotate: "45deg" }],
  },
});

export default MusicalStaff;
