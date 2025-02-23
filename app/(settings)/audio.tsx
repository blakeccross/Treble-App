import { Pause, Play, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Button, H5, Label, Slider, SliderProps, View, XStack, YStack } from "tamagui";
import { clairdelune, hedwigTheme, flyingTheme } from "../../constants/demoSongs";
import usePlayMidi from "../../hooks/usePlayMidi";
import { useMMKVNumber } from "react-native-mmkv";

export default function AudioSettings() {
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

  function SimpleSlider({ children, ...props }: SliderProps) {
    return (
      <Slider defaultValue={[50]} max={100} {...props}>
        <Slider.Track backgroundColor="$gray5">
          <Slider.TrackActive backgroundColor="$blue10" />
        </Slider.Track>
        <Slider.Thumb size="$2" index={0} circular />
        {children}
      </Slider>
    );
  }

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
      <View padding="$4" gap="$4">
        <View>
          <Label>Test Audio</Label>
          <Button fontWeight={800} onPress={isPlaying ? handleStopAudio : handleTestAudio}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </View>
        <View>
          <Label>Piano Volume</Label>
          <SimpleSlider
            defaultValue={[pianoVolume !== undefined ? pianoVolume : 1]}
            min={0.5}
            max={2.5}
            step={0.2}
            width={"100%"}
            onValueChange={(value) => setPianoVolume(value[0])}
          />
        </View>
        <View>
          <Label>SFX Volume</Label>
          <SimpleSlider
            defaultValue={[sfxVolume !== undefined ? sfxVolume : 0.75]}
            min={0.2}
            max={1}
            step={0.2}
            width={"100%"}
            onValueChange={(value) => setSfxVolume(value[0])}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
