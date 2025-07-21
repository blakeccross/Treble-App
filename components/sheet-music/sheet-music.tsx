import React, { useMemo, useEffect, useRef, useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Svg, { Line, Text as SvgText, G, TextAnchor } from "react-native-svg";
import Animated, { useAnimatedProps, useSharedValue, withTiming, withDelay, Easing, runOnJS } from "react-native-reanimated";

/**
 * MusicalStaff Component
 *
 * Usage with exit animations:
 *
 * // First render with initial notes
 * <MusicalStaff notes={initialNotes} />
 *
 * // When you want to transition to new notes, pass both:
 * <MusicalStaff
 *   notes={newNotes}
 *   previousNotes={initialNotes}
 * />
 *
 * The previousNotes will animate out while newNotes animate in.
 */

type NoteType = "whole" | "half" | "quarter";
export type Pitch =
  | "a3"
  | "b3"
  | "c4"
  | "d4"
  | "e4"
  | "f4"
  | "g4"
  | "a4"
  | "b4"
  | "a5"
  | "b5"
  | "c5"
  | "d5"
  | "e5"
  | "f5"
  | "g5"
  | "a6"
  | "b6"
  | "c6"
  | "d6"
  | "e6"
  | "f6"
  | "g6";

export type NoteProps = {
  type: NoteType;
  pitch: Pitch;
  accidental?: "sharp" | "flat" | "natural";
};

interface RestProps {
  type: NoteType; // duration
  isRest: true;
}

interface BarProps {
  type?: "single" | "double";
  isEnd?: boolean;
}

interface MusicalStaffProps {
  notes1?: Array<NoteProps | RestProps>;
  notes2?: Array<NoteProps | RestProps>;
  containerWidth?: number;
  containerHeight?: number;
  keySignature?: "C" | "G" | "D" | "A" | "E" | "B" | "F#" | "C#" | "F" | "Bb" | "Eb" | "Ab" | "Db" | "Gb" | "Cb";
  scale?: number;
  centerLastLine?: boolean;
  exitAnimation?: boolean;
  showBarLines?: boolean;
  animateIn?: "bottom" | "none" | "right";
  questionIndex?: number;
  onUnmountComplete?: () => void;
}

// Animated Note Component
const AnimatedNote = ({
  children,
  x,
  y,
  fontSize,
  fontFamily,
  fill,
  textAnchor,
  transform,
  delay = 0,
  exitAnimation = false,
  isFlipped = false,
  animateIn = "none",
  onExitComplete,
  isUnmounting = false,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAnchor: TextAnchor;
  transform?: string;
  delay?: number;
  exitAnimation?: boolean;
  isFlipped?: boolean;
  animateIn?: "bottom" | "none" | "right";
  onExitComplete?: () => void;
  isUnmounting?: boolean;
}) => {
  // Initialize with final position to prevent flashing
  const animatedX = useSharedValue(x);
  const animatedY = useSharedValue(y);
  const animatedOpacity = useSharedValue(exitAnimation ? 1 : animateIn === "none" ? 1 : 0);

  useEffect(() => {
    if (isUnmounting) {
      // For unmount animation, start at current position and animate out
      animatedX.value = x;
      animatedY.value = y;
      animatedOpacity.value = 1;

      // Start exit animation with a small delay
      animatedX.value = withDelay(100, withTiming(isFlipped ? x + 200 : x - 200, { duration: 1000, easing: Easing.out(Easing.quad) }));
      animatedOpacity.value = withDelay(
        100,
        withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }, (finished) => {
          if (finished && onExitComplete) {
            runOnJS(onExitComplete)();
          }
        })
      );
    } else if (animateIn !== "none" && !exitAnimation) {
      animatedX.value = animateIn === "right" ? (isFlipped ? x - 200 : x + 200) : x;
      animatedY.value = animateIn === "bottom" ? (isFlipped ? y - 20 : y + 20) : y;
      animatedOpacity.value = 0;

      // Animate to final position
      animatedX.value = withDelay(delay, withTiming(x, { duration: 600, easing: Easing.out(Easing.quad) }));
      animatedY.value = withDelay(delay, withTiming(y, { duration: 600, easing: Easing.out(Easing.quad) }));
      animatedOpacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }));
    }
  }, [exitAnimation, animateIn, isUnmounting]);

  // Animated props for the SVG text
  const animatedProps = useAnimatedProps(() => {
    return {
      x: animatedX.value,
      y: animatedY.value,
      opacity: animatedOpacity.value,
    };
  });

  const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

  return (
    <AnimatedSvgText
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fill}
      textAnchor={textAnchor}
      transform={transform}
      animatedProps={animatedProps}
    >
      {children}
    </AnimatedSvgText>
  );
};

const MusicalStaff = ({
  notes1,
  notes2,
  containerWidth: propContainerWidth,
  containerHeight: propContainerHeight,
  keySignature,
  scale = 1,
  centerLastLine = false,
  showBarLines = true,
  animateIn = "right",
  questionIndex = 0,
  onUnmountComplete,
}: MusicalStaffProps) => {
  const [visibleNotes1, setVisibleNotes1] = useState(false);
  const [visibleNotes2, setVisibleNotes2] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);
  const exitCompleteCount = useRef(0);
  const totalNotes = useRef(0);

  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = propContainerWidth || windowWidth;

  // Handle component unmounting
  useEffect(() => {
    return () => {
      // Component is unmounting, trigger exit animations
      setIsUnmounting(true);
    };
  }, []);

  // Track when all exit animations are complete
  const handleExitComplete = () => {
    exitCompleteCount.current += 1;
    if (exitCompleteCount.current >= totalNotes.current && isUnmounting) {
      onUnmountComplete?.();
    }
  };

  // Constants for layout
  const STAFF_HEIGHT = 100 * scale;
  const STAFF_LINE_SPACING = 12 * scale;
  const NOTE_SPACING = 40 * scale;
  const BAR_WIDTH = 6 * scale;
  const TREBLE_CLEF_WIDTH = 40 * scale;
  const MARGIN = 10;
  const MIN_MEASURE_WIDTH = 75 * scale;
  const STAFF_LINES_COUNT = 5; // 5 lines in a staff
  const MIN_NOTE_TO_BAR_SPACING = 10 * scale; // Minimum space between notes and bar lines
  const CLEF_SPACING = 10 * scale;

  // Vertical padding to accommodate notes above and below the staff
  const VERTICAL_PADDING = 50 * scale; // Space above and below staff for ledger lines and notes

  // Convert note type to beats (assuming 4/4 time)
  const getNoteBeats = (type: NoteType): number => {
    switch (type) {
      case "whole":
        return 4;
      case "half":
        return 2;
      case "quarter":
        return 1;
      default:
        return 1;
    }
  };

  // Automatically insert bar lines based on 4/4 time signature
  const addBarLines = (elements: Array<NoteProps | RestProps>): Array<NoteProps | RestProps | BarProps> => {
    const result: Array<NoteProps | RestProps | BarProps> = [];
    let currentBeats = 0;
    const beatsPerMeasure = 4; // 4/4 time

    // If no elements, create an empty measure
    if (elements.length === 0) {
      result.push({ type: "single", isEnd: true });
      return result;
    }

    elements.forEach((el) => {
      const elBeats = getNoteBeats(el.type);

      // Check if adding this note would exceed the measure
      if (currentBeats + elBeats > beatsPerMeasure) {
        // Add a bar line before this note
        result.push({ type: "single" });
        currentBeats = 0;
      }

      // Add the note
      result.push(el);
      currentBeats += elBeats;

      // Check if we've completed a measure
      if (currentBeats === beatsPerMeasure) {
        result.push({ type: "single" });
        currentBeats = 0;
      }
    });

    // Add final bar line if needed
    if (currentBeats > 0) {
      result.push({ type: "single", isEnd: true });
    }

    return result;
  };

  // Helper function to calculate staff lines from notes
  const calculateStaffLines = (noteArray: Array<NoteProps | RestProps>) => {
    // 1) Insert bar-lines based on the time-signature
    const elementsWithBars = addBarLines(noteArray);

    // 2) Convert the flat sequence into Measure objects – a measure **always** ends with a bar-line
    interface InternalMeasure {
      elements: Array<NoteProps | RestProps | BarProps>;
      contentWidth: number; // width taken up by notes + the trailing bar
      width: number; // final width after enforcing minimums / padding
    }

    const builtMeasures: InternalMeasure[] = [];
    let currentElements: Array<NoteProps | RestProps | BarProps> = [];

    const pushCurrentMeasure = () => {
      if (currentElements.length === 0) return;

      // Raw width (notes + bar)
      let rawWidth = 0;
      currentElements.forEach((el) => {
        if (("pitch" in el && !("isRest" in el)) || "isRest" in el) {
          rawWidth += NOTE_SPACING;
        } else {
          rawWidth += BAR_WIDTH;
        }
      });

      // We want at least MIN_NOTE_TO_BAR_SPACING on **both** sides of the notes
      const minRequiredWidth = rawWidth + MIN_NOTE_TO_BAR_SPACING * 2;
      const finalWidth = Math.max(minRequiredWidth, MIN_MEASURE_WIDTH);

      builtMeasures.push({
        elements: currentElements,
        contentWidth: rawWidth,
        width: finalWidth,
      });
      currentElements = [];
    };

    elementsWithBars.forEach((el) => {
      currentElements.push(el);
      if (!("pitch" in el)) {
        // We reached a bar – complete the measure
        pushCurrentMeasure();
      }
    });
    // Safety – in case the last measure ended without a bar (shouldn't happen)
    pushCurrentMeasure();

    // If no measures were created (empty notes array), create one empty measure
    if (builtMeasures.length === 0) {
      builtMeasures.push({
        elements: [{ type: "single", isEnd: true }],
        contentWidth: BAR_WIDTH,
        width: MIN_MEASURE_WIDTH,
      });
    }

    // 3) Group measures into staff lines that fit within the available width
    const availableWidth = containerWidth - MARGIN * 2;
    const staffLines: Array<{
      measures: InternalMeasure[];
      contentWidth: number; // total of measure.width for this line (excluding clef)
    }> = [];

    let currentLineMeasures: InternalMeasure[] = [];
    let currentLineWidth = TREBLE_CLEF_WIDTH + CLEF_SPACING; // every line starts with a clef + extra spacing

    // Add key signature width if present
    if (keySignature && keySignature !== "C") {
      const accidentals = getKeySignatureAccidentals(keySignature);
      currentLineWidth += accidentals.length * 25 + 10; // 25px per accidental + 10px padding
    }

    builtMeasures.forEach((measure) => {
      if (currentLineMeasures.length > 0 && currentLineWidth + measure.width > availableWidth) {
        // Commit current line and start a new one
        staffLines.push({
          measures: currentLineMeasures,
          contentWidth: currentLineWidth,
        });
        currentLineMeasures = [measure];
        currentLineWidth = TREBLE_CLEF_WIDTH + CLEF_SPACING + measure.width;

        // Add key signature width for new line
        if (keySignature && keySignature !== "C") {
          const accidentals = getKeySignatureAccidentals(keySignature);
          currentLineWidth += accidentals.length * 25 + 10;
        }
      } else {
        currentLineMeasures.push(measure);
        currentLineWidth += measure.width;
      }
    });
    // Push the final line
    if (currentLineMeasures.length > 0) {
      staffLines.push({
        measures: currentLineMeasures,
        contentWidth: currentLineWidth,
      });
    }

    // 4) Stretch every line except the last to occupy the full available width
    staffLines.forEach((line, idx) => {
      if (idx === staffLines.length - 1) return; // last line stays natural width
      const extraSpace = availableWidth - line.contentWidth;
      if (extraSpace > 0 && line.measures.length > 0) {
        const lastMeasure = line.measures[line.measures.length - 1];
        lastMeasure.width += extraSpace; // pad the final measure
        // Update the stored line width so subsequent rendering knows the new length
        line.contentWidth = availableWidth;
      }
    });

    // 5) Center the last line if centerLastLine is true
    if (centerLastLine && staffLines.length > 0) {
      const lastLine = staffLines[staffLines.length - 1];
      const extraSpace = availableWidth - lastLine.contentWidth;
      if (extraSpace > 0) {
        // Add padding to the first measure to center the content
        if (lastLine.measures.length > 0) {
          const firstMeasure = lastLine.measures[0];
          firstMeasure.width += extraSpace / 2; // Add half the extra space to the first measure
          lastLine.contentWidth = availableWidth;
        }
      }
    }

    return staffLines;
  };

  // Calculate measure widths and split into staff lines (so we can position notes **inside** each measure)
  const lines = useMemo(() => {
    return calculateStaffLines(notes1 || []);
  }, [notes1, containerWidth, centerLastLine, keySignature]);

  // Calculate lines for notes2 (current notes)
  const lines2 = useMemo(() => {
    return calculateStaffLines(notes2 || []);
  }, [notes2, containerWidth, centerLastLine, keySignature]);

  // Determine which notes to animate based on question index
  const isEvenQuestion = questionIndex % 2 === 0;

  const exitLines = lines2;
  const enterLines = lines;

  // Reset visibility when notes change
  useEffect(() => {
    const isEvenQuestion = questionIndex % 2 === 0;
    setVisibleNotes2(!isEvenQuestion);
    setVisibleNotes1(isEvenQuestion);
  }, [questionIndex]);

  // Get note position on staff (0 = middle line, positive = up, negative = down)
  const getNotePosition = (pitch: Pitch): number => {
    const positions: Record<Pitch, number> = {
      a3: 9, // Below staff (ledger line)
      b3: 8, // Below staff (ledger line)
      c4: 7, // Below staff (ledger line)
      d4: 6, // Below staff (ledger line)
      e4: 5, // Below staff
      f4: 4, // First space
      g4: 3, // First line
      a4: 2, // First line
      b4: 1, // First line
      c5: 0, // Third line (middle)
      d5: -1, // Fourth space
      e5: -2, // Fourth line
      f5: -3, // Fifth space
      g5: -4, // Above staff
      a5: -5, // Above staff (ledger line)
      b5: -6, // Above staff (ledger line)
      a6: -7, // Above staff (ledger line)
      b6: -8, // Above staff (ledger line)
      c6: -9, // Above staff (ledger line)
      d6: -10, // Above staff (ledger line)
      e6: -11, // Above staff (ledger line)
      f6: -12, // Above staff (ledger line)
      g6: -13, // Above staff (ledger line)
    };
    return positions[pitch] || 0;
  };

  // Get note type-specific Y position adjustment
  const getNoteTypeAdjustment = (type: NoteType, isFlipped: boolean): number => {
    switch (type) {
      case "whole":
        return -6 * scale;
      case "half":
        return -6 * scale; // Adjust half note position
      case "quarter":
        return isFlipped ? -12 * scale : 0;
      default:
        return 0;
    }
  };

  // Get note Unicode character
  const getNoteGlyph = (element: NoteProps | RestProps): string => {
    const { type } = element;
    // Rest?
    if ("isRest" in element && element.isRest) {
      switch (type) {
        case "whole":
          return "𝄻"; // whole rest
        case "half":
          return "𝄼"; // half rest
        case "quarter":
          return "𝄽"; // quarter rest
        default:
          return "𝄽";
      }
    }
    // Normal note glyphs - determine stem direction based on position
    if ("pitch" in element) {
      switch (type) {
        case "whole":
          return "𝅝"; // whole notes don't have stems
        case "half":
          return "𝅗𝅥"; // Half notes with stem up vs down
        case "quarter":
          return "♩"; // Quarter notes with stem up vs down
        default:
          return "♩";
      }
    }

    // Fallback
    switch (type) {
      case "whole":
        return "𝅝";
      case "half":
        return "𝅗𝅥";
      case "quarter":
        return "♩";
      default:
        return "♩";
    }
  };

  // Get accidental Unicode character
  const getAccidentalGlyph = (accidental: "sharp" | "flat" | "natural"): string => {
    switch (accidental) {
      case "sharp":
        return "♯";
      case "flat":
        return "♭";
      case "natural":
        return "♮";
      default:
        return "";
    }
  };

  // Get key signature accidentals
  const getKeySignatureAccidentals = (keySignature: string): Array<{ pitch: Pitch; accidental: "sharp" | "flat" }> => {
    const keySignatures: Record<string, Array<{ pitch: Pitch; accidental: "sharp" | "flat" }>> = {
      // Sharp keys (order: F♯, C♯, G♯, D♯, A♯, E♯, B♯)
      G: [{ pitch: "f5", accidental: "sharp" }],
      D: [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
      ],
      A: [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
        { pitch: "g5", accidental: "sharp" },
      ],
      E: [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
        { pitch: "g5", accidental: "sharp" },
        { pitch: "d5", accidental: "sharp" },
      ],
      B: [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
        { pitch: "g5", accidental: "sharp" },
        { pitch: "d5", accidental: "sharp" },
        { pitch: "a5", accidental: "sharp" },
      ],
      "F#": [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
        { pitch: "g5", accidental: "sharp" },
        { pitch: "d5", accidental: "sharp" },
        { pitch: "a5", accidental: "sharp" },
        { pitch: "e5", accidental: "sharp" },
      ],
      "C#": [
        { pitch: "f5", accidental: "sharp" },
        { pitch: "c5", accidental: "sharp" },
        { pitch: "g5", accidental: "sharp" },
        { pitch: "d5", accidental: "sharp" },
        { pitch: "a5", accidental: "sharp" },
        { pitch: "e5", accidental: "sharp" },
        { pitch: "b5", accidental: "sharp" },
      ],

      // Flat keys (order: B♭, E♭, A♭, D♭, G♭, C♭, F♭)
      F: [{ pitch: "b5", accidental: "flat" }],
      Bb: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
      ],
      Eb: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
        { pitch: "a5", accidental: "flat" },
      ],
      Ab: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
        { pitch: "a5", accidental: "flat" },
        { pitch: "d5", accidental: "flat" },
      ],
      Db: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
        { pitch: "a5", accidental: "flat" },
        { pitch: "d5", accidental: "flat" },
        { pitch: "g4", accidental: "flat" },
      ],
      Gb: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
        { pitch: "a5", accidental: "flat" },
        { pitch: "d5", accidental: "flat" },
        { pitch: "g4", accidental: "flat" },
        { pitch: "c5", accidental: "flat" },
      ],
      Cb: [
        { pitch: "b5", accidental: "flat" },
        { pitch: "e5", accidental: "flat" },
        { pitch: "a5", accidental: "flat" },
        { pitch: "d5", accidental: "flat" },
        { pitch: "g4", accidental: "flat" },
        { pitch: "c5", accidental: "flat" },
        { pitch: "f4", accidental: "flat" },
      ],
    };

    return keySignatures[keySignature] || [];
  };

  // Get rest position on staff
  const getRestPosition = (type: NoteType): number => {
    switch (type) {
      case "whole":
        return -2; // 4th line (counting from bottom, 0-indexed)
      case "half":
        return -1.25; // 3rd line (counting from bottom, 0-indexed)
      case "quarter":
        return 0; // center line (middle)
      default:
        return 0;
    }
  };

  // Render ledger lines for notes below and above the staff
  const renderLedgerLines = (
    pitch: Pitch,
    noteX: number,
    staffTop: number,
    staffBottom: number,
    lineSpacing: number,
    scale: number
  ): React.ReactNode[] => {
    const ledgerLines: React.ReactNode[] = [];

    // Get the note position (positive values are below the staff, negative are above)
    const notePosition = getNotePosition(pitch);

    // Render ledger lines for notes below the staff (position >= 7)
    if (notePosition >= 7) {
      // Calculate how many ledger lines we need
      const ledgerLineCount = notePosition === 9 ? 2 : 1;

      // Render each ledger line
      for (let i = 0; i < ledgerLineCount; i++) {
        const ledgerY = staffBottom + (i + 1) * lineSpacing;

        // Make ledger lines shorter than staff lines
        const ledgerLineLength = 20 * scale;
        const ledgerX1 = noteX - ledgerLineLength / 2;
        const ledgerX2 = noteX + ledgerLineLength / 2;

        ledgerLines.push(
          <Line key={`ledger-below-${pitch}-${i}`} x1={ledgerX1} y1={ledgerY} x2={ledgerX2} y2={ledgerY} stroke="#000" strokeWidth={1} />
        );
      }
    }

    // Render ledger lines for notes above the staff (position <= -5)
    if (notePosition <= -5) {
      // Calculate how many ledger lines we need
      // -5 needs 1 line, -6 needs 1 line, -7 needs 2 lines, -8 needs 2 lines, etc.
      const ledgerLineCount = Math.ceil((Math.abs(notePosition) - 4) / 2);

      // Render each ledger line
      for (let i = 0; i < ledgerLineCount; i++) {
        const ledgerY = staffTop - (i + 1) * lineSpacing;

        // Make ledger lines shorter than staff lines
        const ledgerLineLength = 20 * scale;
        const ledgerX1 = noteX - ledgerLineLength / 2;
        const ledgerX2 = noteX + ledgerLineLength / 2;

        ledgerLines.push(
          <Line key={`ledger-above-${pitch}-${i}`} x1={ledgerX1} y1={ledgerY} x2={ledgerX2} y2={ledgerY} stroke="#000" strokeWidth={1} />
        );
      }
    }

    return ledgerLines;
  };

  // Calculate total height needed (now based on the new `lines` array)
  const maxLines = lines.length;
  const calculatedHeight = maxLines * (STAFF_HEIGHT + MARGIN) + MARGIN + VERTICAL_PADDING * 2;
  const totalHeight = propContainerHeight ? Math.max(propContainerHeight, calculatedHeight) : calculatedHeight;

  // Helper function to render notes from a staff line
  const renderNotesFromLine = (line: any, lineIndex: number): React.ReactNode[] => {
    const handleExitComplete = () => {
      if (isEvenQuestion) {
        setVisibleNotes1(false);
      } else {
        setVisibleNotes2(false);
      }
    };
    const yOffset = lineIndex * (STAFF_HEIGHT + MARGIN) + MARGIN + VERTICAL_PADDING;
    const xOffset = MARGIN;
    const staffTop = yOffset;
    const staffBottom = yOffset + (STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING;

    const rendered: React.ReactNode[] = [];

    let currentMeasureStartX = xOffset + TREBLE_CLEF_WIDTH + CLEF_SPACING;

    // Add key signature width to measure starting position
    if (keySignature && keySignature !== "C") {
      const accidentals = getKeySignatureAccidentals(keySignature);
      currentMeasureStartX += accidentals.length * 15; // 15px per accidental
    }

    line.measures.forEach((measure: any, mIdx: number) => {
      const measureInnerStart = currentMeasureStartX;
      const contentStartX = measureInnerStart + (measure.width - measure.contentWidth) / 2;

      // Walk through elements inside this measure
      let localCursor = contentStartX;

      measure.elements.forEach((el: any, elIdx: number) => {
        if ("pitch" in el && !("isRest" in el)) {
          // Determine if note should be flipped (stem down for notes at or above middle line)
          const notePosition = getNotePosition(el.pitch);
          //const middleLinePosition = getNotePosition("b5"); // B5 is the middle line
          const middleLinePosition = 1;
          const shouldFlip = notePosition <= middleLinePosition && el.type !== "whole";
          // NOTE
          const noteY =
            yOffset +
            ((STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING) / 2 +
            (getNotePosition(el.pitch) * STAFF_LINE_SPACING) / 2 +
            getNoteTypeAdjustment(el.type, shouldFlip);

          const noteX = localCursor + NOTE_SPACING / 2;

          // Render ledger lines for notes below the staff
          const ledgerLines = renderLedgerLines(el.pitch, noteX, staffTop, staffBottom, STAFF_LINE_SPACING, scale);

          rendered.push(
            <AnimatedNote
              key={`q${questionIndex}-l${lineIndex}-m${mIdx}-n${elIdx}`}
              x={noteX}
              y={noteY}
              fontSize={70 * scale}
              fontFamily="BravuraText"
              fill="#000"
              textAnchor="middle"
              transform={shouldFlip ? `rotate(180, ${noteX}, ${noteY})` : undefined}
              delay={mIdx * 100}
              exitAnimation={false}
              isFlipped={shouldFlip}
              animateIn={animateIn}
              onExitComplete={handleExitComplete}
            >
              {getNoteGlyph(el)}
            </AnimatedNote>
          );

          // Add ledger lines to the rendered elements
          ledgerLines.forEach((ledgerLine, idx) => {
            rendered.push(<React.Fragment key={`l${lineIndex}-m${mIdx}-n${elIdx}-ledger-${idx}`}>{ledgerLine}</React.Fragment>);
          });

          // Render accidental if present
          if (el.accidental) {
            const accidentalX = noteX - 20; // Position accidental to the left of the note
            rendered.push(
              <AnimatedNote
                key={`q${questionIndex}-l${lineIndex}-m${mIdx}-n${elIdx}-acc`}
                x={accidentalX}
                y={noteY}
                fontSize={35 * scale}
                fontFamily="BravuraText"
                fill="#000"
                textAnchor="middle"
                delay={elIdx * 100}
                exitAnimation={false}
                isFlipped={shouldFlip}
                animateIn={animateIn}
                onExitComplete={handleExitComplete}
              >
                {getAccidentalGlyph(el.accidental)}
              </AnimatedNote>
            );
          }

          localCursor += NOTE_SPACING;
        } else if ("isRest" in el) {
          // REST – positioned according to rest type
          const restPosition = getRestPosition(el.type);
          const restY = yOffset + ((STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING) / 2 + (restPosition * STAFF_LINE_SPACING) / 2;

          const restX = localCursor + NOTE_SPACING / 2;

          rendered.push(
            <AnimatedNote
              key={`q${questionIndex}-l${lineIndex}-m${mIdx}-r${elIdx}`}
              x={restX}
              y={restY}
              fontSize={70 * scale}
              fontFamily="BravuraText"
              fill="#000"
              textAnchor="middle"
              delay={mIdx * 100}
              exitAnimation={false}
              animateIn={animateIn}
              onExitComplete={handleExitComplete}
            >
              {getNoteGlyph(el)}
            </AnimatedNote>
          );

          localCursor += NOTE_SPACING;
        } else {
          // BAR LINE (this will always be the last element of a measure)
          const isLastBarLine = elIdx === measure.elements.length - 1;
          let barX: number;
          if (isLastBarLine) {
            // Align the final bar with the end of the measure
            barX = measureInnerStart + measure.width - BAR_WIDTH / 2;
          } else {
            // (Extremely rare) intermediate bar – position with current cursor
            barX = localCursor + BAR_WIDTH / 2;
          }
          if (showBarLines) {
            rendered.push(
              <Line
                key={`q${questionIndex}-l${lineIndex}-m${mIdx}-b${elIdx}`}
                x1={barX}
                y1={staffTop}
                x2={barX}
                y2={staffBottom}
                stroke="#000"
                strokeWidth={el.type === "double" || el.isEnd ? 3 : 2}
              />
            );
          }
          if (!isLastBarLine) {
            localCursor += BAR_WIDTH;
          }
        }
      });

      // Advance to the start of next measure
      currentMeasureStartX += measure.width;
    });

    return rendered;
  };

  return (
    <View>
      <Svg width={containerWidth} height={totalHeight} viewBox={`0 0 ${containerWidth} ${totalHeight}`}>
        {/* Render staff lines and static elements */}
        {Array.from({ length: maxLines }, (_, lineIndex) => {
          const yOffset = lineIndex * (STAFF_HEIGHT + MARGIN) + MARGIN + VERTICAL_PADDING;
          const xOffset = MARGIN;

          // Use current line for staff width, fallback to previous line if current doesn't exist
          const currentLine = lines[lineIndex];
          const lineForWidth = currentLine;
          const staffLineEndX = xOffset + (lineForWidth?.contentWidth || 0);

          return (
            <G key={`staff-${lineIndex}`}>
              {/* Staff Lines */}
              {[0, 1, 2, 3, 4].map((lineIdx) => (
                <Line
                  key={lineIdx}
                  x1={xOffset}
                  y1={yOffset + lineIdx * STAFF_LINE_SPACING}
                  x2={staffLineEndX}
                  y2={yOffset + lineIdx * STAFF_LINE_SPACING}
                  stroke="#000"
                  strokeWidth={1}
                />
              ))}

              {/* Treble Clef */}
              <SvgText
                x={xOffset}
                y={yOffset + (STAFF_LINES_COUNT - 2) * STAFF_LINE_SPACING}
                fontSize={60 * scale}
                fontFamily="BravuraText"
                fill="#000"
                textAnchor="start"
              >
                𝄞
              </SvgText>

              {/* Key Signature */}
              {keySignature &&
                keySignature !== "C" &&
                (() => {
                  const accidentals = getKeySignatureAccidentals(keySignature);
                  const keySignatureStartX = xOffset + TREBLE_CLEF_WIDTH + 15; // Position after clef

                  return accidentals.map((acc, idx) => {
                    const accidentalY =
                      yOffset + (STAFF_LINES_COUNT * STAFF_LINE_SPACING) / 2 + (getNotePosition(acc.pitch) * STAFF_LINE_SPACING) / 2;
                    const accidentalX = keySignatureStartX + idx * 15; // Increase spacing between accidentals

                    return (
                      <SvgText
                        key={`keysig-${lineIndex}-${idx}`}
                        x={accidentalX}
                        y={accidentalY}
                        fontSize={35 * scale}
                        fontFamily="BravuraText"
                        fill="#000"
                        textAnchor="middle"
                      >
                        {getAccidentalGlyph(acc.accidental)}
                      </SvgText>
                    );
                  });
                })()}
            </G>
          );
        })}

        {/* Render exit notes with exit animation */}
        {visibleNotes1 && exitLines.map((line, lineIndex) => renderNotesFromLine(line, lineIndex)).flat()}

        {/* Render entrance notes with entrance animation */}
        {visibleNotes2 && enterLines.map((line, lineIndex) => renderNotesFromLine(line, lineIndex)).flat()}
      </Svg>
    </View>
  );
};

export default MusicalStaff;
