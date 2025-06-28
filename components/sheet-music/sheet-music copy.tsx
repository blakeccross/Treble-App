import React, { useMemo } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Svg, { Line, Text as SvgText, G } from "react-native-svg";

type NoteType = "whole" | "half" | "quarter";
type Pitch = "d4" | "e4" | "f4" | "g4" | "a5" | "b5" | "c5" | "d5" | "e5" | "f5" | "g5";

interface NoteProps {
  type: NoteType;
  pitch: Pitch;
  accidental?: "sharp" | "flat" | "natural";
}

interface RestProps {
  type: NoteType; // duration
  isRest: true;
}

interface BarProps {
  type?: "single" | "double";
  isEnd?: boolean;
}

interface MusicalStaffProps {
  notes: Array<NoteProps | RestProps>;
  containerWidth?: number;
  containerHeight?: number;
  keySignature?: "C" | "G" | "D" | "A" | "E" | "B" | "F#" | "C#" | "F" | "Bb" | "Eb" | "Ab" | "Db" | "Gb" | "Cb";
  scale?: number;
}

interface Measure {
  elements: Array<NoteProps | RestProps | BarProps>;
  width: number;
}

const MusicalStaff = ({
  notes,
  containerWidth: propContainerWidth,
  containerHeight: propContainerHeight,
  keySignature,
  scale = 1,
}: MusicalStaffProps) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const containerWidth = propContainerWidth || windowWidth;
  const containerHeight = propContainerHeight || windowHeight;

  // Constants for layout
  const STAFF_HEIGHT = 100 * scale;
  const STAFF_LINE_SPACING = 12 * scale;
  const NOTE_SPACING = 40 * scale;
  const BAR_WIDTH = 6 * scale;
  const TREBLE_CLEF_WIDTH = 40 * scale;
  const MARGIN = 30 * scale;
  const MIN_MEASURE_WIDTH = 75 * scale;
  const STAFF_LINES_COUNT = 5; // 5 lines in a staff
  const MIN_NOTE_TO_BAR_SPACING = 10 * scale; // Minimum space between notes and bar lines
  const CLEF_SPACING = 10 * scale;

  // Get note position on staff (0 = middle line, positive = up, negative = down)
  const getNotePosition = (pitch: Pitch): number => {
    const positions: Record<Pitch, number> = {
      d4: 6, // Below staff (ledger line)
      e4: 5, // Below staff
      f4: 4, // First space
      g4: 3, // First line
      a5: 2, // Second space
      b5: 1, // Second line
      c5: 0, // Third line (middle)
      d5: -1, // Fourth space
      e5: -2, // Fourth line
      f5: -3, // Fifth space
      g5: -4, // Above staff
    };
    return positions[pitch] || 0;
  };

  // Get note type-specific Y position adjustment
  const getNoteTypeAdjustment = (type: NoteType): number => {
    switch (type) {
      case "whole":
        return 0;
      case "half":
        return -6 * scale; // Adjust half note position
      case "quarter":
        return 0;
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
      const notePosition = getNotePosition(element.pitch);
      const middleLinePosition = getNotePosition("b5"); // B5 is the middle line

      switch (type) {
        case "whole":
          return "𝅝"; // whole notes don't have stems
        case "half":
          // Stem up for notes below middle line, down for notes at or above
          return notePosition > middleLinePosition ? "𝅗𝅥" : "𝅗𝅥"; // Half notes with stem up vs down
        case "quarter":
          // Stem up for notes below middle line, down for notes at or above
          return notePosition > middleLinePosition ? "♩" : "♩"; // Quarter notes with stem up vs down
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

  // Calculate measure widths and split into staff lines (so we can position notes **inside** each measure)
  const lines = useMemo(() => {
    // 1) Insert bar-lines based on the time-signature
    const elementsWithBars = addBarLines(notes);

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

    return staffLines;
  }, [notes, containerWidth]);

  // Calculate total height needed (now based on the new `lines` array)
  const totalHeight = lines.length * (STAFF_HEIGHT + MARGIN) + MARGIN;

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      <Svg width={containerWidth} height={containerHeight} viewBox={`0 0 ${containerWidth} ${containerHeight}`} style={styles.svg}>
        {lines.map((line, lineIndex) => {
          const yOffset = lineIndex * (STAFF_HEIGHT + MARGIN) + MARGIN;
          const xOffset = MARGIN;
          const staffTop = yOffset;
          const staffBottom = yOffset + (STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING;

          // Width of this staff line (clef + all measures)
          const staffLineEndX = xOffset + line.contentWidth;

          return (
            <G key={lineIndex}>
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

              {/* Measures */}
              {(() => {
                let currentMeasureStartX = xOffset + TREBLE_CLEF_WIDTH + CLEF_SPACING;

                // Add key signature width to measure starting position
                if (keySignature && keySignature !== "C") {
                  const accidentals = getKeySignatureAccidentals(keySignature);
                  currentMeasureStartX += accidentals.length * 15; // 15px per accidental
                }

                const rendered: React.ReactNode[] = [];

                line.measures.forEach((measure, mIdx) => {
                  const measureInnerStart = currentMeasureStartX;
                  const contentStartX = measureInnerStart + (measure.width - measure.contentWidth) / 2;

                  // Walk through elements inside this measure
                  let localCursor = contentStartX;

                  measure.elements.forEach((el, elIdx) => {
                    if ("pitch" in el && !("isRest" in el)) {
                      // NOTE
                      const noteY =
                        yOffset +
                        ((STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING) / 2 +
                        (getNotePosition(el.pitch) * STAFF_LINE_SPACING) / 2 +
                        getNoteTypeAdjustment(el.type);

                      const noteX = localCursor + NOTE_SPACING / 2;

                      // Determine if note should be flipped (stem down for notes at or above middle line)
                      const notePosition = getNotePosition(el.pitch);
                      const middleLinePosition = getNotePosition("b5"); // B5 is the middle line
                      const shouldFlip = notePosition <= middleLinePosition && el.type !== "whole";

                      rendered.push(
                        <SvgText
                          key={`l${lineIndex}-m${mIdx}-n${elIdx}`}
                          x={noteX}
                          y={noteY}
                          fontSize={70 * scale}
                          fontFamily="BravuraText"
                          fill="#000"
                          textAnchor="middle"
                          transform={shouldFlip ? `rotate(180, ${noteX}, ${noteY})` : undefined}
                        >
                          {getNoteGlyph(el)}
                        </SvgText>
                      );

                      // Render accidental if present
                      if (el.accidental) {
                        const accidentalX = noteX - 20; // Position accidental to the left of the note
                        rendered.push(
                          <SvgText
                            key={`l${lineIndex}-m${mIdx}-n${elIdx}-acc`}
                            x={accidentalX}
                            y={noteY}
                            fontSize={35 * scale}
                            fontFamily="BravuraText"
                            fill="#000"
                            textAnchor="middle"
                          >
                            {getAccidentalGlyph(el.accidental)}
                          </SvgText>
                        );
                      }

                      localCursor += NOTE_SPACING;
                    } else if ("isRest" in el) {
                      // REST – positioned according to rest type
                      const restPosition = getRestPosition(el.type);
                      const restY = yOffset + ((STAFF_LINES_COUNT - 1) * STAFF_LINE_SPACING) / 2 + (restPosition * STAFF_LINE_SPACING) / 2;

                      const restX = localCursor + NOTE_SPACING / 2;

                      rendered.push(
                        <SvgText
                          key={`l${lineIndex}-m${mIdx}-r${elIdx}`}
                          x={restX}
                          y={restY}
                          fontSize={70 * scale}
                          fontFamily="BravuraText"
                          fill="#000"
                          textAnchor="middle"
                        >
                          {getNoteGlyph(el)}
                        </SvgText>
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
                      rendered.push(
                        <Line
                          key={`l${lineIndex}-m${mIdx}-b${elIdx}`}
                          x1={barX}
                          y1={staffTop}
                          x2={barX}
                          y2={staffBottom}
                          stroke="#000"
                          strokeWidth={el.type === "double" || el.isEnd ? 3 : 2}
                        />
                      );
                      if (!isLastBarLine) {
                        localCursor += BAR_WIDTH;
                      }
                    }
                  });

                  // Advance to the start of next measure
                  currentMeasureStartX += measure.width;
                });

                return rendered;
              })()}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    backgroundColor: "transparent",
  },
});

export default MusicalStaff;
