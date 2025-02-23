import { X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Button, H5, Paragraph, View, XStack, YStack } from "tamagui";
import usePlayMidi from "../../hooks/usePlayMidi";
import { clairdelune } from "../../constants/progressions/clairdelune";
import { Asset } from "expo-asset";
import { useUser } from "../../context/user-context";

export default function AudioSettings() {
  const [buffersLoaded, setBuffersLoaded] = useState<Record<string, string | null>>({});
  const { playSong, stopSong } = usePlayMidi();
  const { setLives } = useUser();
  function handleTestAudio() {
    const convertedNotes = clairdelune.map((note) => ({
      duration: note.end - note.start,
      note: note.name as any,
      time: note.start,
    }));
    playSong(convertedNotes.slice(0, 20));
  }
  // async function loadAssets() {
  //   const pianoFs2 = await Asset.loadAsync(require("../../assets/audio/piano_fs2.mp3"));
  //   const pianoC3 = await Asset.loadAsync(require("../../assets/audio/piano_c3.mp3"));
  //   const pianoFs3 = await Asset.loadAsync(require("../../assets/audio/piano_fs3.mp3"));
  //   const pianoC4 = await Asset.loadAsync(require("../../assets/audio/piano_c4.mp3"));
  //   const pianoFs4 = await Asset.loadAsync(require("../../assets/audio/piano_fs4.mp3"));

  //   setBuffersLoaded({
  //     "F#2": pianoFs2[0].localUri,
  //     C3: pianoC3[0].localUri,
  //     "F#3": pianoFs3[0].localUri,
  //     C4: pianoC4[0].localUri,
  //     "F#4": pianoFs4[0].localUri,
  //   });
  // }

  // useEffect(() => {
  //   loadAssets();
  // }, []);

  return (
    <SafeAreaView>
      <YStack padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismissTo("/(settings)")}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Audio</H5>
          <View width={"$3"} />
        </XStack>
      </YStack>
      <View padding="$4">
        <Button onPress={handleTestAudio}>Test Audio</Button>
        <Button onPress={() => setLives(5)}>Add 5 Hearts</Button>
        <YStack gap="$1"></YStack>
      </View>
    </SafeAreaView>
  );
}
