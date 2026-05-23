import TrebleLogo from "@/assets/trebleLogo";
import { Button } from "@/components/button";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { H3, LinearGradient, Paragraph, View, YStack } from "@/ui";

export default function WelcomePage() {
  return (
    <View flex={1} backgroundColor="$background">
      <LinearGradient
        flex={1}
        width="100%"
        colors={["#00368e", "#0b1169"]}
        start={[0.15, 0]}
        end={[0.85, 1]}
      >
        <View flex={1} justifyContent="center" alignItems="center">
          <LottieView
            source={require("@/assets/lottie/floatingMusicNotes.json")}
            autoPlay
            loop
            style={{ width: "100%", height: "100%", opacity: 0.85 }}
          />
          <View position="absolute" width={200} height={200}>
            <TrebleLogo />
          </View>
        </View>
        <BlurView
          intensity={70}
          tint="default"
          style={{
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            overflow: "hidden",
            borderTopWidth: StyleSheet.hairlineWidth * 2,
            borderLeftWidth: StyleSheet.hairlineWidth * 2,
            borderRightWidth: StyleSheet.hairlineWidth * 2,
            borderColor: "rgba(60, 60, 67, 0.10)",
          }}
        >
          <YStack
            gap="$4"
            paddingTop="$6"
            paddingHorizontal="$5"
            paddingBottom="$3"
          >
            <YStack justifyContent="center" alignItems="center" gap="$2">
              <H3
                textAlign="center"
                fontWeight="normal"
                style={{ color: "white" }}
              >
                Welcome to Treble
              </H3>
              <View maxWidth={440} alignSelf="center">
                <Paragraph textAlign="center" style={{ color: "white" }}>
                  The clearest way to build real music theory skills — from
                  anywhere.
                </Paragraph>
              </View>
            </YStack>
            <Link
              asChild
              href={{ pathname: "/(auth)/signUp", params: { type: "signup" } }}
            >
              <Button>Sign Up</Button>
            </Link>
            <Link
              asChild
              href={{ pathname: "/(auth)/auth", params: { type: "login" } }}
            >
              <Button unstyled textAlign="center" color="white">
                Log in
              </Button>
            </Link>
          </YStack>
          <SafeAreaView />
        </BlurView>
      </LinearGradient>
    </View>
  );
}
