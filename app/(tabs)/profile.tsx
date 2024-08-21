import { UserContext } from "@/context/user-context";
import { ArrowRight, Award, ChevronLeft, ChevronRight, Flame, Music, Settings } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable } from "react-native";
import { useMMKVNumber } from "react-native-mmkv";
import { Avatar, Card, H3, H5, Paragraph, Separator, View, XStack, YStack, Text, Button, H2, CardHeader, H1, ScrollView } from "tamagui";
import { useDatePicker } from "@rehookify/datepicker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { blue, blueA, purpleA, redA, size, yellow } from "@tamagui/themes";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "tamagui/linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";
import { supabase } from "@/utils/supabase";
import { Image as ImageComp } from "react-native-compressor";

export default function TabTwoScreen() {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [totalXP, setTotalXP] = useMMKVNumber("totalXP");
  const userActiveDates = currentUser?.activeDays ? currentUser?.activeDays.map((item) => new Date(item)) : [];

  const [selectedDates, onDatesChange] = useState<Date[]>(userActiveDates);
  // console.log("ACTIVE DAYS", currentUser);

  const {
    data: { calendars, weekDays, formattedDates, months, years },
    propGetters: { dayButton, addOffset, subtractOffset, monthButton, nextYearsButton, previousYearsButton, yearButton },
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

      const compressedImage = await ImageComp.compress(image.uri, {
        compressionMethod: "manual",
        maxWidth: 1000,
        quality: 0.8,
      });

      const arraybuffer = await fetch(compressedImage).then((res) => res.arrayBuffer());

      const { data, error } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
        cacheControl: "3600",
        contentType: image.mimeType ?? "image/jpeg",
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
      <XStack justifyContent="flex-end" paddingHorizontal="$4" position="absolute" right={"$4"} top={"$10"} zIndex={"$5"}>
        <Link href={{ pathname: "/(profile)/profile-settings" }}>
          <Settings size={"$2"} />
        </Link>
      </XStack>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* <Avatar size={"100%"}>
          <Avatar.Image accessibilityLabel="Cam" src={currentUser?.profileImageURL} /> */}
        {currentUser?.avatar_url ? (
          <Pressable onPress={pickImage}>
            <Image source={currentUser?.avatar_url} style={{ width: "100%", height: size.$19 }}>
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
        {/* </Avatar> */}
        <YStack marginHorizontal="$4">
          <H3 fontWeight={600} textAlign="left" marginVertical="$4">
            {currentUser?.full_name}
          </H3>
          <Separator />

          {/* <H5>Overview</H5> */}
          <YStack alignItems="flex-start" gap="$3" marginBottom={"$4"}>
            <XStack gap="$3">
              <Card flex={1} bordered>
                <Card.Header>
                  <XStack gap="$2">
                    <Award color={"$purple10"} fill={purpleA.purpleA10} marginTop={4} />
                    <YStack>
                      <Paragraph fontWeight="800">1</Paragraph>
                      <Paragraph>Modules Completed</Paragraph>
                    </YStack>
                  </XStack>
                </Card.Header>
              </Card>
              <Card flex={1} bordered>
                <Card.Header>
                  <XStack gap="$2">
                    <AntDesign name="star" size={24} color={yellow.yellow10} marginTop={4} />
                    <YStack>
                      <Paragraph fontWeight="800">{totalXP}</Paragraph>
                      <Paragraph>Total XP</Paragraph>
                    </YStack>
                  </XStack>
                </Card.Header>
              </Card>
            </XStack>
            <XStack gap="$3">
              <Card flex={1} bordered>
                <Card.Header>
                  <XStack gap="$2">
                    <Ionicons name="flame-sharp" size={24} color={redA.redA10} marginTop={4} />
                    <YStack>
                      <Paragraph fontWeight="800">3</Paragraph>
                      <Paragraph>Day Streak</Paragraph>
                    </YStack>
                  </XStack>
                </Card.Header>
              </Card>
              <Card flex={1} bordered>
                <Card.Header>
                  <XStack gap="$2">
                    <YStack>
                      <Paragraph fontWeight="800">3</Paragraph>
                      <Paragraph>Current League</Paragraph>
                    </YStack>
                  </XStack>
                </Card.Header>
              </Card>
            </XStack>
          </YStack>

          <XStack alignItems="center" justifyContent="space-between" width={"100%"} marginBottom="$2">
            <H2 fontWeight={600}>{month}</H2>
            <XStack gap="$3">
              <View onPress={() => subtractOffset({ months: 1 }).onClick()}>
                <ChevronLeft size={"2"} />
              </View>
              <View onPress={() => addOffset({ months: 1 }).onClick()}>
                <ChevronRight size={"2"} />
              </View>
            </XStack>
          </XStack>
          <Card bordered width={"100%"}>
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
        </YStack>
      </ScrollView>
    </>
  );
}
