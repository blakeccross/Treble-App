import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ModuleContext } from "@/context/module-context";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { blue, blueDark } from "@tamagui/themes";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import { Button, H2, Paragraph, ScrollView, XStack } from "tamagui";

export default function ModuleStartScreen() {
  const { id } = useLocalSearchParams();
  const { modules } = useContext(ModuleContext);
  const module = modules.data && modules.data.find((item) => item.id === Number(id));

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: blue.blue10, dark: blueDark.blue10 }}
      headerImage={
        <>
          <View style={{ position: "relative", width: "100%", height: 250 }}>
            <Image
              source={module?.local_poster_uri} // Replace with your image URL
              style={{ position: "absolute", width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <View style={{ padding: 20, height: 250, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
              <SafeAreaView />
              <XStack gap="$4">
                <Button icon={<ArrowLeft size="$3" />} circular onPress={() => router.dismiss()} themeInverse />
                <H2 color={"$background"} fontWeight={600}>
                  {module?.title}
                </H2>
              </XStack>
            </View>
          </View>
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
