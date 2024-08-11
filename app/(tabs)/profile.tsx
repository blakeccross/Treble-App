import { UserContext } from "@/context/user-context";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Settings } from "@tamagui/lucide-icons";
import { color } from "@tamagui/themes";
import { Link } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import { Avatar, Card, H3, H5, Paragraph, Separator, XStack, YStack } from "tamagui";

export default function TabTwoScreen() {
  const { currentUser } = useContext(UserContext);

  return (
    <SafeAreaView>
      <XStack justifyContent="flex-end" paddingHorizontal="$4">
        <Link href={{ pathname: "/profile-settings" }}>
          <Settings size={"$2"} />
        </Link>
      </XStack>
      <YStack alignItems="center" marginVertical="$10">
        <Avatar circular size="$10">
          <Avatar.Image accessibilityLabel="Cam" src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <H3>{currentUser?.name}</H3>
        <Separator />

        <H5>Overview</H5>
        <YStack alignItems="flex-start" gap="$4" marginHorizontal="$4">
          <XStack gap="$4">
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">3</Paragraph>
                <Paragraph>Modules Completed</Paragraph>
              </Card.Header>
            </Card>
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">73</Paragraph>
                <Paragraph>Total XP</Paragraph>
              </Card.Header>
            </Card>
          </XStack>
          <XStack gap="$4">
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">157</Paragraph>
                <Paragraph>Ranking</Paragraph>
              </Card.Header>
            </Card>
            <Card flex={1}>
              <Card.Header>
                <Paragraph fontWeight="800">3</Paragraph>
                <Paragraph>Current League</Paragraph>
              </Card.Header>
            </Card>
          </XStack>
          {/* {stats.map((item) => (
            <Card>
              <Card.Header>
                <Paragraph>{item.title}</Paragraph>
                <Paragraph>{item.value}</Paragraph>
              </Card.Header>
            </Card>
          ))} */}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
