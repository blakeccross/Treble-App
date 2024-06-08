import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@tamagui/themes";
import { StyleSheet, Platform, SafeAreaView } from "react-native";
import { Avatar, Card, Circle, H1, H3, H5, Paragraph, Separator, View, XStack, Button, ScrollView, YStack, H2 } from "tamagui";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Play } from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const games = [
  { title: "Pitch Perfect", description: `Test your ear in a\nfast pace matching game`, backgroundImage: require("@/assets/images/blue_shapes.jpg") },
  {
    title: "Nashville Roundup",
    description: `Match the Nashville numbers`,
    backgroundImage: require("@/assets/images/hassaan-here-bKfkhVRAJTQ-unsplash.jpg"),
  },
];

export default function TabTwoScreen() {
  const router = useRouter();
  return (
    <View flex={1} backgroundColor={"$background"}>
      <SafeAreaView />
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 150 }}>
        <H2 fontWeight={600}>Ear Training</H2>
        <YStack gap={"$4"}>
          {games.map((game) => (
            <Card
              key={game.title}
              elevate
              bordered
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
              borderRadius={"$8"}
              overflow="hidden"
              height={400}
              flex={1}
              onPress={() => router.push("/(ear-training)/pitch-perfect")}
            >
              <Card.Background>
                <Image
                  style={{ flex: 1, width: "100%" }}
                  source={game.backgroundImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                />
              </Card.Background>

              <Card.Footer>
                <BlurView style={{ flex: 1, padding: 20 }} tint="light">
                  <XStack justifyContent="space-between">
                    <YStack>
                      <H5 fontWeight={600}>{game.title}</H5>
                      <Paragraph lineHeight={17}>Test your ear in a{`\n`}fast pace matching game</Paragraph>
                    </YStack>
                    <Button
                      borderRadius={"$10"}
                      size={"$3"}
                      iconAfter={<Play />}
                      themeInverse
                      backgroundColor={"white"}
                      color={"black"}
                      fontWeight={600}
                      disabled
                    >
                      Play
                    </Button>
                  </XStack>
                </BlurView>
              </Card.Footer>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
}
