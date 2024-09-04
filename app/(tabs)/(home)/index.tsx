import { Dimensions, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Card, Button, H1, H2, H3, Paragraph, Progress, ScrollView, XStack, YStack, View, H5, H4 } from "tamagui";
import { ChevronRight, Flame, Gem, Music, Trophy } from "@tamagui/lucide-icons";
import { Link, router } from "expo-router";
import { ModuleContext } from "@/context/module-context";
import React, { useContext } from "react";
import { blue, darkColors, orange, red, whiteA, yellow } from "@tamagui/themes";
import { LinearGradient } from "tamagui/linear-gradient";
import { BlurView } from "expo-blur";
import { UserContext } from "@/context/user-context";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useMMKVNumber } from "react-native-mmkv";
import TrebleLogo from "@/assets/trebleLogo";

export default function HomeScreen() {
  const { data } = useContext(ModuleContext);
  const { currentUser } = useContext(UserContext);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const screenWidth = Dimensions.get("window").width;
  return (
    <View backgroundColor={"$blue1"}>
      <LinearGradient colors={["$blue10", "$blue8"]} start={[0.3, 1]} end={[0, 0]} padding="$5" paddingTop="$0" paddingBottom="$4">
        {/* <View backgroundColor={"$blue10"} padding="$4" paddingTop="$0"> */}
        <SafeAreaView edges={["right", "left", "top"]} />

        <XStack gap="$2" justifyContent="space-between" alignItems="center">
          <View width={"$10"} alignItems="flex-start">
            <Link asChild href={"/profile"}>
              <Avatar circular size="$3.5" pressStyle={{ scale: 0.95 }}>
                {currentUser?.avatar_url && <Avatar.Image accessibilityLabel="Cam" src={currentUser?.avatar_url} />}
                <Avatar.Fallback backgroundColor="$blue2" />
                {/* <Music size={70} /> */}
                <FontAwesome6 name="user-large" size={20} color={blue.blue7} />
              </Avatar>
            </Link>
          </View>

          <View width={100} height={50}>
            <TrebleLogo />
          </View>

          {/* <H4 color={"white"} fontWeight={600}>
            Treble
          </H4> */}

          <XStack alignItems="center" justifyContent="flex-end" gap="$2" width={"$10"}>
            <AntDesign name="star" size={24} color={yellow.yellow10} />
            <H5 color={"$background"} fontWeight={600}>
              {currentUser?.total_xp}
            </H5>
          </XStack>

          {/* <XStack alignItems="center" gap="$2">
              <FontAwesome5 name="fire-alt" size={24} color={red.red10} />
              <H5 color={"$background"} fontWeight={600}>
                6
              </H5>
            </XStack> */}
        </XStack>
      </LinearGradient>

      <ScrollView height={"100%"}>
        <XStack $sm={{ flexDirection: "column" }} padding="$3" gap="$3">
          {data.map((module) => (
            <Link
              // href={{
              //   pathname: `/module/[id]`,
              //   params: { id: module.id },
              // }}
              href={`/module-overview/${module?.id}`}
              asChild
              key={module.id}
            >
              <Card bordered elevate borderRadius="$8" pressStyle={{ scale: 0.95 }} animation="bouncy" backgroundColor={"$blue1"}>
                <Card.Header padding="$4">
                  <XStack gap="$4" flex={1}>
                    <Image
                      style={{ width: screenWidth * 0.2, height: screenWidth * 0.2, borderRadius: 10 }}
                      source={module.local_poster_uri}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={1000}
                    />
                    <YStack gap="$4" flex={1}>
                      <XStack justifyContent="space-between">
                        <XStack gap="$4" flex={1}>
                          {/* <H1>{module.icon}</H1> */}

                          <YStack>
                            <Paragraph size={"$2"}>{module.section.length + " Chapters"}</Paragraph>
                            <H3 fontWeight={600}>{module.title}</H3>
                          </YStack>
                        </XStack>
                        {/* <Button white>Testing</Button> */}
                        {/* <Button fontWeight={600} borderRadius={"$8"} circular disabled variant="outlined"> */}
                        {module.progress !== 0 && <ChevronRight color={"$blue10"} />}
                        {/* </Button> */}
                      </XStack>
                      {module.progress !== 0 && (
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
      </ScrollView>
    </View>
  );
}
