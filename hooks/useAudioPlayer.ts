import { AudioContext } from "react-native-audio-api";
import { Asset, useAssets } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { AVPlaybackSource, Audio } from "expo-av";

export default function useAudioPlayer() {
  //   const [assets] = useAssets([require("@/assets/audio/fx/shuffle.mp3")]);

  const getAudioFileURI = (audioFileURI: number) => {
    // console.log("ASSETS", assets);
    return "";
  };

  const playAudio = async (audioFile: number, volume: number = 0.5) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      await sound.setVolumeAsync(volume);

      // if (interrupt) {
      //   setSound(sound);
      // }

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing SFX:", error);
    }
  };
  return { playAudio };
}
