// import { useScore } from "react-native-vexflow"; // import the one and only thing provided
import useScore from "@/components/vexflow/useScore";
import React from "react";
import { Appearance, View, useColorScheme } from "react-native";
import { useTheme } from "tamagui";
import { Vex } from "vexflow";

export default function SheetMusic({
  data,
  maxWidth,
  clef,
  timeSig,
}: {
  data: { clef: string; keys: string[]; duration: string }[];
  maxWidth: number;
  clef?: "treble" | "bass" | "alto" | "percussion" | "";
  timeSig: string;
}) {
  const colorScheme = useColorScheme() || "light";
  const width_ = data.length * 100;
  const [context, stave] = useScore({
    contextSize: { x: width_ + 2, y: 100 }, // this determine the canvas size
    staveOffset: { x: 0, y: 0 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: width_, // ofc, stave width
    clef: clef, // clef
    timeSig: timeSig, // time signiture
    colorScheme: colorScheme,
  }) as any;
  // you got your context, you got your stave, you can do your stuff now
  // picked from Vexflow tutorial: https://github.com/0xfe/vexflow/wiki/The-VexFlow-Tutorial
  const VF = Vex.Flow;

  var notes = data.map((item) => new VF.StaveNote({ ...item }));
  // Create a voice in 4/4 and add the notes from above
  var voice = new VF.Voice({ num_beats: data.length, beat_value: 4 });
  voice.addTickables(notes);
  // Format and justify the notes to 400 pixels.
  new VF.Formatter().joinVoices([voice]).format([voice], width_ - 100);
  // Render voice
  voice.draw(context, stave);

  return <View>{context.render()}</View>;
}
