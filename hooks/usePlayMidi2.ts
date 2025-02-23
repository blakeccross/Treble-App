// import { PianoKey } from "@/types/pianoKeys";
// import { AudioPlayer, createAudioPlayer, setAudioModeAsync, setIsAudioActiveAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
// import { useEffect, useState } from "react";
// import { Image } from "expo-image";
// import { useAssets } from "expo-asset";
// const cNote = require("../assets/audio/piano_c3.mp3");

// export default function usePlayMidi() {
//   // const [assets] = useAssets([
//   //   require("../assets/audio/piano_fs2.mp3"),
//   //   require("../assets/audio/piano_c3.mp3"),
//   //   require("../assets/audio/piano_fs3.mp3"),
//   //   require("../assets/audio/piano_c4.mp3"),
//   //   require("../assets/audio/piano_fs4.mp3"),
//   // ]);
//   const sourceList = {
//     "F#2": useAudioPlayer(require("../assets/audio/piano_fs2.mp3")),
//     C3: useAudioPlayer(require("../assets/audio/piano_c3.mp3")),
//     "F#3": useAudioPlayer(require("../assets/audio/piano_fs3.mp3")),
//     C4: useAudioPlayer(require("../assets/audio/piano_c4.mp3")),
//     "F#4": useAudioPlayer(require("../assets/audio/piano_fs4.mp3")),
//   };
//   const [buffersLoaded, setBuffersLoaded] = useState(false);

//   const stopSong = () => {
//     console.log("STOPPING SONG");
//     // audioContextRef.current?.close();
//     // audioContextRef.current = undefined;
//   };

//   const getClosestNote = (note: PianoKey): PianoKey | null => {
//     const targetFrequency = getFrequency(note);
//     if (targetFrequency === null) return null;

//     let closestNote: keyof typeof sourceList | null = null;
//     let closestFrequencyDiff = Infinity;

//     Object.keys(sourceList).forEach((key) => {
//       const frequency = getFrequency(key);
//       if (frequency !== null) {
//         const frequencyDiff = Math.abs(targetFrequency - frequency);
//         if (frequencyDiff < closestFrequencyDiff) {
//           closestFrequencyDiff = frequencyDiff;
//           closestNote = key as keyof typeof sourceList;
//         }
//       }
//     });

//     return closestNote;
//   };

//   function getFrequency(note: string): number | null {
//     const noteRegex = /^([A-Ga-g])(#|b)?(-?\d+)$/;
//     const match = note.match(noteRegex);
//     if (!match) return null; // Invalid input

//     const [, base, accidental, octaveStr] = match;
//     const octave = parseInt(octaveStr, 10);
//     // Note order in an octave
//     const noteOrder: { [key: string]: number } = {
//       C: 0,
//       "C#": 1,
//       Db: 1,
//       D: 2,
//       "D#": 3,
//       Eb: 3,
//       E: 4,
//       F: 5,
//       "F#": 6,
//       Gb: 6,
//       G: 7,
//       "G#": 8,
//       Ab: 8,
//       A: 9,
//       "A#": 10,
//       Bb: 10,
//       B: 11,
//     };

//     const fullNote = accidental ? base.toUpperCase() + accidental : base.toUpperCase();
//     const semitone = noteOrder[fullNote];
//     if (semitone === undefined) return null;

//     // Calculate MIDI number
//     const midiNote = semitone + (octave + 1) * 12;

//     // Frequency calculation
//     const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
//     return frequency;
//   }

//   useEffect(() => {
//     Object.keys(sourceList).forEach((item) => {
//       const audioPlayer = sourceList[item as keyof typeof sourceList];
//       audioPlayer.shouldCorrectPitch = true;
//       audioPlayer.setAudioSamplingEnabled(true);
//       audioPlayer.volume = 5;
//     });
//     setIsAudioActiveAsync(true);
//   }, []);

//   const onKeyPressIn = (which: PianoKey, time: number, audioPlayer: AudioPlayer, duration?: number, volume: number = 1) => {
//     // const audio = new AudioPlayer({ assetId: require("../assets/audio/piano_c3.mp3") }, 500);
//     // let buffer = sourceList[which as keyof typeof sourceList];
//     let playbackRate = 1;
//     const closestKey = "C3";
//     const frequencyWhich = getFrequency(which);
//     const frequencyClosestKey = getFrequency(closestKey);
//     if (frequencyWhich && frequencyClosestKey) {
//       playbackRate = frequencyWhich / frequencyClosestKey;
//     }
//     // if (!buffer) {
//     //   const closestKey = getClosestNote(which) || "C3";
//     //   buffer = sourceList[closestKey as keyof typeof sourceList];
//     //   const frequencyWhich = getFrequency(which);
//     //   const frequencyClosestKey = getFrequency(closestKey);
//     //   if (frequencyWhich && frequencyClosestKey) {
//     //     playbackRate = frequencyWhich / frequencyClosestKey;
//     //   }
//     // }
//     // setAudioModeAsync()
//     // const audio = createAudioPlayer(cNote, 1);

//     setTimeout(() => {
//       audioPlayer.seekTo(0);
//       audioPlayer.shouldCorrectPitch = true;
//       audioPlayer.setPlaybackRate(playbackRate);
//       audioPlayer.play();
//     }, time * 1000);

//     // setTimeout(() => {
//     //   audio.remove();
//     // }, duration || 5 * 1000);

//     // setTimeout(() => {
//     //   buffer.setPlaybackRate(playbackRate);
//     //   buffer.seekTo(0);
//     //   buffer.play();
//     // }, time * 1000);
//   };

//   const playSong = (song: { note: PianoKey; time: number; duration?: number }[], volume: number = 1) => {
//     // if (!buffersLoaded) {
//     //   console.warn("Cannot play song - buffers not fully loaded");
//     //   return;
//     // }
//     const audioPlayers = song.map((item) => createAudioPlayer(cNote, 1));

//     song.forEach(({ note, time, duration }, index) => {
//       onKeyPressIn(note as PianoKey, time, audioPlayers[index], duration, volume);
//     });
//   };

//   return { playSong, stopSong, buffersLoaded };
// }
