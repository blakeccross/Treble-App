import React, { useMemo, useEffect, useRef } from "react";
import { View, useWindowDimensions, StyleSheet, Animated } from "react-native";
import Svg, { Line, Text as SvgText, G, TextAnchor } from "react-native-svg";

type NoteType = "whole" | "half" | "quarter";
type Pitch = "a3" | "b3" | "c4" | "d4" | "e4" | "f4" | "g4" | "a5" | "b5" | "c5" | "d5" | "e5" | "f5" | "g5";

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
  centerLastLine?: boolean;
  exitAnimation?: boolean;
  showBarLines?: boolean;
  animateIn?: "bottom" | "none" | "right";
}

interface Measure {
  elements: Array<NoteProps | RestProps | BarProps>;
  width: number;
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
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [currentY, setCurrentY] = React.useState(() => {
    if (animateIn === "bottom") {
      return isFlipped ? y - 20 : y + 20;
    }
    return y;
  });
  const [currentX, setCurrentX] = React.useState(() => {
    if (animateIn === "right") {
      return isFlipped ? x - 200 : x + 200; // Start 50px to the right
    }
    return x;
  });
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    if (exitAnimation) {
      // Exit animation: move left and fade out
      const exitTimer = setTimeout(() => {
        // Animate X position - all notes move left for consistency
        const xInterval = setInterval(() => {
          setCurrentX((prev) => {
            // Move left by a fixed amount each frame
            const newX = isFlipped ? prev + 5 : prev - 5; // Move 5 pixels left each frame
            if (newX < -200) {
              clearInterval(xInterval);
              return -200;
            }
            return newX;
          });
        }, 16); // ~60fps

        // Animate opacity to 0
        const opacityInterval = setInterval(() => {
          setOpacity((prev) => {
            if (prev <= 0) {
              clearInterval(opacityInterval);
              return 0;
            }
            return prev - 0.05;
          });
        }, 20);

        return () => {
          clearInterval(xInterval);
          clearInterval(opacityInterval);
        };
      }, delay);

      return () => clearTimeout(exitTimer);
    } else {
      // Entry animation: original behavior
      const timer = setTimeout(() => {
        setIsVisible(true);

        // Animate Y position (for bottom animation)
        if (animateIn === "bottom") {
          const yInterval = setInterval(() => {
            setCurrentY((prev) => {
              const diff = y - prev;
              if (Math.abs(diff) < 1) {
                clearInterval(yInterval);
                return y;
              }
              return prev + diff * 0.1;
            });
          }, 16); // ~60fps
        }

        // Animate X position (for right animation)
        if (animateIn === "right") {
          const xInterval = setInterval(() => {
            setCurrentX((prev) => {
              const diff = x - prev;
              if (Math.abs(diff) < 1) {
                clearInterval(xInterval);
                return x;
              }
              return prev + diff * 0.1;
            });
          }, 16); // ~60fps
        }

        // Animate opacity
        const opacityInterval = setInterval(() => {
          setOpacity((prev) => {
            if (prev >= 1) {
              clearInterval(opacityInterval);
              return 1;
            }
            return prev + 0.05;
          });
        }, 20);

        return () => {
          if (animateIn === "bottom") {
            // Clear Y interval if it was set
          }
          if (animateIn === "right") {
            // Clear X interval if it was set
          }
          clearInterval(opacityInterval);
        };
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [y, x, delay, exitAnimation, animateIn]);

  return (
    <SvgText
      x={currentX}
      y={currentY}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fill}
      textAnchor={textAnchor}
      transform={transform}
      opacity={opacity}
    >
      {children}
    </SvgText>
  );
};

const MusicalStaff = ({
  notes,
  containerWidth: propContainerWidth,
  containerHeight: propContainerHeight,
  keySignature,
  scale = 1,
  centerLastLine = false,
  exitAnimation = false,
  showBarLines = true,
  animateIn = "right",
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
  const MARGIN = 10;
  const MIN_MEASURE_WIDTH = 75 * scale;
  const STAFF_LINES_COUNT = 5; // 5 lines in a staff
  const MIN_NOTE_TO_BAR_SPACING = 10 * scale; // Minimum space between notes and bar lines
  const CLEF_SPACING = 10 * scale;

  // Vertical padding to accommodate notes above and below the staff
  const VERTICAL_PADDING = 40 * scale; // Space above and below staff for ledger lines and notes

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

  // Render ledger lines for notes below the staff
  const renderLedgerLines = (
    pitch: Pitch,
    noteX: number,
    staffTop: number,
    staffBottom: number,
    lineSpacing: number,
    scale: number
  ): React.ReactNode[] => {
    const ledgerLines: React.ReactNode[] = [];

    // Get the note position (positive values are below the staff)
    const notePosition = getNotePosition(pitch);

    // Only render ledger lines for notes below the staff (position > 4)
    if (notePosition > 4) {
      // Calculate how many ledger lines we need
      // For a3 (position 9): 2 ledger lines
      // For b3 (position 8): 1 ledger line
      // For c4 (position 7): 1 ledger line
      // For d4 (position 6): 1 ledger line
      // For e4 (position 5): 1 ledger line
      const ledgerLineCount = notePosition === 9 ? 2 : 1;

      // Render each ledger line
      for (let i = 0; i < ledgerLineCount; i++) {
        const ledgerY = staffBottom + (i + 1) * lineSpacing;

        // Make ledger lines shorter than staff lines
        const ledgerLineLength = 20 * scale;
        const ledgerX1 = noteX - ledgerLineLength / 2;
        const ledgerX2 = noteX + ledgerLineLength / 2;

        ledgerLines.push(<Line key={`ledger-${pitch}-${i}`} x1={ledgerX1} y1={ledgerY} x2={ledgerX2} y2={ledgerY} stroke="#000" strokeWidth={1} />);
      }
    }

    return ledgerLines;
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
  }, [notes, containerWidth, centerLastLine]);

  // Calculate total height needed (now based on the new `lines` array)
  const calculatedHeight = lines.length * (STAFF_HEIGHT + MARGIN) + MARGIN + VERTICAL_PADDING * 2;
  const totalHeight = propContainerHeight ? Math.max(propContainerHeight, calculatedHeight) : calculatedHeight;

  return (
    <View style={[styles.container, { width: containerWidth, height: totalHeight }]}>
      <Svg width={containerWidth} height={totalHeight} viewBox={`0 0 ${containerWidth} ${totalHeight}`} style={styles.svg}>
        {lines.map((line, lineIndex) => {
          const yOffset = lineIndex * (STAFF_HEIGHT + MARGIN) + MARGIN + VERTICAL_PADDING;
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

                      // Render ledger lines for notes below the staff
                      const ledgerLines = renderLedgerLines(el.pitch, noteX, staffTop, staffBottom, STAFF_LINE_SPACING, scale);

                      rendered.push(
                        <AnimatedNote
                          key={`l${lineIndex}-m${mIdx}-n${elIdx}`}
                          x={noteX}
                          y={noteY}
                          fontSize={70 * scale}
                          fontFamily="BravuraText"
                          fill="#000"
                          textAnchor="middle"
                          transform={shouldFlip ? `rotate(180, ${noteX}, ${noteY})` : undefined}
                          delay={mIdx * 100}
                          exitAnimation={exitAnimation}
                          isFlipped={shouldFlip}
                          animateIn={animateIn}
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
                            key={`l${lineIndex}-m${mIdx}-n${elIdx}-acc`}
                            x={accidentalX}
                            y={noteY}
                            fontSize={35 * scale}
                            fontFamily="BravuraText"
                            fill="#000"
                            textAnchor="middle"
                            delay={elIdx * 100}
                            exitAnimation={exitAnimation}
                            isFlipped={shouldFlip}
                            animateIn={animateIn}
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
                          key={`l${lineIndex}-m${mIdx}-r${elIdx}`}
                          x={restX}
                          y={restY}
                          fontSize={70 * scale}
                          fontFamily="BravuraText"
                          fill="#000"
                          textAnchor="middle"
                          delay={mIdx * 100}
                          exitAnimation={exitAnimation}
                          animateIn={animateIn}
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
                            key={`l${lineIndex}-m${mIdx}-b${elIdx}`}
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
