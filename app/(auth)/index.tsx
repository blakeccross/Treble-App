import TrebleLogo from "@/assets/trebleLogo";
import { Button } from "@/components/button";
import { UserContext } from "@/context/user-context";
import { BlurView } from "expo-blur";
import { Link, Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { H1, H3, Paragraph, View, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function WelcomePage() {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  if (currentUser) return <Redirect href={"/(tabs)"} />;
  // else return <Redirect href={"/(tabs)"} />;
  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]}>
      <View flex={1} justifyContent="center" alignItems="center">
        <LottieView source={require("@/assets/lottie/floatingMusicNotes.json")} autoPlay loop style={{ width: "100%", height: "100%" }} />
        <View position="absolute" width={200} height={200}>
          <TrebleLogo />
        </View>
      </View>
      <BlurView intensity={100} tint="prominent" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <YStack gap="$4" paddingTop="$6" paddingHorizontal={"$4"}>
          <YStack justifyContent="center" alignItems="center">
            <H3 textAlign="center" fontWeight={800}>
              Welcome to Treble!
            </H3>
            <Paragraph textAlign="center" maxWidth={"$17"}>
              The best way to learn music theory from anywhere
            </Paragraph>
          </YStack>
          <Link asChild href={{ pathname: "/(auth)/auth", params: { type: "signup" } }}>
            <Button>Sign Up</Button>
          </Link>
          <Link asChild href={{ pathname: "/(auth)/auth", params: { type: "login" } }}>
            <Button unstyled textAlign="center" color={"$gray12"}>
              Log in
            </Button>
          </Link>
        </YStack>
        <SafeAreaView />
      </BlurView>
    </LinearGradient>
  );
}
