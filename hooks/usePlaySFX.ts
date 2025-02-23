import { useAudioPlayer } from "expo-audio";
import { useMMKVNumber } from "react-native-mmkv";

export function usePlaySFX() {
  const [sfxVolume, setSfxVolume] = useMMKVNumber("sfxVolume");
  const audioPlayer = useAudioPlayer();

  const playSFX = (audioFile: number, volume: number = 0.5) => {
    audioPlayer.volume = sfxVolume !== undefined ? sfxVolume : 0.75;
    audioPlayer.replace(audioFile);
    audioPlayer.seekTo(0);
    audioPlayer.play();
  };
  return { playSFX };
}
