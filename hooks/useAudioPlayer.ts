import { Audio } from "expo-av";
import { useMMKVNumber } from "react-native-mmkv";

export default function useAudioPlayer() {
  const [sfxVolume, setSfxVolume] = useMMKVNumber("sfxVolume");

  const playAudio = async (audioFile: number, volume: number = 0.5) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      await sound.setVolumeAsync(sfxVolume !== undefined ? sfxVolume : 0.75);

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing SFX:", error);
    }
  };
  return { playAudio };
}
