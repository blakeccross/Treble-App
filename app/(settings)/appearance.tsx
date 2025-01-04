import { UserContext } from "@/context/user-context";
import { Check, Moon, Sun, SunMoon, X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Appearance, Pressable, SafeAreaView, useColorScheme } from "react-native";
import { H4, H5, ScrollView, XStack, YStack } from "tamagui";

type FormInput = {
  fullName: string;
  email: string;
  password: string;
};

export default function AppearanceSettings() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | null>(colorScheme || null);

  const handleThemeChange = (selectedTheme: "light" | "dark" | null) => {
    Appearance.setColorScheme(selectedTheme);
    setTheme(selectedTheme);
  };

  return (
    <SafeAreaView>
      <YStack padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()}>
            <X size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Appearance</H5>

          <XStack gap="$1" width={"$3"}></XStack>
        </XStack>

        {["light", "dark", null].map((themeOption) => (
          <Pressable key={themeOption} onPress={() => handleThemeChange(themeOption as "light" | "dark" | null)}>
            <XStack alignItems="center" justifyContent="space-between" paddingVertical="$3" borderBottomWidth={1} borderBottomColor="$gray7">
              <XStack alignItems="center" gap="$2">
                {themeOption === "light" && <Sun size="$1.5" />}
                {themeOption === "dark" && <Moon size="$1.5" />}
                {themeOption === null && <SunMoon size="$1.5" />}
                <H4>{themeOption === "light" ? "Light" : themeOption === "dark" ? "Dark" : "System"}</H4>
              </XStack>
              {theme === themeOption && <Check size="$1.5" color="$blue10" />}
            </XStack>
          </Pressable>
        ))}
      </YStack>
      <ScrollView height={"100%"}></ScrollView>
    </SafeAreaView>
  );
}
