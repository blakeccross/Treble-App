import LoadingIndicator from "@/components/loading";
import Paywall from "@/components/paywall.modal";
import XPHistoryModal from "@/components/XPHistory.modal";
import { ModuleContext } from "@/context/module-context";
import { useUser } from "@/context/user-context";
import { XPHistory } from "@/types";
import { window } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ChevronRight, Heart, RefreshCw, StarFull } from "@tamagui/lucide-icons";
import { blue, red, yellow, yellowA } from "@tamagui/themes";
import { Image } from "expo-image";
import * as Network from "expo-network";
import { Link, Redirect, router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, useColorScheme } from "react-native";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, H3, H5, Paragraph, Progress, ScrollView, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function HomeScreen() {
  const { modules, refreshModules, isModuleUpdateAvailable } = useContext(ModuleContext);
  const [hasSeenWelcomeScreen, setHasSeenWelcomeScreen] = useMMKVBoolean("hasSeenWelcomeScreen");
  const { currentUser, lives } = useUser();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const screenWidth = Dimensions.get("window").width;
  const [openPaywall, setOpenPaywall] = useState(false);
  const [openXPHistory, setOpenXPHistory] = useState(false);
  const [xpHistory, setXPHistory] = useMMKVObject<XPHistory[]>("xp_history");
  const networkState = Network.useNetworkState();
  const colorScheme = useColorScheme();

  if (!hasSeenWelcomeScreen && !currentUser) {
    return <Redirect href={"/welcome"} />;
  }

  return (
    <>
      <LinearGradient
        colors={colorScheme === "light" ? ["$blue10", "$blue8"] : ["$blue3", "$blue5"]}
        start={[0.3, 1]}
        end={[0, 0]}
        zIndex={1}
        flex={1}
      >
        <View padding="$5" paddingTop={"$2"}>
          <SafeAreaView edges={["top"]} />

          <XStack gap="$2" justifyContent="space-between" alignItems="center">
            <View width={"$10"} alignItems="flex-start">
              {currentUser?.id ? (
                <Link asChild href={"/profile"}>
                  <Avatar circular size="$3.5" pressStyle={{ scale: 0.95 }}>
                    {currentUser?.avatar_url && <Avatar.Image accessibilityLabel="Cam" src={currentUser?.avatar_url} />}
                    <Avatar.Fallback backgroundColor="$blue2" />
                    <FontAwesome6 name="user-large" size={20} color={blue.blue7} />
                  </Avatar>
                </Link>
              ) : (
                <Link asChild href={"/(auth)/welcome"}>
                  <Paragraph color={"white"} textDecorationLine="underline">
                    Log in / Sign up
                  </Paragraph>
                </Link>
              )}
            </View>

            <XStack gap="$3" onPress={() => router.push("/hearts")}>
              {!currentUser?.is_subscribed && (
                <XStack gap="$1.5" alignItems="center">
                  <Heart size="$1.5" color={"$red10"} fill={red.red10} />
                  <H5 color={"white"} fontWeight={600}>
                    {lives}
                  </H5>
                </XStack>
              )}

              <XStack alignItems="center" justifyContent="flex-end" gap="$1.5" onPress={() => setOpenXPHistory(true)}>
                <AntDesign name="star" size={24} color={yellow.yellow10} />
                <H5 color={"white"} fontWeight={600}>
                  {currentUser?.total_xp || 0}
                </H5>
              </XStack>
            </XStack>
          </XStack>
        </View>

        <XPHistoryModal openXPHistory={openXPHistory} setOpenXPHistory={setOpenXPHistory} xpHistory={xpHistory} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          flex={1}
          borderTopLeftRadius={"$10"}
          borderTopRightRadius={"$10"}
          zIndex={1}
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y < -200 && !modules?.loading && networkState.isConnected) {
              // Adjust threshold as needed
              refreshModules();
            }
          }}
          scrollEventThrottle={16}
        >
          <View backgroundColor={"$background"} flex={1} overflow="hidden" borderTopLeftRadius={"$10"} borderTopRightRadius={"$10"} paddingTop={"$1"}>
            {!networkState.isConnected && (
              <View>
                <Paragraph textAlign="center" marginTop={"$2"}>
                  You are offline
                </Paragraph>
              </View>
            )}

            <XStack $sm={{ flexDirection: "column" }} flex={1} padding="$3" gap="$3">
              {modules && modules.loading ? (
                <View width={"100%"} height={500} justifyContent="center" alignItems="center">
                  <LoadingIndicator />
                </View>
              ) : modules?.error ? (
                <View width={"100%"} height={500} justifyContent="center" alignItems="center">
                  <Paragraph textAlign="center" marginBottom={"$2"}>
                    Error loading modules
                  </Paragraph>
                  <Button icon={RefreshCw} onPress={refreshModules}>
                    Try again
                  </Button>
                </View>
              ) : (
                modules &&
                modules.data && (
                  <>
                    {isModuleUpdateAvailable && (
                      <Button
                        borderRadius={"$8"}
                        marginHorizontal={"auto"}
                        marginTop={"$2"}
                        backgroundColor={"$blue10"}
                        onPress={refreshModules}
                        icon={RefreshCw}
                      >
                        Update available
                      </Button>
                    )}
                    <FlatList
                      data={modules.data}
                      scrollEnabled={false}
                      keyExtractor={(item) => item.id.toString()}
                      contentContainerStyle={{ gap: 15, paddingBottom: 100 }}
                      style={{ minHeight: 300 }}
                      renderItem={({ item: module }) => (
                        <Link href={`/module-overview/${module?.id}`} disabled={!module.is_available} asChild key={module.id}>
                          <Card
                            borderRadius="$8"
                            pressStyle={{ scale: 0.95 }}
                            backgroundColor={"$blue1"}
                            animation="bouncy"
                            opacity={module.is_available ? 1 : 0.5}
                          >
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
                                        <H3 fontWeight={"bold"}>{module.title}</H3>
                                        {module.completed && <Paragraph color={"$blue10"}>Completed</Paragraph>}
                                        {!module.is_available && (
                                          <Paragraph marginTop={"$2"} color={"$red9"} fontWeight={600}>
                                            Coming soon
                                          </Paragraph>
                                        )}
                                      </YStack>
                                    </XStack>

                                    {module.is_available && module.progress !== 0 && <ChevronRight color={"$blue10"} />}
                                  </XStack>

                                  {module.progress !== 0 && !module.completed && (
                                    <Progress value={module.progress} backgroundColor={"$gray3"}>
                                      <Progress.Indicator backgroundColor={"$blue10"} />
                                    </Progress>
                                  )}
                                </YStack>
                              </XStack>
                            </Card.Header>
                          </Card>
                        </Link>
                      )}
                    />
                  </>
                )
              )}
            </XStack>
            <Paywall openPaywall={openPaywall} setOpenPaywall={setOpenPaywall} />
          </View>
        </ScrollView>
        <View
          backgroundColor={"$background"}
          style={{ position: "absolute", zIndex: 0, bottom: 0, left: 0, right: 0, height: window.height * 0.6 }}
        />
      </LinearGradient>
    </>
  );
}
