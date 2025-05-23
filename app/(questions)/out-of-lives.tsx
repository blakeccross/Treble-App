import { QuizContext } from "@/context/quiz-context";
import { useUser } from "@/context/user-context";
import { Check, Heart, HeartCrack, Star, Gamepad } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import Purchases from "react-native-purchases";
import { Button, H2, H3, H4, ListItem, Paragraph, Separator, Theme, View, XStack, YGroup, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function Index() {
  const router = useRouter();
  const { redirectPathname, redirectParams } = useLocalSearchParams<{ redirectPathname?: string; redirectParams?: string }>();
  const { currentUser, handleUpdateUserInfo, livesRefreshTime } = useUser();

  function handleExitSection() {
    if (redirectPathname && redirectParams) {
      router.dismissTo({
        pathname: redirectPathname as any,
        params: JSON.parse(redirectParams as string),
      });
    } else {
      router.dismiss();
    }
  }
  async function handleTryForFree() {
    if (await Purchases.isConfigured()) {
      const offerings = await Purchases.getOfferings();
      const { customerInfo } = await Purchases.purchasePackage(offerings.all.monthly_test.availablePackages[0]);
      if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
        await handleUpdateUserInfo({ is_subscribed: true });
        router.dismiss();
      }
    }
  }
  return (
    <View backgroundColor="$background" flex={1}>
      {!currentUser?.is_subscribed ? (
        <>
          <View flex={1} justifyContent="center" alignItems="center">
            <HeartCrack color={"$red10"} size={"$10"} />
            <H2>You are out of lives!</H2>
            {livesRefreshTime && (
              <>
                <Paragraph>Lives will not reset until</Paragraph>
                <Paragraph>{moment(livesRefreshTime).format("h:mm a")}</Paragraph>
              </>
            )}
          </View>

          <View padding="$4" flex={1} height={"100%"} justifyContent="space-between">
            <H4 marginBottom={"$4"} fontWeight={800} textAlign="center">
              Unlock your learning potential
            </H4>

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

            <View>
              <Button onPress={handleTryForFree} fontWeight={800}>
                Try for $0.00
              </Button>
              <Button unstyled color={"$gray12"} textAlign="center" padding="$4" onPress={handleExitSection}>
                No Thanks
              </Button>
            </View>
          </View>
        </>
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
    </View>
  );
}
