import { toastConfig } from "@/components/toastConfig";
import ModuleProvider from "@/context/module-context";
import UserProvider from "@/context/user-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { H4, TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "/",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = Network.useNetworkState();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    InterItalic: require("@tamagui/font-inter/otf/Inter-Italic.otf"),
    Bravura: require("../assets/fonts/BravuraText.otf"),
    VAG: require("../assets/fonts/VAG-Regular.otf"),
    VAGMedium: require("../assets/fonts/VAG-Medium.otf"),
    VAGBold: require("../assets/fonts/VAG-Bold.otf"),
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
        Purchases.configure({ apiKey: "appl_zZGUxbBzchveUkWXlMPDeuztdeD" });
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === "android") {
      // ANDROID LOGIC
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || "light"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UserProvider>
          <ModuleProvider>
            <GestureHandlerRootView>
              <Stack
                screenOptions={{
                  // header: (props) => <Header {...props} />,
                  headerTitle: (props) => <H4 fontWeight={600}>{props.children}</H4>,
                  //headerBackTitleVisible: false,
                }}
              >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(questions)" options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="(ear-training)" options={{ headerShown: false }} />
                <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                <Stack.Screen name="out-of-lives" options={{ headerShown: false, presentation: "modal" }} />
                <Stack.Screen name="paywall" options={{ headerShown: false, presentation: "modal" }} />
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
