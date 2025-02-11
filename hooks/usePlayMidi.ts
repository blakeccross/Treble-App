import { AudioBuffer, AudioContext } from "react-native-audio-api";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";
import { useEffect, useRef } from "react";
import { Asset, useAssets } from "expo-asset";

type KeyName =
  | "A0"
  | "A#0"
  | "Bb0"
  | "B0"
  | "C1"
  | "C#1"
  | "Db1"
  | "D1"
  | "D#1"
  | "Eb1"
  | "E1"
  | "F1"
  | "F#1"
  | "Gb1"
  | "G1"
  | "G#1"
  | "Ab1"
  | "A2"
  | "A#2"
  | "Bb2"
  | "B2"
  | "C2"
  | "C#2"
  | "Db2"
  | "D2"
  | "D#2"
  | "Eb2"
  | "E2"
  | "F2"
  | "F#2"
  | "Gb2"
  | "G2"
  | "G#2"
  | "Ab2"
  | "A3"
  | "A#3"
  | "Bb3"
  | "B3"
  | "C3"
  | "C#3"
  | "Db3"
  | "D3"
  | "D#3"
  | "Eb3"
  | "E3"
  | "F3"
  | "F#3"
  | "Gb3"
  | "G3"
  | "G#3"
  | "Ab3"
  | "A4"
  | "A#4"
  | "Bb4"
  | "B4"
  | "C4"
  | "C#4"
  | "Db4"
  | "D4"
  | "D#4"
  | "Eb4"
  | "E4"
  | "F4"
  | "F#4"
  | "Gb4"
  | "G4"
  | "G#4"
  | "Ab4"
  | "A5"
  | "A#5"
  | "Bb5"
  | "B5"
  | "C5"
  | "C#5"
  | "Db5"
  | "D5"
  | "D#5"
  | "Eb5"
  | "E5"
  | "F5"
  | "F#5"
  | "Gb5"
  | "G5"
  | "G#5"
  | "Ab5"
  | "A6"
  | "A#6"
  | "Bb6"
  | "B6"
  | "C6"
  | "C#6"
  | "Db6"
  | "D6"
  | "D#6"
  | "Eb6"
  | "E6"
  | "F6"
  | "F#6"
  | "Gb6"
  | "G6"
  | "G#6"
  | "Ab6"
  | "A7"
  | "A#7"
  | "Bb7"
  | "B7"
  | "C7"
  | "C#7"
  | "Db7"
  | "D7"
  | "D#7"
  | "Eb7"
  | "E7"
  | "F7"
  | "F#7"
  | "Gb7"
  | "G7"
  | "G#7"
  | "Ab7"
  | "A8"
  | "A#8"
  | "Bb8"
  | "B8";

type PR<V> = Partial<Record<KeyName, V>>;

export default function usePlayMidi() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferListRef = useRef<Record<string, AudioBuffer | null>>({ C3: null, "F#3": null });
  // const playingNotesRef = useRef<Record<KeyName, PlayingNote>>({});
  const [assets] = useAssets([require("../assets/audio/piano_c3.mp3"), require("../assets/audio/piano_fs3.mp3")]);

  const sourceList = {
    C3: assets ? assets[0].uri : "",
    "F#3": assets ? assets[1].uri : "",
  };

  const getClosestNote = (note: KeyName): KeyName | null => {
    const targetFrequency = getFrequency(note);
    if (targetFrequency === null) return null;

    let closestNote: KeyName | null = null;
    let closestFrequencyDiff = Infinity;

    Object.keys(sourceList).forEach((key) => {
      const frequency = getFrequency(key);
      if (frequency !== null) {
        const frequencyDiff = Math.abs(targetFrequency - frequency);
        if (frequencyDiff < closestFrequencyDiff) {
          closestFrequencyDiff = frequencyDiff;
          closestNote = key as KeyName;
        }
      }
    });

    return closestNote;
  };

  function getFrequency(note: string): number | null {
    const noteRegex = /^([A-Ga-g])(#|b)?(-?\d+)$/;
    const match = note.match(noteRegex);
    if (!match) return null; // Invalid input

    const [, base, accidental, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);
    // Note order in an octave
    const noteOrder: { [key: string]: number } = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11,
    };

    const fullNote = accidental ? base.toUpperCase() + accidental : base.toUpperCase();
    const semitone = noteOrder[fullNote];
    if (semitone === undefined) return null;

    // Calculate MIDI number
    const midiNote = semitone + (octave + 1) * 12;

    // Frequency calculation
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    return frequency;
  }

  useEffect(() => {
    if (assets && assets[0].uri) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (bufferListRef.current && bufferListRef.current["C3"] === null && bufferListRef.current["F#3"] === null) {
        Object.entries(sourceList).forEach(async ([key, url]) => {
          bufferListRef.current[key] = await FileSystem.downloadAsync(url, `${FileSystem.documentDirectory}/${key.replace("#", "s")}.mp3`).then(
            ({ uri }) => {
              console.log(uri, key);
              return audioContextRef.current!.decodeAudioDataSource(uri);
            }
          );
        });
      }
    }

    return () => {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [assets]);

  const onKeyPressIn = (which: KeyName, time: number, duration?: number) => {
    let buffer = bufferListRef.current[which];
    const aCtx = audioContextRef.current;
    let playbackRate = 1;

    if (!aCtx) {
      return;
    }

    if (!buffer) {
      const closestKey = getClosestNote(which) || "C3";
      console.log(closestKey);
      // const closestKey = "C3";
      buffer = bufferListRef.current[closestKey];
      const frequencyWhich = getFrequency(which);
      const frequencyClosestKey = getFrequency(closestKey);
      if (frequencyWhich && frequencyClosestKey) {
        playbackRate = frequencyWhich / frequencyClosestKey;
      }
    }

    const source = aCtx.createBufferSource();
    const envelope = aCtx.createGain();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    const tNow = aCtx.currentTime;
    const endTime = tNow + time + (duration ?? 5) + 0.5;

    // Attack (fade-in)
    envelope.gain.setValueAtTime(0.001, tNow + time);
    envelope.gain.exponentialRampToValueAtTime(1, tNow + time + 0.01);

    // Decay (fade-out) before stopping
    envelope.gain.exponentialRampToValueAtTime(0.001, endTime);
    envelope.gain.setValueAtTime(0, endTime - 0.05);

    source.connect(envelope);
    envelope.connect(aCtx.destination);

    source.start(tNow + time);
    source.stop(endTime);
    //playingNotesRef.current[which] = { source, envelope, startedAt: tNow };
  };

  // const onKeyPressOut = (which: KeyName) => {
  //   const { source, envelope, startedAt } = playingNotesRef.current[which];

  //   const aCtx = audioContextRef.current;

  //   if (!source || !envelope || !aCtx) {
  //     return;
  //   }

  //   const tNow = Math.max(aCtx.currentTime, startedAt + 5);

  //   envelope.gain.exponentialRampToValueAtTime(0.0001, tNow + 0.08);
  //   envelope.gain.setValueAtTime(0, tNow + 0.09);
  //   source.stop(tNow + 0.1);

  //   playingNotesRef.current[which] = undefined;
  // };

  const playSong = (song: { note: KeyName; time: number; duration?: number }[]) => {
    song.forEach(({ note, time, duration }) => {
      onKeyPressIn(note as KeyName, time, duration);
    });
  };

  return { playSong };
}
