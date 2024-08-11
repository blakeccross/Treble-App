export type SampleQuestionType = {
  type: "reading" | "fill-in-the-blank" | "identify-the-chord-sheet";
  question: string;
  explanation: string;
  answer_id: number | null;
  reading_text: string;
  options: { id: number; option_text: string }[] | null;
  sheet_music:
    | {
        clef: string;
        keys: string[];
        duration: string;
      }[]
    | null;
};

export const sampleQuestions1: SampleQuestionType[] = [
  {
    type: "reading",
    question: "",
    reading_text: `# Introduction

  Music theory is the study of the practices and possibilities of music. The Oxford Companion to Music describes three interrelated uses of the term:
1. The rudiments (or foundations) that are needed to understand music notation;
2. Learning scholars’ views on music from antiquity to the present; and
3. A sub-topic of musicology that seeks to define processes and general principles in music.

Wow. Strong start, huh? Don’t fret, that’s probably the most academic sounding as this will get, and we will primarily focus on 1 and 3 from above - the foundations that are needed to understand music notation and defining the processes and general principles in music. But for our academic friends here, we’ll try to include a formal definition for terms along the way :)

Welcome to the journey!

Learning music theory begins with two key elements: rhythm, which is the horizontal, forward-moving element of music theory; and pitch, which is the vertical, audible element that we hear with our ears and feel with our souls.

A more formal definition of each:

**Rhythm:** The duration of musical sounds and rests in time  
**Pitch:** A discrete tone with an individual frequency

We will start with rhythm, the horizontal element of music theory.
    `,
    explanation: "",
    answer_id: null,
    options: null,
    sheet_music: null,
  },
  {
    type: "reading",
    question: "",
    reading_text: `# Rhythm

  Rhythm is “the duration of musical sounds and rests in time.” We naturally perceive music as it is organized in time. Much of pre-modern music was arythmic (lacking a regular, steady pulse) and free-flowing based on the text of what was being sung (think Gregorian chant).
  
  Most modern Western music is rhythmic (having a regular steady pulse), and we have notation, symbols, and terminology to explain these concepts. Listen to some examples of Gregorian chant vs. modern music and hear the difference in rhythm.
    `,
    explanation: "",
    answer_id: null,
    options: null,
    sheet_music: null,
  },
  {
    type: "identify-the-chord-sheet",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: 1,
    reading_text: "",
    options: [
      { id: 1, option_text: "C maj" },
      { id: 2, option_text: "D min7" },
      { id: 3, option_text: "Eb" },
      { id: 4, option_text: "F sus" },
    ],
    sheet_music: [
      {
        clef: "treble",
        keys: ["c/4", "e/4", "g/4"],
        duration: "q",
      },
    ],
  },
  {
    type: "fill-in-the-blank",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: null,
    reading_text: "",
    options: [
      { id: 1, option_text: "C" },
      { id: 2, option_text: "D" },
      { id: 3, option_text: "E" },
      { id: 4, option_text: "F" },
      { id: 5, option_text: "G" },
      { id: 6, option_text: "A" },
      { id: 7, option_text: "B" },
      { id: 8, option_text: "CDFF" },
      { id: 9, option_text: "DEAGSGS" },
    ],
    sheet_music: null,
  },
  {
    type: "identify-the-chord-sheet",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: 1,
    reading_text: "",
    options: [
      { id: 1, option_text: "C maj" },
      { id: 2, option_text: "D min7" },
      { id: 3, option_text: "Eb" },
      { id: 4, option_text: "F sus" },
    ],
    sheet_music: [
      { clef: "treble", keys: ["c/5"], duration: "q" },
      { clef: "treble", keys: ["d/4"], duration: "q" },
      { clef: "treble", keys: ["b/4"], duration: "qr" },
      {
        clef: "treble",
        keys: ["c/4", "e/4", "g/4"],
        duration: "q",
      },
    ],
  },
  {
    type: "identify-the-chord-sheet",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: 1,
    reading_text: "",
    options: [
      { id: 1, option_text: "C maj" },
      { id: 2, option_text: "D min7" },
      { id: 3, option_text: "Eb" },
      { id: 4, option_text: "F sus" },
    ],
    sheet_music: [
      { clef: "treble", keys: ["c/5"], duration: "q" },
      { clef: "treble", keys: ["d/4"], duration: "q" },
      { clef: "treble", keys: ["b/4"], duration: "qr" },
      {
        clef: "treble",
        keys: ["c/4", "e/4", "g/4"],
        duration: "q",
      },
    ],
  },
];

export const sampleQuestions2: SampleQuestionType[] = [
  {
    type: "reading",
    question: "",
    reading_text: `
  # Meter
      
  -   Meter: The organization of beats into regular groups.
          -   Duple Meter: Two beats per measure (e.g., 2/4 time).
          -   Triple Meter: Three beats per measure (e.g., 3/4 time).
          -   Quadruple Meter: Four beats per measure (e.g., 4/4 time).
      -   Time Signature: Indicates the number of beats in a measure and which note value is equivalent to a beat (e.g., 4/4, 3/4).
      
     `,
    explanation: "",
    answer_id: null,
    options: null,
    sheet_music: null,
  },
  {
    type: "fill-in-the-blank",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: null,
    reading_text: "",
    options: [
      { id: 1, option_text: "A" },
      { id: 2, option_text: "B" },
      { id: 3, option_text: "C" },
      { id: 4, option_text: "D" },
      { id: 5, option_text: "E" },
    ],
    sheet_music: null,
  },
  {
    type: "identify-the-chord-sheet",
    question: "Place the notes in the correct order",
    explanation: "The notes go up alphabetically but stop at G",
    answer_id: 1,
    reading_text: "",
    options: [
      { id: 1, option_text: "C maj" },
      { id: 2, option_text: "D min7" },
      { id: 3, option_text: "Eb" },
      { id: 4, option_text: "F sus" },
    ],
    sheet_music: [
      {
        clef: "treble",
        keys: ["c/4", "e/4", "g/4"],
        duration: "q",
      },
    ],
  },
];

export const sampleModule = [sampleQuestions1, sampleQuestions2];
