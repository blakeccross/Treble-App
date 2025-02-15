import { AudioBuffer, AudioContext, GainNode } from "react-native-audio-api";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";
import { act, useEffect, useRef, useState } from "react";
import { Asset, useAssets } from "expo-asset";
import { PianoKey } from "@/types/pianoKeys";
import { delay } from "@/utils/delay";

type PR<V> = Partial<Record<PianoKey, V>>;

export default function usePlayMidi() {
  const [assets] = useAssets([
    require("../assets/audio/piano_fs2.mp3"),
    require("../assets/audio/piano_c3.mp3"),
    require("../assets/audio/piano_fs3.mp3"),
    require("../assets/audio/piano_c4.mp3"),
    require("../assets/audio/piano_fs4.mp3"),
  ]);

  const [buffersLoaded, setBuffersLoaded] = useState(false);

  const sourceList = {
    "F#2": assets && assets[0].uri,
    C3: assets && assets[1].uri,
    "F#3": assets && assets[2].uri,
    C4: assets && assets[3].uri,
    "F#4": assets && assets[4].uri,
  };

  const bufferListRef = useRef<Record<string, AudioBuffer | null>>({
    "F#2": null,
    C3: null,
    "F#3": null,
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
    // audioContextRef.current?.close();
    // audioContextRef.current = undefined;
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

  useEffect(() => {
    if (Object.entries(sourceList)?.every((asset) => asset[1])) {
      loadBuffers();
    }
    // return () => {
    //   if (audioContextRef.current) audioContextRef.current?.close();
    // };
  }, [assets]);

  async function loadBuffers() {
    audioContextRef.current = new AudioContext();
    try {
      await Promise.all(
        Object.entries(sourceList).map(async ([key, url]) => {
          bufferListRef.current[key] = await FileSystem.downloadAsync(
            url as string,
            `${FileSystem.documentDirectory}/${key.replace("#", "s")}.mp3`
          ).then(({ uri }) => {
            if (audioContextRef?.current && audioContextRef.current?.decodeAudioDataSource)
              return audioContextRef.current?.decodeAudioDataSource(uri);
            else {
              console.log("FAILED TO LOAD BUFFER");
              return null;
            }
          });
        })
      );
      validateBuffers();
    } catch (error) {
      console.error("Error loading buffers:", error);
      setBuffersLoaded(false);
    }
  }

  const onKeyPressIn = (which: PianoKey, time: number, duration?: number, volume: number) => {
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
    const endTime = tNow + time + (duration ?? 5) + 0.5;
    // Attack (fade-in)
    envelope.gain.setValueAtTime(0.001, tNow + time);
    envelope.gain.exponentialRampToValueAtTime(volume, tNow + time + 0.01);
    // Decay (fade-out) before stopping
    //envelope.gain.exponentialRampToValueAtTime(0.001, endTime);
    envelope.gain.setValueAtTime(0, endTime - 0.05);

    source.connect(envelope);
    // source.connect(gainRef.current!);
    envelope.connect(aCtx.destination);
    source.start(tNow + time);
    source.stop(endTime);
  };

  const playSong = (song: { note: PianoKey; time: number; duration?: number }[], volume: number = 1) => {
    if (!buffersLoaded) {
      console.warn("Cannot play song - buffers not fully loaded");
      return;
    }

    song.forEach(({ note, time, duration }) => {
      onKeyPressIn(note as PianoKey, time, duration, volume);
    });
  };

  return { playSong, stopSong, buffersLoaded };
}
