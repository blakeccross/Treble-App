import { tabIcons } from "@/constants/tabIcons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const iconColor =
    Platform.OS === "ios"
      ? DynamicColorIOS({
          light: colors.tabIconDefault,
          dark: colors.tabIconDefault,
        })
      : colors.tabIconDefault;

  const tintColor =
    Platform.OS === "ios"
      ? DynamicColorIOS({
          light: colors.tabIconSelected,
          dark: colors.tabIconSelected,
        })
      : colors.tabIconSelected;

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      iconColor={{ default: iconColor, selected: tintColor }}
      tintColor={tintColor}
    >
      <NativeTabs.Trigger name="(home)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={tabIcons.home} renderingMode="template" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ear-training">
        <NativeTabs.Trigger.Label>Ear Training</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={tabIcons.earTraining}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={tabIcons.profile}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
