import { Button } from "@/components/button";
import { Link } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { H1, H3, Paragraph, View, YStack } from "tamagui";

import { LinearGradient } from "tamagui/linear-gradient";

export default function LandingPage() {
  return (
    <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <SafeAreaView style={{ flex: 1 }}>
        <View flex={1}></View>
        <YStack gap="$4" marginBottom="$6">
          <YStack>
            <H3 color={"$background"} textAlign="center" fontWeight={600}>
              Welcome to Treble!
            </H3>
            <Paragraph color={"$background"} textAlign="center">
              The best way to learn music theory from anywhere!
            </Paragraph>
          </YStack>
          <Link asChild href={"/(auth)/log-in"}>
            <Button white>Log in</Button>
          </Link>
          <Button themeInverse>Sign Up</Button>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
