import React, { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDatePicker } from "@rehookify/datepicker";
import { blueA, purpleA, redA, yellow } from "@/theme/colors";
import { size, space } from "@/theme";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import { FlatList, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  Award,
  Button,
  Card,
  ChevronLeft,
  ChevronRight,
  H2,
  H3,
  H4,
  H5,
  LinearGradient,
  Paragraph,
  ScrollView,
  Settings,
  SizableText,
  Sparkle,
  View,
  XStack,
  YStack,
} from "@/ui";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";
import getStreak from "@/hooks/getStreak";
import { isSmallScreen } from "@/utils";

export default function TabTwoScreen() {
  const { top } = useSafeAreaInsets();
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const userActiveDates = currentUser?.active_days
    ? currentUser?.active_days.map((item) => new Date(item))
    : [];

  const userStats = [
    {
      name: "Modules Completed",
      icon: (
        <Award color={"$purple10"} fill={purpleA.purpleA10} marginTop={4} />
      ),
      value: currentUser?.completed_modules
        ? currentUser?.completed_modules.length
        : 0,
    },
    {
      name: "Total XP",
      icon: (
        <AntDesign
          name="star"
          size={24}
          color={yellow.yellow10}
          marginTop={4}
        />
      ),
      value: currentUser?.total_xp ? currentUser?.total_xp : 0,
    },
    {
      name: "Longest Streak",
      icon: (
        <Ionicons
          name="flame-sharp"
          size={24}
          color={redA.redA10}
          marginTop={4}
        />
      ),
      value: currentUser?.active_days ? getStreak(currentUser?.active_days) : 0,
    },
  ];

  const [selectedDates, onDatesChange] = useState<Date[]>(userActiveDates);

  const {
    data: { calendars, weekDays, formattedDates, months, years },
    propGetters: { addOffset, subtractOffset },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    locale: {
      day: "numeric",
    },
    calendar: {
      mode: "fluid",
      startDay: 1,
    },
  });

  const { month, year, days } = calendars[0];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const content = ImageManipulator.manipulate(image.uri).resize({
        width: 500,
        height: 500,
      });
      const { uri } = await (
        await content.renderAsync()
      ).saveAsync({ format: SaveFormat.JPEG });

      const fileExt = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          cacheControl: "3600",
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) console.error(error);
      if (data) {
        handleUpdateUserInfo({
          avatar_url:
            "https://pueoumkuxzosxrzqoefw.supabase.co/storage/v1/object/public/" +
            data?.fullPath,
        });
        Toast.show({
          type: "success",
          text1: "Profile image updated",
        });
      }
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200, paddingTop: top }}
        backgroundColor="$background"
        showsVerticalScrollIndicator={false}
      >
        <View position="relative" width={"100%"} zIndex={10}>
          <View position="absolute" top={25} right={25}>
            <Link asChild href={{ pathname: "/(settings)/settings" }}>
              <Button
                unstyled
                color={"$gray11"}
                fontWeight={500}
                pressStyle={{ scale: 0.96 }}
              >
                <Settings size={"$1.5"} color={"$gray11"} />
              </Button>
            </Link>
          </View>
        </View>
        {currentUser?.id ? (
          currentUser?.avatar_url ? (
            <View
              justifyContent="center"
              alignItems="center"
              marginVertical="$4"
            >
              <Pressable onPress={pickImage}>
                <View position="relative">
                  <Image
                    source={currentUser.avatar_url}
                    style={{
                      width: size.$12,
                      height: size.$12,
                      borderRadius: size.$10,
                    }}
                  />
                  {currentUser.instrument && (
                    <View
                      position="absolute"
                      bottom={0}
                      right={0}
                      padding="$2"
                      backgroundColor={"white"}
                      borderRadius="$10"
                      borderColor={"$gray4"}
                      borderWidth={3}
                    >
                      <Paragraph fontSize={17}>
                        {currentUser.instrument}
                      </Paragraph>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          ) : (
            <View
              justifyContent="center"
              alignItems="center"
              marginVertical="$4"
            >
              <Pressable onPress={pickImage}>
                <LinearGradient
                  colors={["$blue6", "$blue8"]}
                  start={[0.3, 1]}
                  end={[0, 0]}
                  style={{
                    width: size.$12,
                    height: size.$12,
                    borderRadius: size.$10,
                  }}
                />
              </Pressable>
            </View>
          )
        ) : (
          <View justifyContent="center" alignItems="center" marginVertical="$4">
            <LinearGradient
              colors={["$green7", "$blue8"]}
              start={[0.3, 1]}
              end={[0, 0]}
              style={{
                width: size.$12,
                height: size.$12,
                borderRadius: size.$10,
              }}
            />
          </View>
        )}

        <YStack marginHorizontal="$4">
          <XStack justifyContent="center" alignItems="center" marginBottom="$6">
            <XStack alignItems="center" gap="$2">
              <H3 fontWeight="normal" textAlign="left">
                {currentUser?.full_name ? currentUser?.full_name : "Guest User"}
              </H3>

              {currentUser?.is_subscribed && (
                <LinearGradient
                  colors={["#2563EB", "#007AFF"]}
                  start={[0.3, 1]}
                  end={[0, 0]}
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$10"
                >
                  <Paragraph color="$backgroundStrong">Pro</Paragraph>
                </LinearGradient>
              )}
            </XStack>
          </XStack>
          {!currentUser?.is_subscribed && (
            <Card
              width={"100%"}
              backgroundColor={"$blue10"}
              borderRadius="$9"
              overflow="hidden"
              marginBottom="$6"
              onPress={() => router.push("/paywall")}
              pressStyle={{ scale: 0.98 }}
              elevate
            >
              <Card.Header>
                <XStack alignItems="center" gap="$3">
                  <Sparkle color={"white"} />
                  <YStack flex={1}>
                    <H4 fontWeight="normal" color={"white"}>
                      Go Pro
                    </H4>
                    <Paragraph color="rgba(255,255,255,0.88)">
                      Unlock every module and premium features
                    </Paragraph>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Background overflow="hidden">
                <LinearGradient
                  colors={["#005FCC", "#007AFF"]}
                  start={[0, 1]}
                  end={[1, 0]}
                  width={"100%"}
                  height={"$19"}
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                />
              </Card.Background>
            </Card>
          )}

          <YStack
            flex={1}
            flexDirection={isSmallScreen ? "column" : "row"}
            alignItems="flex-start"
            gap="$3"
            marginBottom={"$6"}
          >
            <YStack
              alignItems="flex-start"
              width={"100%"}
              flex={1}
              gap="$3"
              marginBottom={"$6"}
            >
              <H5 fontWeight={600} marginBottom={"$2"}>
                Overview
              </H5>
              {userStats.map((stat) => (
                <Card width={"100%"} padding="$2.5" key={stat.name}>
                  <XStack gap="$2">
                    {stat.icon}
                    <YStack>
                      <Paragraph
                        fontSize={"$7"}
                        fontWeight="normal"
                        fontFamily="InterBold"
                      >
                        {stat.value}
                      </Paragraph>
                      <Paragraph fontSize={"$1"}>{stat.name}</Paragraph>
                    </YStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
            <YStack flex={1}>
              <H5 fontWeight={600} marginBottom={"$2"}>
                Streak
              </H5>
              {weekDays && days && (
                <Card width={"100%"}>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    width={"100%"}
                    marginBottom="$2"
                    paddingHorizontal="$2.5"
                    paddingTop="$2.5"
                  >
                    <H2 fontWeight={600}>{month}</H2>
                    <XStack gap="$3">
                      <View
                        onPress={(evt) => {
                          const result = subtractOffset({ months: 1 });
                          if (result?.onClick) {
                            result.onClick(
                              evt as unknown as Parameters<
                                NonNullable<typeof result.onClick>
                              >[0],
                            );
                          }
                        }}
                      >
                        <ChevronLeft size={"2"} />
                      </View>
                      <View
                        onPress={(evt) => {
                          const result = addOffset({ months: 1 });
                          if (result?.onClick) {
                            result.onClick(
                              evt as unknown as Parameters<
                                NonNullable<typeof result.onClick>
                              >[0],
                            );
                          }
                        }}
                      >
                        <ChevronRight size={"2"} />
                      </View>
                    </XStack>
                  </XStack>

                  <XStack width="100%" paddingHorizontal="$2.5">
                    {weekDays.map((item, index) => (
                      <View
                        key={`${item}-${index}`}
                        flex={1}
                        alignItems="center"
                      >
                        <Paragraph
                          paddingVertical="$2"
                          textAlign="center"
                          fontSize="$2"
                          color="$gray11"
                        >
                          {item}
                        </Paragraph>
                      </View>
                    ))}
                  </XStack>
                  <FlatList
                    data={days}
                    numColumns={7}
                    contentContainerStyle={{
                      width: "100%",
                      height: "auto",
                      paddingHorizontal: space["$2.5"],
                    }}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => `${item.day}-${index}`}
                    renderItem={({ item }) => (
                      <View flex={1} alignItems="center">
                        <YStack
                          paddingVertical="$3"
                          alignItems="center"
                          width="100%"
                          position="relative"
                        >
                          <Paragraph
                            textAlign="center"
                            opacity={item.inCurrentMonth ? 1 : 0}
                          >
                            {item.day}
                          </Paragraph>
                          {item.selected && (
                            <MaterialCommunityIcons
                              name="music-note"
                              size={24}
                              color={blueA.blueA10}
                              style={{ position: "absolute" }}
                            />
                          )}
                        </YStack>
                      </View>
                    )}
                  />
                </Card>
              )}
            </YStack>
          </YStack>
        </YStack>
        {/* <Paywall openPaywall={openPaywall} setOpenPaywall={setOpenPaywall} /> */}
      </ScrollView>
    </>
  );
}
