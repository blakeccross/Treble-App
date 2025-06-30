# Musical Staff Component - Ledger Lines Support

## Overview

The Musical Staff component has been enhanced to support notes above and below the staff with automatic ledger line rendering.

## New Features

### Expanded Note Range

The component now supports a much wider range of notes:

- **Very Low Notes**: c3, d3, e3, f3, g3, a3, b3 (6 ledger lines below staff)
- **Low Notes**: c4, d4, e4, f4, g4, a4, b4 (1-5 ledger lines below staff)
- **Staff Notes**: c5, d5, e5, f5, g5, a5, b5 (on the staff)
- **High Notes**: c6, d6, e6, f6, g6, a6, b6 (1-4 ledger lines above staff)
- **Very High Notes**: c7, d7, e7, f7, g7, a7, b7 (4-7 ledger lines above staff)

### Automatic Ledger Line Rendering

The component automatically:

- Detects when notes need ledger lines
- Calculates the correct number of ledger lines needed
- Positions ledger lines correctly above or below the staff
- Renders ledger lines with proper spacing and width

### Enhanced Positioning System

- Notes are positioned using a coordinate system where 0 represents the middle line
- Positive values indicate positions below the staff (requiring ledger lines)
- Negative values indicate positions above the staff (requiring ledger lines)
- Ledger lines are automatically calculated based on note position

## Usage Examples

### Basic Usage with Ledger Lines

```tsx
import MusicalStaff from "./components/sheet-music/sheet-music copy";

const notes = [
  { type: "quarter", pitch: "c4" }, // Low note with ledger line
  { type: "half", pitch: "c5" }, // Staff note
  { type: "quarter", pitch: "c6" }, // High note with ledger line
  { type: "whole", pitch: "c3" }, // Very low note with many ledger lines
];

<MusicalStaff notes={notes} scale={0.8} />;
```

### Notes with Accidentals

```tsx
const notesWithAccidentals = [
  { type: "quarter", pitch: "c4", accidental: "sharp" },
  { type: "half", pitch: "d5", accidental: "flat" },
  { type: "quarter", pitch: "e6", accidental: "natural" },
];
```

### Test Files

Two test files are included to demonstrate the functionality:

1. **test-ledger-lines.tsx** - Simple test showing various note positions
2. **comprehensive-test.tsx** - Comprehensive test with different note types and accidentals

## Technical Details

### Ledger Line Calculation

The `getLedgerLines()` function determines:

- Whether a note needs ledger lines
- How many ledger lines are needed
- Whether the ledger lines should be above or below the staff

### Positioning System

Notes are positioned using a coordinate system:

- Staff lines are at positions: 0, -1, -2, -3, -4 (from top to bottom)
- Notes below the staff have positive positions (1, 2, 3, etc.)
- Notes above the staff have negative positions (-5, -6, -7, etc.)

### Rendering

Ledger lines are rendered as SVG `<Line>` elements with:

- Proper width (20 \* scale)
- Correct positioning relative to the note
- Appropriate stroke width and color

## Key Signature Support

The key signature system has been updated to work with the new pitch range, ensuring accidentals are positioned correctly for all supported notes.

## Animation Support

All ledger lines and notes support the existing animation system:

- Entry animations (bottom, right, none)
- Exit animations
- Proper timing and delays
