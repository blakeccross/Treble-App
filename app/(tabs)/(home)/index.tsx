import BottomSheet from "@/components/BottomSheet";
import Paywall from "@/components/paywall.modal";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import { XPHistory } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ChevronRight, Heart, StarFull } from "@tamagui/lucide-icons";
import { blue, grayA, red, yellow, yellowA } from "@tamagui/themes";
import { Image } from "expo-image";
import { Link } from "expo-router";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Dimensions, FlatList, useColorScheme } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Card, H3, H5, Paragraph, Progress, ScrollView, Separator, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import * as Network from "expo-network";
import * as FileSystem from "expo-file-system";
import { window } from "@/utils";

export default function HomeScreen() {
  const { modules } = useContext(ModuleContext);
  const { currentUser, lives } = useContext(UserContext);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const screenWidth = Dimensions.get("window").width;
  const [openPaywall, setOpenPaywall] = useState(false);
  const [openXPHistory, setOpenXPHistory] = useState(false);
  const [xpHistory, setXPHistory] = useMMKVObject<XPHistory[]>("xp_history");
  const networkState = Network.useNetworkState();
  console.log(FileSystem.documentDirectory + "C3.mp3");
  return (
    <>
      <LinearGradient
        colors={useColorScheme() === "light" ? ["$blue10", "$blue8"] : ["$blue3", "$blue5"]}
        start={[0.3, 1]}
        end={[0, 0]}
        zIndex={1}
        flex={1}
      >
        <View padding="$5" paddingTop={0}>
          <SafeAreaView edges={["top"]} />

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

            <XStack gap="$3">
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

        <BottomSheet isOpen={openXPHistory} setIsOpen={setOpenXPHistory} height={"80%"}>
          <YStack flex={1}>
            <H3 fontWeight={600} marginBottom="$2">
              XP History
            </H3>

            <FlatList
              data={xpHistory?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} // Sort by date descending
              keyExtractor={(item) => String(item.date)}
              style={{ flex: 1 }}
              ListEmptyComponent={() => (
                <View>
                  <Paragraph>As you gain experience, it will show up here</Paragraph>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <>
                  <XStack key={item.date} alignItems="center" justifyContent="space-between" width={"100%"} marginBottom="$2">
                    <YStack>
                      <XStack alignItems="center" gap="$2">
                        <H5 fontWeight={600}>{item.title + " • " + item.description}</H5>
                      </XStack>
                      <Paragraph fontSize={"$2"} color={"$gray10"}>
                        {moment(item.date).format("MMM D, YYYY hh:mm a")}
                      </Paragraph>
                    </YStack>
                    <H5 fontWeight={600}>{item.xp_earned}</H5>
                  </XStack>
                  <Separator />
                </>
              )}
            />
          </YStack>
        </BottomSheet>

        <ScrollView
          // backgroundColor={"$background"}
          showsVerticalScrollIndicator={false}
          flex={1}
          borderTopLeftRadius={"$8"}
          borderTopRightRadius={"$8"}
          zIndex={1}
        >
          <View backgroundColor={"$background"} flex={1} overflow="hidden" borderTopLeftRadius={"$8"} borderTopRightRadius={"$8"}>
            {/* <ScrollView showsVerticalScrollIndicator={false} flex={1}> */}
            {!networkState.isConnected && (
              <View>
                <Paragraph textAlign="center" marginTop={"$2"}>
                  You are offline
                </Paragraph>
              </View>
            )}
            <XStack $sm={{ flexDirection: "column" }} padding="$3" gap="$3">
              {modules && modules.loading
                ? [...Array(6)].map((item, index) => (
                    <Card
                      key={index}
                      elevate
                      borderRadius="$8"
                      pressStyle={{ scale: 0.95 }}
                      // animation="bouncy"
                      height={"$10"}
                    >
                      <Card.Background borderRadius="$8">
                        <SkeletonLoader width={"100%"} height={"100%"} backgroundColor={grayA.grayA3} />
                      </Card.Background>
                    </Card>
                  ))
                : modules &&
                  modules.data && (
                    <FlatList
                      data={modules.data}
                      scrollEnabled={false}
                      contentContainerStyle={{ gap: 15, paddingBottom: 100 }}
                      renderItem={({ item: module }) => (
                        <Link href={`/module-overview/${module?.id}`} asChild key={module.id}>
                          <Card
                            borderRadius="$8"
                            pressStyle={{ scale: 0.95 }}
                            // animation="bouncy"
                            backgroundColor={"$blue1"}
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
                                        <H3 fontWeight={600}>{module.title}</H3>
                                        {module.completed && <Paragraph color={"$blue10"}>Completed</Paragraph>}
                                      </YStack>
                                    </XStack>
                                    {module.progress !== 0 && <ChevronRight color={"$blue10"} />}
                                  </XStack>
                                  {module.progress !== 0 && !module.completed && (
                                    <Progress value={module.progress} backgroundColor={"$gray3"}>
                                      <Progress.Indicator
                                        // animation="lazy"
                                        backgroundColor={"$blue10"}
                                      />
                                    </Progress>
                                  )}
                                </YStack>
                              </XStack>
                            </Card.Header>
                          </Card>
                        </Link>
                      )}
                    />
                  )}
            </XStack>
            <Paywall openPaywall={openPaywall} setOpenPaywall={setOpenPaywall} />
          </View>
        </ScrollView>
        <View
          backgroundColor={"$background"}
          style={{ position: "absolute", zIndex: 0, bottom: 0, left: 0, right: 0, height: window.height * 0.5 }}
        />
      </LinearGradient>
    </>
  );
}
