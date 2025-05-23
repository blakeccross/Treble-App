import React, { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { supabase } from "@/utils/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDatePicker } from "@rehookify/datepicker";
import { Award, ChevronLeft, ChevronRight, Settings, Sparkle } from "@tamagui/lucide-icons";
import { blueA, purpleA, redA, size, yellow } from "@tamagui/themes";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import { FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Button, Card, H2, H3, H4, H5, Paragraph, ScrollView, SizableText, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";
import getStreak from "@/hooks/getStreak";
import Paywall from "@/components/paywall.modal";
import { isSmallScreen } from "@/utils";

export default function TabTwoScreen() {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const userActiveDates = currentUser?.active_days ? currentUser?.active_days.map((item) => new Date(item)) : [];

  const [selectedDates, onDatesChange] = useState<Date[]>(userActiveDates);
  const [openPaywall, setOpenPaywall] = useState(false);

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

      const content = ImageManipulator.manipulate(image.uri).resize({ width: 500, height: 500 });
      const { uri } = await (await content.renderAsync()).saveAsync({ format: SaveFormat.JPEG });

      const fileExt = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());

      const { data, error } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
        cacheControl: "3600",
        contentType: "image/jpeg",
        upsert: false,
      });

      if (error) console.error(error);
      if (data) {
        handleUpdateUserInfo({ avatar_url: "https://pueoumkuxzosxrzqoefw.supabase.co/storage/v1/object/public/" + data?.fullPath });
        Toast.show({
          type: "success",
          text1: "Profile image updated",
        });
      }
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }} backgroundColor={"$gray4"}>
        <SafeAreaView edges={["top"]} />
        <View position="relative" width={"100%"}>
          <View position="absolute" top={0} right={25}>
            <Link asChild href={{ pathname: "/(settings)/settings" }}>
              <Button unstyled color={"$gray10"} fontWeight={600} pressStyle={{ scale: 0.95 }}>
                <Settings size={"$1.5"} color={"$gray10"} />
              </Button>
            </Link>
          </View>
        </View>
        {currentUser?.id ? (
          currentUser?.avatar_url ? (
            <View justifyContent="center" alignItems="center" marginVertical="$4">
              <Pressable onPress={pickImage}>
                <View position="relative">
                  <Image source={currentUser.avatar_url} style={{ width: size.$12, height: size.$12, borderRadius: size.$10 }} />
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
                      <Paragraph fontSize={17}>{currentUser.instrument}</Paragraph>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          ) : (
            <LinearGradient
              colors={["$blue6", "$blue8"]}
              start={[0.3, 1]}
              end={[0, 0]}
              width={"100%"}
              height={"$19"}
              justifyContent="center"
              alignItems="center"
            >
              <SafeAreaView edges={["right", "left", "top"]} />

              <Button variant="outlined" chromeless width={"$15"} onPress={pickImage}>
                + Add Profile Photo
              </Button>
            </LinearGradient>
          )
        ) : (
          <SafeAreaView edges={["top"]} />
        )}

        <YStack marginHorizontal="$4">
          <XStack justifyContent="center" alignItems="center" marginBottom="$6">
            <XStack alignItems="center" gap="$2">
              <H3 fontWeight={600} textAlign="left">
                {currentUser?.full_name ? currentUser?.full_name : "Guest User"}
              </H3>

              {currentUser?.is_subscribed && (
                <LinearGradient
                  colors={["$blue10", "$purple7"]}
                  start={[0.3, 1]}
                  end={[0, 0]}
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$10"
                >
                  <Paragraph color={"$background"}>Pro</Paragraph>
                </LinearGradient>
              )}
            </XStack>
          </XStack>
          {!currentUser?.is_subscribed && (
            <Card
              width={"100%"}
              backgroundColor={"$blue10"}
              borderRadius="$8"
              overflow="hidden"
              marginBottom="$6"
              onPress={() => router.push("/paywall")}
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
            >
              <Card.Header>
                <XStack alignItems="center" gap="$2">
                  <Sparkle color={"white"} />
                  <YStack>
                    <H4 fontWeight={800} color={"white"}>
                      Go Pro
                    </H4>
                    <Paragraph color={"white"}>Unlock all modules and features</Paragraph>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Background overflow="hidden">
                <LinearGradient
                  colors={["$blue10", "$purple7"]}
                  start={[0.3, 1]}
                  end={[0, 0]}
                  width={"100%"}
                  height={"$19"}
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                />
              </Card.Background>
            </Card>
          )}

          <YStack flex={1} flexDirection={isSmallScreen ? "column" : "row"} alignItems="flex-start" gap="$3" marginBottom={"$6"}>
            <YStack alignItems="flex-start" width={"100%"} flex={1} gap="$3" marginBottom={"$6"}>
              <H5 fontWeight={600} marginBottom={"$2"}>
                Overview
              </H5>
              <Card width={"100%"} padding="$2.5">
                <XStack gap="$2">
                  <Award color={"$purple10"} fill={purpleA.purpleA10} marginTop={4} />
                  <YStack>
                    <Paragraph fontSize={"$7"} lineHeight={"$1"} fontWeight="800">
                      {currentUser?.completed_modules ? currentUser?.completed_modules.length : 0}
                    </Paragraph>
                    <Paragraph fontSize={"$1"}>Modules Completed</Paragraph>
                  </YStack>
                </XStack>
              </Card>
              <Card width={"100%"} padding="$2.5">
                <XStack gap="$2">
                  <AntDesign name="star" size={24} color={yellow.yellow10} marginTop={4} />
                  <YStack>
                    <Paragraph fontSize={"$7"} lineHeight={"$1"} fontWeight="800">
                      {currentUser?.total_xp ? currentUser?.total_xp : 0}
                    </Paragraph>
                    <Paragraph fontSize={"$1"}>Total XP</Paragraph>
                  </YStack>
                </XStack>
              </Card>

              <Card width={"100%"} padding="$2.5">
                <XStack gap="$2">
                  <Ionicons name="flame-sharp" size={24} color={redA.redA10} marginTop={4} />
                  <YStack>
                    <Paragraph fontSize={"$7"} lineHeight={"$1"} fontWeight="800">
                      {currentUser?.active_days ? getStreak(currentUser?.active_days) : 0}
                    </Paragraph>
                    <Paragraph fontSize={"$1"}>Day Streak</Paragraph>
                  </YStack>
                </XStack>
              </Card>
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
                          if (result && result.onClick) {
                            result.onClick(evt as any);
                          }
                        }}
                      >
                        <ChevronLeft size={"2"} />
                      </View>
                      <View
                        onPress={(evt) => {
                          const result = addOffset({ months: 1 });
                          if (result && result.onClick) {
                            result.onClick(evt as any);
                          }
                        }}
                      >
                        <ChevronRight size={"2"} />
                      </View>
                    </XStack>
                  </XStack>

                  <FlatList
                    data={weekDays}
                    numColumns={7}
                    contentContainerStyle={{ width: "100%" }}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <Paragraph paddingVertical="$2" flex={1} textAlign="center">
                        {item}
                      </Paragraph>
                    )}
                  />
                  <FlatList
                    data={days}
                    numColumns={7}
                    contentContainerStyle={{ width: "100%", height: "auto" }}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <YStack paddingVertical="$3" flex={1}>
                        <Paragraph textAlign="center" opacity={item.inCurrentMonth ? 1 : 0}>
                          {item.day}
                        </Paragraph>
                        {item.selected && (
                          <MaterialCommunityIcons name="music-note" size={24} color={blueA.blueA10} style={{ position: "absolute" }} />
                        )}
                      </YStack>
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
