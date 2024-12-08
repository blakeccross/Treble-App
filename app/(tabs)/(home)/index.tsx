import { Dimensions, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Card, Button, H1, H2, H3, Paragraph, Progress, ScrollView, XStack, YStack, View, H5, H4, CardBackground } from "tamagui";
import { ChevronRight, Flame, Gem, Music, Star, StarFull, Trophy } from "@tamagui/lucide-icons";
import { Link, router } from "expo-router";
import { ModuleContext } from "@/context/module-context";
import React, { useContext, useEffect, useState } from "react";
import { blue, darkColors, grayA, orange, orangeA, red, whiteA, yellow, yellowA } from "@tamagui/themes";
import { LinearGradient } from "tamagui/linear-gradient";
import { BlurView } from "expo-blur";
import { UserContext } from "@/context/user-context";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useMMKVNumber } from "react-native-mmkv";
import TrebleLogo from "@/assets/trebleLogo";
import StripedPattern from "@/components/stripedPattern";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import Purchases from "react-native-purchases";
import Paywall from "@/app/paywall";

export default function HomeScreen() {
  const { modules } = useContext(ModuleContext);
  const { currentUser } = useContext(UserContext);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const screenWidth = Dimensions.get("window").width;
  const [openPaywall, setOpenPaywall] = useState(false);

  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    /*
      Initialize the RevenueCat Purchases SDK.

      - observerMode is false, so Purchases will automatically handle finishing transactions. Read more about Observer Mode here: https://docs.revenuecat.com/docs/observer-mode

      - useAmazon is false, so it will use the Play Store in Android and App Store in iOS by default.
      */
    Purchases.configure({ apiKey: "appl_zZGUxbBzchveUkWXlMPDeuztdeD", appUserID: currentUser?.id, useAmazon: false });

    if (!currentUser?.purchased_products.length) {
      setOpenPaywall(true);
    }
  }, []);

  return (
    <>
      <LinearGradient
        colors={["$blue10", "$blue8"]}
        borderBottomWidth={1}
        borderBottomColor={"$gray8"}
        start={[0.3, 1]}
        end={[0, 0]}
        padding="$5"
        paddingTop="$0"
        paddingBottom="$4"
      >
        <SafeAreaView edges={["right", "left", "top"]} />

        <XStack gap="$2" justifyContent="space-between" alignItems="center">
          <View width={"$10"} alignItems="flex-start">
            <Link asChild href={"/profile"}>
              <Avatar circular size="$3.5" pressStyle={{ scale: 0.95 }}>
                {currentUser?.avatar_url && <Avatar.Image accessibilityLabel="Cam" src={currentUser?.avatar_url} />}
                <Avatar.Fallback backgroundColor="$blue2" />
                <FontAwesome6 name="user-large" size={20} color={blue.blue7} />
              </Avatar>
            </Link>
          </View>

          <View width={80} height={40}>
            <TrebleLogo />
          </View>

          <XStack alignItems="center" justifyContent="flex-end" gap="$2" width={"$10"}>
            <AntDesign name="star" size={24} color={yellow.yellow10} />
            <H5 color={"$background"} fontWeight={600}>
              {currentUser?.total_xp}
            </H5>
          </XStack>
        </XStack>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <XStack $sm={{ flexDirection: "column" }} padding="$3" gap="$3">
          {modules.loading
            ? [...Array(6)].map((item, index) => (
                <Card key={index} elevate borderRadius="$8" pressStyle={{ scale: 0.95 }} animation="bouncy" height={"$10"}>
                  <Card.Background borderRadius="$8">
                    <SkeletonLoader width={"100%"} height={"100%"} backgroundColor={grayA.grayA3} />
                  </Card.Background>
                </Card>
              ))
            : modules.data &&
              modules.data.map((module) => (
                <Link href={`/module-overview/${module?.id}`} asChild key={module.id}>
                  <Card borderRadius="$8" pressStyle={{ scale: 0.95 }} animation="bouncy" backgroundColor={"$blue1"}>
                    <Card.Header padding="$4">
                      <XStack gap="$4" flex={1}>
                        <View position="relative">
                          <Image
                            style={{ width: screenWidth * 0.2, height: screenWidth * 0.2, borderRadius: 10 }}
                            source={module.local_poster_uri}
                            placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={1000}
                          />
                          {module.completed && (
                            <View position="absolute" right={"$-2"} top={"$-2"}>
                              <StarFull fill={yellowA.yellowA10} color={"$yellow10"} />
                            </View>
                          )}
                        </View>

                        <YStack gap="$4" flex={1}>
                          <XStack justifyContent="space-between">
                            <XStack gap="$4" flex={1}>
                              <YStack>
                                <Paragraph size={"$2"}>{"Chapter " + module.id}</Paragraph>
                                <H3 fontWeight={600}>{module.title}</H3>
                                {module.completed && <Paragraph color={"$blue10"}>Completed</Paragraph>}
                              </YStack>
                            </XStack>
                            {module.progress !== 0 && <ChevronRight color={"$blue10"} />}
                          </XStack>
                          {module.progress !== 0 && !module.completed && (
                            <Progress value={module.progress} backgroundColor={"$gray3"}>
                              <Progress.Indicator animation="lazy" backgroundColor={"$blue10"} />
                            </Progress>
                          )}
                        </YStack>
                      </XStack>
                    </Card.Header>
                  </Card>
                </Link>
              ))}
        </XStack>
        <Paywall openPaywall={openPaywall} setOpenPaywall={setOpenPaywall} />
      </ScrollView>
    </>
  );
}
