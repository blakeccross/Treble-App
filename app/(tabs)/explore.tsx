import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@tamagui/themes";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import { Avatar, Card, H3, H5, Paragraph, Separator, XStack, YStack } from "tamagui";

export default function TabTwoScreen() {
  const stats = [
    { title: "Modules Completed", value: 3 },
    { title: "Total XP", value: 73 },
    { title: "Ranking", value: 113 },
    { title: "Current League", value: 113 },
  ];
  return (
    <SafeAreaView>
      <YStack alignItems="center" marginVertical="$10">
        <Avatar circular size="$10">
          <Avatar.Image accessibilityLabel="Cam" src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80" />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <H3>John Smith</H3>
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
