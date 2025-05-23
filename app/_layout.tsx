import { toastConfig } from "@/components/toastConfig";
import ModuleProvider from "@/context/module-context";
import UserProvider from "@/context/user-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    InterItalic: require("@tamagui/font-inter/otf/Inter-Italic.otf"),
    Bravura: require("../assets/fonts/BravuraText.otf"),
    MelodyBold: require("../assets/fonts/Melody-Bold.otf"),
    Karmina: require("../assets/fonts/Karmina-Regular.otf"),
    KarminaMedium: require("../assets/fonts/Karmina-Medium.otf"),
    KarminaBold: require("../assets/fonts/Karmina-Bold.otf"),
  });

  useEffect(() => {
    if (!loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    if (Platform.OS === "ios") {
      try {
        Purchases.configure({ apiKey: "appl_zZGUxbBzchveUkWXlMPDeuztdeD" });
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === "android") {
      // ANDROID LOGIC
    }
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || "light"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UserProvider>
          <ModuleProvider>
            <GestureHandlerRootView>
              <Stack initialRouteName="welcome">
                <Stack.Screen name="welcome" options={{ headerShown: false, animation: "fade" }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: "modal" }} />
                <Stack.Screen name="(questions)" options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="(ear-training)" options={{ headerShown: false }} />
                <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                <Stack.Screen name="out-of-lives" options={{ headerShown: false, presentation: "modal" }} />
                <Stack.Screen name="paywall" options={{ headerShown: false, presentation: "modal" }} />
                <Stack.Screen name="hearts" options={{ headerShown: false, presentation: "transparentModal", animation: "slide_from_bottom" }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Toast config={toastConfig} topOffset={60} />
            </GestureHandlerRootView>
          </ModuleProvider>
        </UserProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
