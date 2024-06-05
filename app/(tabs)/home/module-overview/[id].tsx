import { Check, ChevronRight, Lock } from "@tamagui/lucide-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, SafeAreaView, useWindowDimensions, ScrollView } from "react-native";
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

  function handleSelectModule(value: string) {
    setVisibleModule(value);
    const scrollPosition = data.findIndex((item) => item.module_name === value) * PAGE_HEIGHT;
    scrollViewRef.current?.scrollTo({ x: 0, y: scrollPosition, animated: true });
  }

  function handleOnScroll(event: any) {
    //calculate screenIndex by contentOffset and screen width
    setVisibleModule(data[Math.round(event.nativeEvent.contentOffset.y / PAGE_HEIGHT)].module_name);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          snapToInterval={PAGE_HEIGHT}
          style={{ paddingHorizontal: 20 }}
          onScroll={handleOnScroll}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item) => (
            <YGroup separator={<Separator />} key={item.id} height={PAGE_HEIGHT}>
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
    </SafeAreaView>
  );
}
