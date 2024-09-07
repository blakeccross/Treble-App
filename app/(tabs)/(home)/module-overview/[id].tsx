import { ArrowLeft, Check, ChevronRight, Lock, Play, RefreshCw } from "@tamagui/lucide-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, useWindowDimensions, LayoutChangeEvent, FlatList } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";

import { H2, H3, H4, ListItem, Paragraph, ScrollView, Separator, View, XStack, YGroup, YStack } from "tamagui";
import { window } from "@/utils";
import { Dropdown } from "@/components/dropdown";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { blue, blueDark } from "@tamagui/themes";
import { Button } from "@/components/button";
import { StickyHeader } from "@/components/StickyHeader";

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.height;

export default function ModuleStartScreen() {
  const { data } = useContext(ModuleContext);
  const { currentUser } = useContext(UserContext);
  const { id } = useLocalSearchParams();
  const currentModule = data.find((item) => item.id === Number(id));
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleModule, setVisibleModule] = useState("Module 1");
  const [snapIntervals, setSnapIntervals] = useState<number[]>([]);
  const moduleHeights = useRef<number[]>([]);

  function handleSelectModule(value: string) {
    setVisibleModule(value);
    const selectedModuleIndex = data.findIndex((item) => item.title === value);

    const scrollPosition = snapIntervals[selectedModuleIndex - 1];

    scrollViewRef.current?.scrollTo({ x: 0, y: scrollPosition, animated: true });
  }

  useEffect(() => {
    if (!currentModule) router.replace("/(home)");
  }, []);

  return (
    <StickyHeader image={currentModule?.local_poster_uri || ""} title={currentModule?.title || ""}>
      <ScrollView backgroundColor={"$background"} minHeight={PAGE_HEIGHT / 1.2}>
        <View paddingBottom="$15">
          {currentModule?.section.map((section) => (
            <Link
              asChild
              href={{ pathname: `/${section.section_item[0]?.type}`, params: { module_id: currentModule.id, section_id: section.id } }}
              disabled={(section.premium && currentUser?.premium) || !section.section_item[0]?.type}
              key={section.id}
            >
              <XStack padding="$4" justifyContent="space-between" pressStyle={{ scale: 0.99, backgroundColor: "$backgroundPress" }}>
                <YStack flex={1}>
                  <H4 fontWeight={600}>{section.title}</H4>
                  <Paragraph>
                    15 minutes{" "}
                    {section.completed && (
                      <>
                        •{" "}
                        <Paragraph color={"$blue10"} fontWeight={600}>
                          Completed
                        </Paragraph>
                      </>
                    )}
                  </Paragraph>
                </YStack>
                <Button variant="outlined" theme={"alt1"} circular icon={section.completed ? RefreshCw : Play} />
              </XStack>
            </Link>
          ))}
        </View>
      </ScrollView>
    </StickyHeader>
  );
}
