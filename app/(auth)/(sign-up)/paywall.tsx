import { Check, Gamepad, Heart, Star } from "@tamagui/lucide-icons";
import { blue } from "@tamagui/themes";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Purchases from "react-native-purchases";
import { Button, H2, H4, ListItem, Paragraph, SizableText, Theme, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import TrebleLogo from "../../../assets/trebleLogo";
import { useUser } from "../../../context/user-context";

export default function Paywall() {
  const { currentUser, handleUpdateUserInfo } = useUser();

  async function handleTryForFree() {
    if (await Purchases.isConfigured()) {
      const offerings = await Purchases.getOfferings();
      const { customerInfo } = await Purchases.purchasePackage(offerings.all.monthly_test.availablePackages[0]);
      if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
        await handleUpdateUserInfo({ is_subscribed: true });
        router.dismiss();
        // setOpenPaywall(false);
      }
    }
  }

  return (
    <>
      {!currentUser?.is_subscribed ? (
        <LinearGradient flex={1} colors={[blue.blue11, blue.blue12]} start={[0.5, 1]} end={[0, 0]}>
          <SafeAreaView />
          <View justifyContent="flex-start" alignItems="center">
            <LottieView
              autoPlay
              loop={false}
              style={{
                width: "100%",
                aspectRatio: 2.5 / 2,
              }}
              source={require("@/assets/lottie/gopro.json")}
            />
          </View>
          <View paddingHorizontal="$4" flex={1} height={"100%"} justifyContent="space-between">
            <ScrollView>
              <XStack gap="$2" justifyContent="center" alignItems="center">
                <TrebleLogo width={100} height={50} />
                <LinearGradient colors={["$blue10", "$purple7"]} start={[0.3, 1]} end={[0, 0]} paddingHorizontal="$3" borderRadius="$10">
                  <SizableText color={"$background"}>Pro</SizableText>
                </LinearGradient>
              </XStack>
              <H4 marginBottom={"$4"} color={"white"} fontWeight={800} textAlign="center">
                Unlock your learning potential
              </H4>

              <Theme name="dark">
                <BlurView intensity={100} style={{ borderRadius: 20, overflow: "hidden" }}>
                  <ListItem
                    backgroundColor={"transparent"}
                    icon={Heart}
                    title="Unlimited Hearts"
                    subTitle="Never have to stop and wait to continue learning"
                  />
                  <ListItem backgroundColor={"transparent"} icon={Star} title="Unlock All Modules" subTitle="Begin learning beyond the basics" />

                  <ListItem backgroundColor={"transparent"} icon={Gamepad} title="Unlock All Games" subTitle="Train your ear with fun games" />
                </BlurView>
              </Theme>
            </ScrollView>
            <View>
              <Button borderWidth={1} borderColor={"white"} backgroundColor={"transparent"} fontWeight={800} onPress={handleTryForFree}>
                Try 2 weeks for free
              </Button>
              <Button unstyled color={"$gray12Dark"} textAlign="center" padding="$4" onPress={() => router.replace("/(tabs)/(home)")}>
                No Thanks
              </Button>
              <SafeAreaView />
            </View>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
          <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
            <XStack gap="$2">
              <Paragraph color={"$background"}>Success!</Paragraph>
              <Check color={"$background"} size={"$1"} />
            </XStack>
            <H2
              key={0}
              color={"$background"}
              textAlign="center"
              fontWeight={800}
              enterStyle={{
                scale: 3,
                y: -10,
                opacity: 0,
              }}
              opacity={1}
              scale={1}
              y={0}
              // animation="lazy"
            >
              Welcome to the Treble Pro!
            </H2>
          </YStack>
          <Button onPress={() => router.dismiss()} fontWeight={600} fontSize={"$7"} height={"$5"} width={"100%"} themeInverse>
            Continue
          </Button>

          <SafeAreaView />
        </LinearGradient>
      )}
    </>
  );
}
