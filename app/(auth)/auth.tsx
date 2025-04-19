import { ChevronLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Paragraph, View, XStack, YStack } from "tamagui";
import Login from "./logIn";

export default function Auth() {
  return (
    <>
      <YStack backgroundColor={"$blue10"}>
        {/* <SafeAreaView edges={["top"]} /> */}
        <XStack position="relative" justifyContent="space-between" alignItems="center" padding="$4">
          <View width={"$3"} height={"$3"} themeInverse alignItems="center" justifyContent="center" onPress={() => router.back()}>
            <ChevronLeft size={"$2"} color={"white"} />
          </View>
          <Paragraph fontSize={"$6"} color={"white"} fontWeight={800}>
            Log in
          </Paragraph>
          <View width={"$3"} height={"$3"}></View>
        </XStack>
      </YStack>
      <View flex={1} padding="$4">
        <Login />
      </View>
    </>
  );
}
