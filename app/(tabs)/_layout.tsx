import { Tabs } from "expo-router";
import React from "react";

import TabBar from "@/components/tab-bar";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ear, Home, Smile } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home />,
        }}
      />
      <Tabs.Screen
        name="ear-training"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Ear />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <Smile />,
        }}
      />
    </Tabs>
  );
}
