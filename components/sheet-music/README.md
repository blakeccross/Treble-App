# Sheet Music Component

A React Native component that renders sheet music using SVGs and the BravuraText font. The component automatically sizes to fit the screen, wraps measures to new lines when they would be cut off, and **automatically calculates bar lines for 4/4 time signature**.

## Features

- **Auto-sizing**: Automatically fits to the container dimensions
- **Line wrapping**: Measures that would be cut off are moved to the next line
- **SVG-based**: Uses react-native-svg for crisp, scalable rendering
- **BravuraText font**: Uses the standard music notation font
- **Supports**: Treble clef (𝄞), quarter notes (♩), half notes (𝅗𝅥), whole notes (𝅝), and bar lines
- **Automatic Bar Lines**: Automatically calculates and inserts bar lines for 4/4 time signature
- **Minimum Measure Width**: Ensures consistent spacing with configurable minimum width

## Installation

Make sure you have the required dependencies:

```bash
npm install react-native-svg
```

The BravuraText font should be available in your app. If not, you'll need to add it to your font assets.

## Usage

```tsx
import React from "react";
import { View } from "react-native";
import MusicalStaff from "./components/sheet-music/sheet-music";

const MyComponent = () => {
  const notes = [
    // First measure (4 quarter notes)
    { type: "quarter", pitch: "c5" },
    { type: "quarter", pitch: "d5" },
    { type: "quarter", pitch: "e5" },
    { type: "quarter", pitch: "f5" },

    // Second measure (2 half notes)
    { type: "half", pitch: "g5" },
    { type: "half", pitch: "a5" },

    // Third measure (1 whole note)
    { type: "whole", pitch: "b5" },

    // Continue with more measures...
  ];

  return (
    <View style={{ flex: 1 }}>
      <MusicalStaff notes={notes} />
    </View>
  );
};
```

## Props

### MusicalStaffProps

| Prop                  | Type               | Required | Description                                                       |
| --------------------- | ------------------ | -------- | ----------------------------------------------------------------- |
| `notes`               | `Array<NoteProps>` | Yes      | Array of notes to render (bar lines are calculated automatically) |
| `containerWidth`      | `number`           | No       | Width of the container (defaults to window width)                 |
| `containerHeight`     | `number`           | No       | Height of the container (defaults to window height)               |
| `minimumMeasureWidth` | `number`           | No       | Minimum width for each measure (defaults to 300)                  |

### NoteProps

| Prop    | Type                                                                                   | Description       |
| ------- | -------------------------------------------------------------------------------------- | ----------------- |
| `type`  | `'whole' \| 'half' \| 'quarter'`                                                       | Type of note      |
| `pitch` | `'d4' \| 'e4' \| 'f4' \| 'g4' \| 'a5' \| 'b5' \| 'c5' \| 'd5' \| 'e5' \| 'f5' \| 'g5'` | Pitch of the note |

### BarProps

| Prop    | Type                   | Description                             |
| ------- | ---------------------- | --------------------------------------- |
| `type`  | `'single' \| 'double'` | Type of bar line (defaults to 'single') |
| `isEnd` | `boolean`              | Whether this is the final bar line      |

## Supported Notes

- **Whole Note**: `{ type: 'whole', pitch: 'c5' }`
- **Half Note**: `{ type: 'half', pitch: 'd5' }`
- **Quarter Note**: `{ type: 'quarter', pitch: 'e5' }`

## Supported Pitches

The component supports the following pitches (from lowest to highest):

- `d4` (below staff)
- `e4` (first space)
- `f4` (first line)
- `g4` (second space)
- `a5` (second line - middle)
- `b5` (third space)
- `c5` (third line)
- `d5` (fourth space)
- `e5` (fourth line)
- `f5` (fifth space)
- `g5` (above staff)

## Bar Lines

- **Single bar**: `{ type: 'single' }`
- **Double bar**: `{ type: 'double' }`
- **Final bar**: `{ type: 'single', isEnd: true }`

## Auto-sizing and Line Wrapping

The component automatically:

1. Calculates the width needed for each measure
2. Fits measures within the available container width
3. Wraps measures to new lines when they would be cut off
4. Scales the entire staff to fit within the container height
5. Adds treble clefs at the beginning of each line

## Automatic Bar Line Calculation

The component automatically calculates and inserts bar lines based on 4/4 time signature. You only need to provide the notes, and the component will:

- **Count beats**: Each note type has a beat value (quarter = 1, half = 2, whole = 4)
- **Insert bar lines**: Automatically insert bar lines when 4 beats are reached
- **Handle incomplete measures**: Add a final bar line for any remaining beats

### Beat Values (4/4 Time)

- **Quarter Note**: 1 beat
- **Half Note**: 2 beats
- **Whole Note**: 4 beats

### Example

```tsx
const notes = [
  { type: "quarter", pitch: "c5" }, // 1 beat
  { type: "quarter", pitch: "d5" }, // 1 beat
  { type: "quarter", pitch: "e5" }, // 1 beat
  { type: "quarter", pitch: "f5" }, // 1 beat
  // Bar line automatically inserted here (4 beats)
  { type: "half", pitch: "g5" }, // 2 beats
  { type: "half", pitch: "a5" }, // 2 beats
  // Bar line automatically inserted here (4 beats)
];
```

## Example

See `example-usage.tsx`
