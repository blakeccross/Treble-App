import { Check, ChevronRight, Lock } from "@tamagui/lucide-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, SafeAreaView, useWindowDimensions, ScrollView, LayoutChangeEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { H3, ListItem, Separator, YGroup } from "tamagui";
import { window } from "@/utils";
import { Dropdown } from "@/components/dropdown";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.height;

export default function ModuleStartScreen() {
  const { data } = useContext(ModuleContext);
  const currentUser = useContext(UserContext);
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleModule, setVisibleModule] = useState("Module 1");
  const [snapIntervals, setSnapIntervals] = useState<number[]>([]);
  const moduleHeights = useRef<number[]>([]);

  function handleSelectModule(value: string) {
    setVisibleModule(value);
    const selectedModuleIndex = data.findIndex((item) => item.module_name === value);

    const scrollPosition = snapIntervals[selectedModuleIndex - 1];

    scrollViewRef.current?.scrollTo({ x: 0, y: scrollPosition, animated: true });
  }

  function findIndexBinarySearch(arr: number[], num: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= num && num < arr[mid + 1]) {
        return mid + 1;
      } else if (num < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return 0;
  }

  function handleOnScroll(event: any) {
    const currentVisibleIndex = findIndexBinarySearch(snapIntervals, event.nativeEvent.contentOffset.y);
    setVisibleModule(data[currentVisibleIndex].module_name);
  }

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    const { height } = event.nativeEvent.layout;
    moduleHeights.current[index] = height;

    if (moduleHeights.current.length === data.length) {
      const offsets = moduleHeights.current.reduce((acc, height) => {
        acc.push((acc[acc.length - 1] || 0) + height);
        return acc;
      }, [] as number[]);
      setSnapIntervals(offsets);
    }
  };

  // useEffect(() => {
  //   // Reset moduleHeights when data changes
  //   moduleHeights.current = new Array(data.length).fill(0);
  // }, [data]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <View style={{ paddingHorizontal: 20 }}>
        <Dropdown
          // id="select-demo-1"
          size={"$5"}
          title="Select a Module"
          data={data.map((item) => item.module_name)}
          value={visibleModule}
          onValueChange={handleSelectModule}
          defaultValue={visibleModule}
        />
      </View>

      <View>
        <ScrollView
          ref={scrollViewRef}
          // snapToInterval={PAGE_HEIGHT}
          snapToOffsets={snapIntervals}
          style={{ paddingHorizontal: 20 }}
          onScroll={handleOnScroll}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
          contentContainerStyle={{ paddingBottom: 300 }}
        >
          {data.map((item, index) => (
            <YGroup separator={<Separator />} key={item.id} onLayout={(event) => handleLayout(event, index)} paddingBottom="$6">
              <H3 textAlign="center" marginVertical="$3">
                {item.module_name}
              </H3>
              {item.tasks.map((item) => (
                <YGroup.Item key={item.id}>
                  <Link asChild href={"/(questions)/loading"} disabled={item.premium && currentUser.premium}>
                    <ListItem
                      title={item.title}
                      subTitle="Second subtitle"
                      icon={item.completed ? <Check color={"$green10"} size={"$1"} /> : <></>}
                      iconAfter={item.premium && currentUser.premium ? <Lock /> : <ChevronRight />}
                      pressStyle={{ scale: 0.98 }}
                      animation="bouncy"
                      backgroundColor={item.premium && currentUser.premium ? "$gray8" : "$background"}
                      elevate
                    />
                  </Link>
                </YGroup.Item>
              ))}
            </YGroup>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
