import { Pause, Play, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Linking } from "react-native";
import { Button, H5, Label, Slider, SliderProps, View, XStack, YStack, Input, Form, TextArea, Paragraph } from "tamagui";
import { clairdelune, hedwigTheme, flyingTheme } from "../../constants/demoSongs";
import usePlayMidi from "../../hooks/usePlayMidi";
import { useMMKVNumber } from "react-native-mmkv";

export default function HelpSettings() {
  const { playSong, stopSong, handleConvertSong } = usePlayMidi();
  const [pianoVolume, setPianoVolume] = useMMKVNumber("pianoVolume");
  const [sfxVolume, setSfxVolume] = useMMKVNumber("sfxVolume");
  const [isPlaying, setIsPlaying] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSendEmail = () => {
    const email = "support@treble.app"; // Replace with your actual support email
    const mailtoUrl = `mailto:blakec.cross@gmail.com?subject=${encodeURIComponent("Treble Support")}&body=${encodeURIComponent(message)}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView>
      <YStack padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismissTo("/(settings)/settings")}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Help</H5>
          <View width={"$3"} />
        </XStack>
      </YStack>
      <View padding="$4" gap="$4">
        <Form onSubmit={handleSendEmail}>
          <YStack space="$4">
            {/* <YStack>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter subject" value={subject} onChangeText={setSubject} />
            </YStack> */}
            <Paragraph>
              If you have any questions or feedback, please fill out the form below and we will get back to you as soon as possible.
            </Paragraph>

            <YStack>
              <Label htmlFor="message">Message</Label>
              <TextArea
                minHeight={"$10"}
                id="message"
                placeholder="How can we help you?"
                value={message}
                onChangeText={setMessage}
                numberOfLines={4}
              />
            </YStack>

            <Button onPress={handleSendEmail} theme="active">
              Send Email
            </Button>
          </YStack>
        </Form>
      </View>
    </SafeAreaView>
  );
}
