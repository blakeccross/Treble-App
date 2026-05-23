import { toastConfig } from "@/components/toastConfig";
import PushNotificationHandler from "@/components/PushNotificationHandler";
import ModuleProvider from "@/context/module-context";
import UserProvider from "@/context/user-context";
import { ModuleHeroTransitionProvider } from "@/context/module-hero-transition";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { AppThemeProvider } from "@/theme/ThemeContext";
import * as Notifications from "expo-notifications";

const AppNavigationThemeLight = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#007AFF",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "rgba(0, 0, 0, 0.06)",
    notification: "#007AFF",
  },
};

const AppNavigationThemeDark = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#0A84FF",
    background: "#000000",
    card: "#121212",
    text: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.08)",
    notification: "#0A84FF",
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter-Medium.otf"),
    InterBold: require("../assets/fonts/Inter-Bold.otf"),
    Bravura: require("../assets/fonts/BravuraText.otf"),
    MelodyBold: require("../assets/fonts/Melody-Bold.otf"),
    Karmina: require("../assets/fonts/Karmina-Regular.otf"),
    KarminaMedium: require("../assets/fonts/Karmina-Medium.otf"),
    KarminaBold: require("../assets/fonts/Karmina-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    if (Platform.OS === "ios") {
      try {
        Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_APP_STORE_KEY || "",
        });
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === "android") {
      try {
        Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_PLAY_STORE_KEY || "",
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return (
    <AppThemeProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? AppNavigationThemeDark : AppNavigationThemeLight}
      >
        <UserProvider>
          <ModuleHeroTransitionProvider>
            <PushNotificationHandler />
            <ModuleProvider>
              <GestureHandlerRootView>
                <Stack initialRouteName="welcome">
                <Stack.Screen
                  name="welcome"
                  options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(auth)"
                  options={{ headerShown: false, presentation: "modal" }}
                />
                <Stack.Screen
                  name="(questions)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="(ear-training)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(settings)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="out-of-lives"
                  options={{ headerShown: false, presentation: "modal" }}
                />
                <Stack.Screen
                  name="paywall"
                  options={{ headerShown: false, presentation: "modal" }}
                />
                <Stack.Screen
                  name="hearts"
                  options={{
                    headerShown: false,
                    presentation: "transparentModal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Toast config={toastConfig} topOffset={60} />
            </GestureHandlerRootView>
          </ModuleProvider>
          </ModuleHeroTransitionProvider>
        </UserProvider>
      </ThemeProvider>
    </AppThemeProvider>
  );
}
