import { PianoKey } from "@/types/pianoKeys";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioBuffer, AudioContext, GainNode } from "react-native-audio-api";
import { useMMKVNumber } from "react-native-mmkv";
import { Asset } from "expo-asset";

export default function usePlayMidi() {
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const [pianoVolume, setPianoVolume] = useMMKVNumber("pianoVolume");
  const activeSoundsRef = useRef<{ envelope: GainNode; endTime: number }[]>([]);

  async function loadAssets() {
    loadBuffers({
      "F#2": FileSystem.bundleDirectory + "piano_fs2.mp3",
      C3: FileSystem.bundleDirectory + "piano_c3.mp3",
      "F#3": FileSystem.bundleDirectory + "piano_fs3.mp3",
      C4: FileSystem.bundleDirectory + "piano_c4.mp3",
      "F#4": FileSystem.bundleDirectory + "piano_fs4.mp3",
    });
  }

  useEffect(() => {
    loadAssets();
    return () => {
      audioContextRef.current?.close();
      activeSoundsRef.current = [];
      stopSong();
    };
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       stopSong();
  //       audioContextRef.current?.close();
  //       activeSoundsRef.current = [];
  //       console.log("Play Audio is unfocused");
  //     };
  //   }, [])
  // );

  const bufferListRef = useRef<Record<string, AudioBuffer | null>>({
    C4: null,
    "F#4": null,
  });
  const audioContextRef = useRef<AudioContext>();

  const validateBuffers = () => {
    const allBuffersLoaded = Object.values(bufferListRef.current).every((buffer) => buffer !== null);
    setBuffersLoaded(allBuffersLoaded);
    return allBuffersLoaded;
  };

  const stopSong = () => {
    console.log("STOPPING SONG");
    activeSoundsRef.current.forEach((envelope) => {
      envelope.envelope.disconnect();
    });
  };

  const getClosestNote = (note: PianoKey): PianoKey | null => {
    const targetFrequency = getFrequency(note);
    if (targetFrequency === null) return null;

    let closestNote: PianoKey | null = null;
    let closestFrequencyDiff = Infinity;

    Object.keys(bufferListRef.current).forEach((key) => {
      const frequency = getFrequency(key);
      if (frequency !== null) {
        const frequencyDiff = Math.abs(targetFrequency - frequency);
        if (frequencyDiff < closestFrequencyDiff) {
          closestFrequencyDiff = frequencyDiff;
          closestNote = key as PianoKey;
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

  async function loadBuffers(sourceList: Record<string, string>) {
    audioContextRef.current = new AudioContext();
    try {
      await Promise.all(
        Object.entries(sourceList).map(async ([key, filepath]) => {
          console.log("LOADING BUFFER", key, filepath);
          if (audioContextRef?.current) {
            try {
              // Read the file content as base64
              const fileContent = await FileSystem.readAsStringAsync(filepath, {
                encoding: FileSystem.EncodingType.Base64,
              });

              // Convert base64 to ArrayBuffer
              const binaryString = atob(fileContent);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const arrayBuffer = bytes.buffer;

              // Decode the audio data
              bufferListRef.current[key] = await audioContextRef.current.decodeAudioData(arrayBuffer);
            } catch (error) {
              console.error("Error loading buffer for", key, ":", error);
              bufferListRef.current[key] = null;
            }
          } else {
            bufferListRef.current[key] = null;
            console.log("FAILED TO LOAD BUFFER - No audio context");
          }
        })
      );
      validateBuffers();
    } catch (error) {
      console.error("Error loading buffers:", error);
      setBuffersLoaded(false);
    }
  }

  const handleConvertSong = (
    song: {
      name: string;
      start: number;
      end: number;
      velocity: number;
    }[]
  ) => {
    return song.map((note) => ({
      duration: note.end - note.start,
      note: note.name as any,
      time: note.start,
    }));
  };

  const onKeyPressIn = (which: PianoKey, time: number, duration: number = 1, volume: number = 1) => {
    if (!buffersLoaded) {
      console.warn("Buffers not fully loaded yet");
      return;
    }

    let buffer = bufferListRef.current[which];
    const aCtx = audioContextRef.current;
    let playbackRate = 1;

    if (!aCtx) {
      return;
    }

    if (!buffer) {
      const closestKey = getClosestNote(which) || "C3";
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
    const endTime = tNow + time + duration + 0.5;

    // Store the active sound
    activeSoundsRef.current.push({ envelope: envelope as any, endTime });

    envelope.gain.setValueAtTime(pianoVolume !== undefined ? pianoVolume : 1, tNow + time);
    // Attack (fade-in)
    // envelope.gain.setValueAtTime(0.001, tNow + time);
    // envelope.gain.exponentialRampToValueAtTime(pianoVolume !== undefined ? pianoVolume : 1, tNow + time + 0.01);

    // Decay (fade-out) before stopping
    envelope.gain.setValueAtTime(0, endTime - 0.05);

    source.connect(envelope);
    // source.connect(gainRef.current!);
    envelope.connect(aCtx.destination);
    source.start(tNow + time);
    source.stop(endTime);

    // Remove the sound from the active list after its end time
    setTimeout(() => {
      activeSoundsRef.current = activeSoundsRef.current.filter((sound) => sound.endTime > aCtx.currentTime);
    }, (endTime - tNow) * 1000);
  };

  const playSong = (song: { note: PianoKey; time: number; duration?: number }[], volume: number = 1) => {
    if (!buffersLoaded) {
      console.warn("Cannot play song - buffers not fully loaded");
      return;
    }
    stopSong();

    song.forEach(({ note, time, duration }) => {
      onKeyPressIn(note as PianoKey, time, duration, volume);
    });
  };

  return { playSong, stopSong, buffersLoaded, handleConvertSong };
}
