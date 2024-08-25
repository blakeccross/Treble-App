import ReactNativeSVGContext from "./ReactNativeSVGContext";
import FontPack from "./NotoFontPack";
import { Vex } from "vexflow";

type useScoreProps = {
  contextSize: { x: number; y: number };
  staveOffset: { x: number; y: number };
  staveWidth: number;
  clef?: "treble" | "bass" | "alto" | "percussion" | "tenor";
  timeSig: string;
  colorScheme: "light" | "dark";
};

const useScore = ({
  contextSize = { x: 300, y: 300 },
  staveOffset = { x: 5, y: 5 },
  staveWidth = 500,
  clef,
  timeSig = "4/4",
  colorScheme,
}: useScoreProps) => {
  const context = new ReactNativeSVGContext(FontPack, {
    width: contextSize.x,
    height: contextSize.y,
    color: colorScheme === "light" ? "black" : "white",
  });

  const stave = new Vex.Flow.Stave(staveOffset.x, staveOffset.y, staveWidth);
  stave.setContext(context);
  clef && stave.setClef(clef);
  timeSig && stave.setTimeSignature(timeSig);
  stave.draw();

  return [context, stave];
};

export default useScore;
