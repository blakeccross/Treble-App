import React from "react";

import { View, Pressable, Dimensions, StyleSheet, useColorScheme, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { blueDark, color, gray } from "@tamagui/themes";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <BlurView style={styles.mainContainer} tint="regular">
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const icon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }
        };

        return (
          <View key={index} style={styles.mainItemContainer}>
            <Pressable
              onPress={onPress}
              style={{ backgroundColor: isFocused ? (colorScheme === "light" ? "white" : blueDark.blue1) : "transparent", borderRadius: 50 }}
            >
              <View style={{ justifyContent: "center", alignItems: "center", flex: 1, padding: 15 }}>
                {icon && icon({ focused: true, color: "black", size: 30 })}
              </View>
            </Pressable>
          </View>
        );
      })}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: Platform.OS === "android" ? "#ffffffcdf" : undefined,
  },
  mainItemContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 1,
    borderColor: "#333B42",
  },
});

export default TabBar;
