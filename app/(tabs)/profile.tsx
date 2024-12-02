import { UserContext } from "@/context/user-context";
import { ArrowRight, Award, ChevronLeft, ChevronRight, Flame, Music, Settings, Sparkle, Star, StarFull } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable } from "react-native";
import { useMMKVNumber } from "react-native-mmkv";
import {
  Avatar,
  Card,
  H3,
  H5,
  Paragraph,
  Separator,
  View,
  XStack,
  YStack,
  Text,
  Button,
  H2,
  CardHeader,
  H1,
  ScrollView,
  H4,
  SizableText,
} from "tamagui";
import { useDatePicker } from "@rehookify/datepicker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { blue, blueA, purpleA, redA, size, yellow, yellowA } from "@tamagui/themes";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "tamagui/linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";
import { supabase } from "@/utils/supabase";
// import { Image as ImageComp } from "react-native-compressor";
import getStreak from "@/hooks/getStreak";
import Paywall from "../paywall";

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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      // var re = /(?:\.([^.]+))?$/;
      const image = result.assets[0];

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      // const compressedImage = await ImageComp.compress(image.uri, {
      //   compressionMethod: "manual",
      //   output: "jpg",
      //   maxWidth: 1000,
      //   maxHeight: 1000,
      //   quality: 0.8,
      // });

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

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
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {currentUser?.avatar_url ? (
          <Pressable onPress={pickImage}>
            <Image source={currentUser.avatar_url} style={{ width: "100%", height: size.$19 }}>
              <SafeAreaView edges={["right", "left", "top"]} />
            </Image>
          </Pressable>
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
        )}

        <YStack marginHorizontal="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <H3 fontWeight={600} textAlign="left" marginVertical="$6">
                {currentUser?.full_name}
              </H3>
              {currentUser?.purchased_products.length && (
                <LinearGradient colors={["$blue10", "$purple7"]} start={[0.3, 1]} end={[0, 0]} paddingHorizontal="$3" borderRadius="$10">
                  <SizableText color={"$background"}>Pro</SizableText>
                </LinearGradient>
              )}
            </XStack>
            <Link asChild href={{ pathname: "/(profile)" }}>
              <Button variant="outlined" color={"$gray10"} fontWeight={600} pressStyle={{ scale: 0.95 }}>
                Edit Profile
              </Button>
            </Link>
          </XStack>

          {!currentUser?.purchased_products.length && (
            <Card
              bordered
              width={"100%"}
              backgroundColor={"$blue10"}
              borderRadius="$8"
              overflow="hidden"
              marginBottom="$6"
              onPress={() => setOpenPaywall(true)}
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
            >
              <Card.Header>
                <XStack alignItems="center" gap="$2">
                  <Sparkle color={"$background"} />
                  <YStack>
                    <H4 fontWeight={800} themeInverse={true}>
                      Go Pro
                    </H4>
                    <Paragraph>Unlock all modules and features</Paragraph>
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

          <H5 fontWeight={600}>Overview</H5>
          <YStack alignItems="flex-start" gap="$3" marginBottom={"$6"}>
            <XStack gap="$3">
              <Card flex={1} bordered padding="$2.5">
                <XStack gap="$2">
                  <Award color={"$purple10"} fill={purpleA.purpleA10} marginTop={4} />
                  <YStack>
                    <Paragraph fontWeight="800">1</Paragraph>
                    <Paragraph fontSize={"$1"}>Modules Completed</Paragraph>
                  </YStack>
                </XStack>
              </Card>
              <Card flex={1} bordered padding="$2.5">
                <XStack gap="$2">
                  <AntDesign name="star" size={24} color={yellow.yellow10} marginTop={4} />
                  <YStack>
                    <Paragraph fontWeight="800">{currentUser?.total_xp}</Paragraph>
                    <Paragraph fontSize={"$1"}>Total XP</Paragraph>
                  </YStack>
                </XStack>
              </Card>
            </XStack>
            <XStack gap="$3">
              <Card flex={1} bordered padding="$2.5">
                <XStack gap="$2">
                  <Ionicons name="flame-sharp" size={24} color={redA.redA10} marginTop={4} />
                  <YStack>
                    <Paragraph fontWeight="800">{currentUser?.active_days ? getStreak(currentUser?.active_days) : 0}</Paragraph>
                    <Paragraph fontSize={"$1"}>Day Streak</Paragraph>
                  </YStack>
                </XStack>
              </Card>
              <Card flex={1} bordered padding="$2.5">
                <XStack gap="$2">
                  <YStack>
                    <Paragraph fontWeight="800">3</Paragraph>
                    <Paragraph fontSize={"$1"}>Current League</Paragraph>
                  </YStack>
                </XStack>
              </Card>
            </XStack>
          </YStack>
          <H5 fontWeight={600}>Streak</H5>
          {weekDays && days && (
            <Card bordered width={"100%"}>
              <XStack alignItems="center" justifyContent="space-between" width={"100%"} marginBottom="$2" paddingHorizontal="$2.5" paddingTop="$2.5">
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
                    {item.selected && <MaterialCommunityIcons name="music-note" size={24} color={blueA.blueA10} style={{ position: "absolute" }} />}
                  </YStack>
                )}
              />
            </Card>
          )}
        </YStack>
        <Paywall openPaywall={openPaywall} setOpenPaywall={setOpenPaywall} />
      </ScrollView>
    </>
  );
}
