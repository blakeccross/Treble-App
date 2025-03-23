import { Pause, Play, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Button, H5, Label, Slider, SliderProps, View, XStack, YStack } from "tamagui";
import { clairdelune, hedwigTheme, flyingTheme } from "../../constants/demoSongs";
import usePlayMidi from "../../hooks/usePlayMidi";
import { useMMKVNumber } from "react-native-mmkv";

export default function HelpSettings() {
  const { playSong, stopSong, handleConvertSong } = usePlayMidi();
  const [pianoVolume, setPianoVolume] = useMMKVNumber("pianoVolume");
  const [sfxVolume, setSfxVolume] = useMMKVNumber("sfxVolume");
  const [isPlaying, setIsPlaying] = useState(false);

  function handleTestAudio() {
    const songs = [clairdelune, hedwigTheme, flyingTheme];
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    playSong(handleConvertSong(randomSong).slice(0, 100));
    setIsPlaying(true);
  }

  function handleStopAudio() {
    stopSong();
    setIsPlaying(false);
  }

  return (
    <SafeAreaView>
      <YStack padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismissTo("/(settings)")}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Help</H5>
          <View width={"$3"} />
        </XStack>
      </YStack>
      <View padding="$4" gap="$4"></View>
    </SafeAreaView>
  );
}
