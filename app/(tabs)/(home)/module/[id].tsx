import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ModuleContext } from "@/context/module-context";
import { ArrowLeft, ChevronLast, ChevronLeft, StepBack } from "@tamagui/lucide-icons";
import { blue, blueDark } from "@tamagui/themes";
import { Link, router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Button, H1, H2, H3, Paragraph, ScrollView, XStack } from "tamagui";

export default function ModuleStartScreen() {
  const { id } = useLocalSearchParams();
  const { data: moduleData } = useContext(ModuleContext);
  const module = moduleData.find((item) => item.id === Number(id));

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: blue.blue10, dark: blueDark.blue10 }}
      headerImage={
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: blue.blue10 }} />
          <SafeAreaView>
            <View style={{ padding: 20, height: 250, width: "100%", backgroundColor: blue.blue10 }}>
              <XStack gap="$4">
                <Button icon={<ArrowLeft size="$3" />} circular onPress={() => router.dismiss()} themeInverse />
                <H2 color={"$background"} fontWeight={600}>
                  {module?.title}
                </H2>
              </XStack>
            </View>
          </SafeAreaView>
        </>
      }
    >
      <ScrollView style={{ padding: 20 }}>
        <Paragraph size="$6">{module?.description}</Paragraph>

        <Link href={`/module-overview/${module?.id}`} asChild onPress={() => router.dismiss()}>
          <Button size="$6" fontWeight={600} marginTop="$4">
            Complete
          </Button>
        </Link>
      </ScrollView>
    </ParallaxScrollView>
  );
}
