import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, H1, H2, H3, Paragraph, Progress, ScrollView, XStack, YStack } from "tamagui";
import { Flame, Gem, Trophy } from "@tamagui/lucide-icons";
import { Link, router } from "expo-router";
import { ModuleContext } from "@/context/module-context";
import React, { useContext } from "react";
import { blue, darkColors } from "@tamagui/themes";
import { LinearGradient } from "tamagui/linear-gradient";
import { BlurView } from "expo-blur";
import { UserContext } from "@/context/user-context";

export default function HomeScreen() {
  const { data } = useContext(ModuleContext);
  const currentUser = useContext(UserContext);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: blue.blue10, dark: darkColors.blue10 }}
        headerImage={
          <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]}>
            <SafeAreaView>
              <YStack gap="$3" style={{ padding: 20 }}>
                <XStack gap="$2" justifyContent="space-between">
                  <YStack>
                    <H3 fontWeight={800} color={"white"}>
                      Welcome Back,
                    </H3>
                    <H3 fontWeight={500} color={"white"} opacity={0.8}>
                      Alice
                    </H3>
                  </YStack>
                  <Avatar circular size="$5">
                    <Avatar.Image
                      accessibilityLabel="Nate Wienert"
                      src="https://images.unsplash.com/photo-1545539513-9ad989ce66b2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
                  </Avatar>
                </XStack>

                <Card borderRadius="$6" overflow="hidden" backgroundColor={"rgba(52, 52, 52, 0.0)"}>
                  <Card.Header>
                    <XStack gap="$2" justifyContent="space-evenly" alignItems="center">
                      <Flame size="$2" color={"$red10"} />
                      <Gem size="$2" color={"blue7"} />
                      <Trophy size="$2" color={"$orange7"} />
                    </XStack>
                  </Card.Header>
                  <Card.Background>
                    <BlurView intensity={50} tint="light" style={{ flex: 1 }}></BlurView>
                  </Card.Background>
                </Card>
              </YStack>
            </SafeAreaView>
          </LinearGradient>
        }
      >
        <ScrollView backgroundColor={"$blue1"}>
          <XStack $sm={{ flexDirection: "column" }} padding="$4" gap="$4">
            {data.map((module) => (
              <Link
                href={{
                  pathname: `(tabs)/(home)/module/${module.id}`,
                }}
                asChild
                key={module.id}
              >
                <Card bordered elevate borderRadius="$8" pressStyle={{ scale: 0.95 }} animation="bouncy" backgroundColor={"$blue1"}>
                  <Card.Header padded>
                    <YStack gap="$4" flex={1}>
                      <XStack justifyContent="space-between">
                        <XStack gap="$4" flex={1}>
                          <H1>{module.icon}</H1>
                          <YStack>
                            <H3 fontWeight={600}>{"Module " + module.id}</H3>

                            <Paragraph>{module.module_name}</Paragraph>
                          </YStack>
                        </XStack>

                        <Button fontWeight={600} borderRadius={"$8"} disabled>
                          {module.progress !== 0 ? "Continue" : "Start"}
                        </Button>
                      </XStack>
                      {module.progress !== 0 && (
                        <Progress value={module.progress} backgroundColor={"$gray3"}>
                          <Progress.Indicator animation="lazy" backgroundColor={"$blue10"} />
                        </Progress>
                      )}
                    </YStack>
                  </Card.Header>

                  <Card.Footer padded>
                    <XStack flex={1} />
                    {/* <Link
                      href={{
                        pathname: `(tabs)/home/module/${module.module_name}`,
                      }}
                      asChild
                    >
                      <Button borderRadius="$10">Continue</Button>
                    </Link> */}

                    {/* <Link href={`/(questions)`} asChild>
                      <Button borderRadius="$10">Continue</Button>
                    </Link> */}
                  </Card.Footer>
                </Card>
              </Link>
            ))}
          </XStack>
        </ScrollView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
