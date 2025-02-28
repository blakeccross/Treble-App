import { QuizContext } from "@/context/quiz-context";
import { Check } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import { Button, H2, Paragraph, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function Index() {
  const router = useRouter();
  const { currentModule } = useContext(QuizContext);
  // const { numOfCorrectAnswers, moduleComplete } = useLocalSearchParams();

  function handle() {
    // router.dismissAll();
    router.navigate({
      pathname: "/module-overview/[id]",
      params: { id: currentModule.id },
    });
  }
  return (
    <LinearGradient width="100%" height="100%" colors={["$purple10", "$purple8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
      <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
        <XStack gap="$2">
          <Paragraph color={"$background"}>Completed</Paragraph>
          <Check color={"$background"} size={"$1"} />
        </XStack>
        <H2
          key={0}
          color={"$background"}
          fontWeight={800}
          enterStyle={{
            scale: 3,
            y: -10,
            opacity: 0,
          }}
          opacity={1}
          scale={1}
          y={0}
          // animation="lazy"
          textAlign="center"
        >
          Wow you finished an entire module!
        </H2>
      </YStack>
      <YStack padding="$4" gap="$5">
        {/* <View>
          <H4 color={"$background"} fontWeight={600}>
            Your rewards
          </H4>
          <YGroup
            alignSelf="center"
            bordered
            size="$4"
            enterStyle={{
              // scale: 3,
              y: 100,
              opacity: 0,
            }}
            // animation="lazy"
          >
            <YGroup.Item>
              <ListItem hoverTheme icon={Star} title={`${numOfCorrectAnswers} XP`} color={"$blue10"} />
            </YGroup.Item>
          </YGroup>
        </View> */}
        <View>
          <Button onPress={handle} fontWeight={600} fontSize={"$7"} height={"$5"} width={"100%"} themeInverse>
            Continue
          </Button>
        </View>
      </YStack>

      <SafeAreaView />
    </LinearGradient>
  );
}
