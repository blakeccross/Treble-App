import { Check, Gamepad, Heart, Star, X } from "@tamagui/lucide-icons";
import { blue } from "@tamagui/themes";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Linking } from "react-native";
import Purchases from "react-native-purchases";
import { Button, H2, H4, ListItem, Paragraph, Separator, SizableText, Theme, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import TrebleLogo from "../assets/trebleLogo";
import { UserContext } from "../context/user-context";
import { isSmallScreen } from "@/utils";

export default function Paywall() {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTryForFree() {
    setIsLoading(true);
    try {
      if (await Purchases.isConfigured()) {
        const offerings = await Purchases.getOfferings();
        const { customerInfo } = await Purchases.purchasePackage(offerings.all.monthly_test.availablePackages[0]);
        if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
          await handleUpdateUserInfo({ is_subscribed: true });
          router.dismissAll();
        }
      }
    } catch (error) {
      Alert.alert("Error purchasing", "Please try again later or contact support", [
        {
          text: "OK",
          onPress: () => {},
        },
        {
          text: "Help",
          onPress: () => {
            router.replace("/(settings)/help");
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRestorePurchase() {
    try {
      await Purchases.restorePurchases();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {!currentUser?.is_subscribed ? (
        <LinearGradient flex={1} colors={[blue.blue11, blue.blue12]} start={[0.5, 1]} end={[0, 0]}>
          {isLoading ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View paddingHorizontal="$4" flex={1} height={"100%"} justifyContent="space-between">
              <View position="absolute" top="$4" right="$4" zIndex={1}>
                <Button
                  circular
                  backgroundColor={"$gray1"}
                  size={"$2"}
                  pressStyle={{ backgroundColor: "$gray2" }}
                  onPress={() => router.dismissAll()}
                >
                  <X size="$1" color={"$gray12"} />
                </Button>
              </View>
              <ScrollView>
                <View justifyContent="flex-start" alignItems="center">
                  <LottieView
                    autoPlay
                    loop={false}
                    style={{
                      width: isSmallScreen ? "100%" : "50%",
                      aspectRatio: 2.5 / 2,
                    }}
                    source={require("@/assets/lottie/gopro.json")}
                  />
                </View>
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
                      subTitle={<Paragraph opacity={0.6}>Never have to stop and wait to continue learning</Paragraph>}
                    />
                    <ListItem
                      backgroundColor={"transparent"}
                      icon={Star}
                      title="Unlock All Modules"
                      subTitle={<Paragraph opacity={0.6}>Begin learning beyond the basics</Paragraph>}
                    />

                    <ListItem
                      backgroundColor={"transparent"}
                      icon={Gamepad}
                      title="Unlock All Games"
                      subTitle={<Paragraph opacity={0.6}>Train your ear with fun games</Paragraph>}
                    />
                  </BlurView>
                </Theme>
              </ScrollView>
              <View>
                <Button
                  borderWidth={1}
                  borderColor={"white"}
                  backgroundColor={"transparent"}
                  fontWeight={800}
                  fontSize={"$6"}
                  onPress={handleTryForFree}
                >
                  Try for $0.00
                </Button>
                <Paragraph fontSize={"$1"} marginTop="$2" themeInverse textAlign="center" opacity={0.6}>
                  3 days for free, then $3.99/month
                </Paragraph>
                <Button marginTop="$2" unstyled color={"$gray12Dark"} textAlign="center" padding="$4" onPress={handleRestorePurchase}>
                  Restore Purchase
                </Button>
                <XStack justifyContent="center" alignItems="center" gap="$4">
                  <Paragraph
                    marginTop="$2"
                    themeInverse
                    textAlign="center"
                    opacity={0.6}
                    onPress={() => Linking.openURL("https://treblemusictheory.vercel.app/privacy-policy")}
                    style={{ textDecorationLine: "underline" }}
                  >
                    Privacy Policy
                  </Paragraph>
                  <Paragraph
                    marginTop="$2"
                    themeInverse
                    textAlign="center"
                    opacity={0.6}
                    onPress={() => Linking.openURL("https://treblemusictheory.vercel.app/terms")}
                    style={{ textDecorationLine: "underline" }}
                  >
                    Terms of Service
                  </Paragraph>
                </XStack>
                {/* <Button unstyled color={"$gray12Dark"} textAlign="center" padding="$4" onPress={() => router.dismissAll()}>
                  No Thanks
                </Button> */}
                <SafeAreaView />
              </View>
            </View>
          )}
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
