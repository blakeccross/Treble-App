import SheetMusic from "@/components/sheet-music/sheet-music";
import { View } from "react-native";

// Sample MIDI data structure for testing
const sampleMidiData = {
  tracks: [
    {
      notes: [
        { midi: 60, time: 0, duration: 480 }, // Middle C, quarter note
        { midi: 62, time: 480, duration: 480 }, // D, quarter note
        { midi: 64, time: 960, duration: 480 }, // E, quarter note
        { midi: 65, time: 1440, duration: 480 }, // F, quarter note
        { midi: 67, time: 1920, duration: 960 }, // G, half note
        { midi: 69, time: 2880, duration: 480 }, // A, quarter note
        { midi: 71, time: 3360, duration: 480 }, // B, quarter note
        { midi: 72, time: 3840, duration: 960 }, // High C, half note
      ],
    },
  ],
};

export default function SheetMusicTest() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SheetMusic midiData={sampleMidiData} />
    </View>
  );
}
