import { PianoKey } from "@/types/pianoKeys";
import { useAssets } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioBuffer, AudioContext, GainNode, AudioBufferSourceNode } from "react-native-audio-api";
import { useMMKVNumber } from "react-native-mmkv";

export default function usePlayMidi() {
  const [assets] = useAssets([
    require("@/assets/audio/piano_fs2.mp3"),
    require("@/assets/audio/piano_c3.mp3"),
    require("@/assets/audio/piano_fs3.mp3"),
    require("@/assets/audio/piano_c4.mp3"),
    require("@/assets/audio/piano_fs4.mp3"),
  ]);
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pianoVolume] = useMMKVNumber("pianoVolume");
  const activeSoundsRef = useRef<{ envelope: GainNode; endTime: number; source: AudioBufferSourceNode }[]>([]);

  function calculateInterval(note1: string, note2: string): number {
    // Convert notes to their base note and octave
    const [base1, octave1] = [note1.replace(/[0-9]/g, "").toLowerCase(), parseInt(note1.match(/\d+/)?.[0] || "0")];
    const [base2, octave2] = [note2.replace(/[0-9]/g, "").toLowerCase(), parseInt(note2.match(/\d+/)?.[0] || "0")];

    // Define the chromatic scale
    const chromaticScale = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];

    const normalizeNote = (note: string) => {
      const flatToSharp: Record<string, string> = {
        db: "c#",
        eb: "d#",
        gb: "f#",
        ab: "g#",
        bb: "a#",
      };
      return flatToSharp[note] || note;
    };

    // Get positions in chromatic scale
    const pos1 = chromaticScale.indexOf(normalizeNote(base1.toLowerCase()));
    const pos2 = chromaticScale.indexOf(normalizeNote(base2.toLowerCase()));

    // Calculate total semitones considering octaves
    const semitones = pos2 - pos1 + (octave2 - octave1) * 12;

    // Return the absolute value of the interval
    return semitones;
  }

  async function loadAssets() {
    setLoading(true);

    await loadBuffers({
      "F#2": assets?.[0]?.localUri || "",
      C3: assets?.[1]?.localUri || "",
      "F#3": assets?.[2]?.localUri || "",
      C4: assets?.[3]?.localUri || "",
      "F#4": assets?.[4]?.localUri || "",
    });
    const buffersLoaded = validateBuffers();

    if (!buffersLoaded) {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (assets) {
      loadAssets();
    }
    return () => {
      audioContextRef.current?.close();
      // activeSoundsRef.current = [];
      // stopSong();
    };
  }, [assets]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSong();
        cleanupAudioResources();
        // if (audioContextRef.current) {
        //   audioContextRef.current.close();
        //   audioContextRef.current = undefined;
        // }
        activeSoundsRef.current = [];
      };
    }, [])
  );

  const bufferListRef = useRef<Record<string, AudioBuffer | null>>({
    "F#2": null,
    C3: null,
    "F#3": null,
    C4: null,
    "F#4": null,
  });
  const audioContextRef = useRef<AudioContext | null>(null);

  const validateBuffers = () => {
    const allBuffersLoaded = Object.values(bufferListRef.current).every((buffer) => buffer !== null);
    setBuffersLoaded(allBuffersLoaded);
    return allBuffersLoaded;
  };

  const stopSong = () => {
    // activeSoundsRef.current.forEach((envelope) => {
    //   envelope.envelope.disconnect();
    // });
    activeSoundsRef.current.forEach((sound) => {
      try {
        // sound.envelope.gain.cancelScheduledValues(audioContextRef.current?.currentTime || 0);
        sound.envelope.gain.setValueAtTime(0, audioContextRef.current?.currentTime || 0);
        sound.envelope.disconnect();
      } catch (error) {
        console.warn("Error cleaning up audio node:", error);
      }
    });
    activeSoundsRef.current = [];
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
          // console.log("LOADING BUFFER", key, filepath);
          if (audioContextRef?.current) {
            try {
              bufferListRef.current[key] = await audioContextRef.current.decodeAudioDataSource(filepath);
            } catch (error) {
              setError(true);
              console.error("Error loading buffer for", key, ":", error, filepath);
              bufferListRef.current[key] = null;
            }
          } else {
            setError(true);
            bufferListRef.current[key] = null;
            console.log("FAILED TO LOAD BUFFER - No audio context");
          }
        })
      );
      // validateBuffers();
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

  const cleanupAudioResources = () => {
    const currentTime = audioContextRef.current?.currentTime || 0;
    activeSoundsRef.current.forEach((sound) => {
      if (sound.endTime <= currentTime) {
        try {
          sound.envelope.disconnect();
          sound.source.disconnect();
        } catch (error) {
          console.warn("Error cleaning up audio node:", error);
        }
      }
    });
    activeSoundsRef.current = activeSoundsRef.current.filter((sound) => sound.endTime > currentTime);
  };

  const onKeyPressIn = (which: PianoKey, time: number, duration: number = 1, volume: number = 1) => {
    audioContextRef.current?.resume();
    if (!buffersLoaded) {
      console.warn("Buffers not fully loaded yet");
      return;
    }

    const aCtx = audioContextRef.current;

    if (!aCtx) {
      console.warn("No audio context");
      return;
    }

    const closestKey = getClosestNote(which) || "C3";

    const source = aCtx.createBufferSource();
    const envelope = aCtx.createGain();

    source.buffer = bufferListRef.current[closestKey];
    source.detune.value = calculateInterval(closestKey, which) * 100;

    const tNow = aCtx.currentTime;
    const endTime = tNow + time + duration + 0.5;

    activeSoundsRef.current.push({ envelope, endTime, source });

    envelope.gain.setValueAtTime(pianoVolume !== undefined ? pianoVolume : 1, tNow + time);
    envelope.gain.setValueAtTime(0, endTime);

    source.connect(envelope);
    envelope.connect(aCtx.destination);
    source.start(tNow + time);
    source.stop(endTime);

    setTimeout(() => {
      cleanupAudioResources();
    }, (endTime - tNow) * 1000);
  };

  const playSong = (song: { note: PianoKey; time: number; duration?: number }[], volume: number = 1) => {
    if (loading) {
      console.warn("Cannot play song - buffers not fully loaded");
      return;
    }
    stopSong();

    if (!audioContextRef.current) {
      console.warn("No audio context");
      return;
    }

    song.forEach(({ note, time, duration }) => {
      onKeyPressIn(note as PianoKey, time, duration, volume);
    });
  };

  return { playSong, stopSong, buffersLoaded, handleConvertSong, loading, error };
}
