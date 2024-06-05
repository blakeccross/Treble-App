export type SampleQuestionType = {
  type: string;
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
    reading_text: `# Introduction to Music Theory

  Music theory is the study of the practices and possibilities of music. It is a complex and vast subject, but understanding the basics can greatly enhance your musical experience, whether you're a performer, composer, or listener. This guide will cover some of the fundamental concepts in music theory.
    
  ## 1. The Musical Alphabet
    
  The musical alphabet consists of seven letters:
    - **A**
    - **B**
    - **C**
    - **D**
    - **E**
    - **F**
    - **G**
    
  After G, the alphabet repeats back to A. Each of these letters represents a specific pitch.
    
  ## 2. Scales
    
  A scale is a sequence of notes in ascending or descending order. The most common scale in Western music is the **Major Scale**, which follows a specific pattern of whole steps (W) and half steps (H):
    
  ## 3. Intervals

  An interval is the distance between two notes. Intervals are named based on their size and quality:
  
  - **Perfect Unison**: Same note (C to C)
  - **Major Second**: Whole step (C to D)
  - **Major Third**: Two whole steps (C to E)
  - **Perfect Fourth**: Two and a half steps (C to F)
  - **Perfect Fifth**: Three and a half steps (C to G)
  - **Major Sixth**: Four and a half steps (C to A)
  - **Major Seventh**: Five and a half steps (C to B)
  - **Octave**: Six whole steps (C to C)
  
  ## 4. Chords
  
  A chord is a group of notes played together. The most basic type of chord is the **Triad**, which consists of three notes:
  
  - **Major Triad**: Root, Major Third, Perfect Fifth (C - E - G)
  - **Minor Triad**: Root, Minor Third, Perfect Fifth (C - Eb - G)
  - **Diminished Triad**: Root, Minor Third, Diminished Fifth (C - Eb - Gb)
  - **Augmented Triad**: Root, Major Third, Augmented Fifth (C - E - G#)
  
  ## 5. Time Signatures
  
  Time signatures indicate how music is divided into measures. They are written as two numbers, one above the other:
  
  - **4/4**: Common time, 4 beats per measure, quarter note gets one beat.
  - **3/4**: Waltz time, 3 beats per measure, quarter note gets one beat.
  - **6/8**: Compound time, 6 beats per measure, eighth note gets one beat.
  
  ## 6. Key Signatures
  
  Key signatures indicate the key of the piece by specifying which notes are sharp or flat throughout the piece. For example:
  
  - **C Major / A Minor**: No sharps or flats.
  - **G Major / E Minor**: One sharp (F#).
  - **F Major / D Minor**: One flat (Bb).
  
  ## Conclusion
  
  This introduction covers just the basics of music theory. As you delve deeper, you'll discover more intricate concepts such as modes, complex chords, and advanced rhythmic structures. Understanding these fundamentals will provide a strong foundation for any musical endeavor.
  
  ---
  
  *For further reading, consider exploring books such as "The Complete Musician" by Steven Laitz or "Music Theory for Dummies" by Michael Pilhofer and Holly Day.*
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
