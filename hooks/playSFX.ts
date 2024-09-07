import { AVPlaybackSource, Audio } from "expo-av";
import { useEffect, useState } from "react";

export async function playSFX(audioFile: AVPlaybackSource, interrupt?: boolean) {
    const [sound, setSound] = useState<Audio.Sound>();
    const { sound: sfx } = await Audio.Sound.createAsync(audioFile);

    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);
      
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    if (interrupt) {
      setSound(sfx);
    }

    await sfx.playAsync();
  }