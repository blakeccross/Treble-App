import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  useColorScheme,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "expo-router/js-tabs";
import type { NavigationRoute, ParamListBase } from "expo-router/react-navigation";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";

/** Robinhood-style full-width tab bar (web). */
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme === "dark" ? "dark" : "light"];
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
          borderTopColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {state.routes.map(
        (route: NavigationRoute<ParamListBase, string>, index: number) => {
          const { options } = descriptors[route.key];
          const icon = options.tabBarIcon;
          const isFocused = state.index === index;
          const iconColor = isFocused
            ? palette.tabIconSelected
            : palette.tabIconDefault;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tab,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.iconWrap}>
                {icon?.({ focused: isFocused, color: iconColor, size: 24 })}
              </View>
            </Pressable>
          );
        },
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TabBar;
