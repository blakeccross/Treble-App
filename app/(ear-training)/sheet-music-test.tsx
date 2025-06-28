import ExampleUsage from "@/components/sheet-music/example-usage";
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

// Sample music sequence demonstrating different note types and bars
export const sampleMusic: Array<NoteProps | BarProps> = [
  { type: "half", pitch: "e4" },

  { type: "quarter", pitch: "f4" },
  { type: "quarter", pitch: "f4" },

  { type: "single" },
  // { type: "quarter", pitch: "a5" },
  // { type: "half", pitch: "b5" },
  // { type: "quarter", pitch: "c5" },
  // { type: "double" },
  // { type: "quarter", pitch: "c5" },
  // { type: "half", pitch: "a5" },
  // { type: "quarter", pitch: "e5" },
  // { type: "single" },
  // { type: "quarter", pitch: "c5" },
  // { type: "quarter", pitch: "e5" },
  // { type: "quarter", pitch: "f5" },
  // { type: "quarter", pitch: "g4" },
  // { type: "single" },
  // { type: "half", pitch: "d5" },
  // { type: "half", pitch: "a5" },
  // { type: "single" },
  // { type: "whole", pitch: "d4" },
  // { type: "single" },
  // { isEnd: true },
];

export default function SheetMusicTest() {
  return <ExampleUsage />;
  // return (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <SheetMusic notes={sampleMusic} />
  //   </View>
  // );
}
