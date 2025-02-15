import { DarkTheme, DefaultTheme, ThemeProvider, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useContext, useEffect } from "react";
import { createTamagui, H3, H4, TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModuleProvider from "@/context/module-context";
import UserProvider, { UserContext } from "@/context/user-context";
import Header from "@/components/header";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toastConfig";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "/",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    InterItalic: require("@tamagui/font-inter/otf/Inter-Italic.otf"),
    Bravura: require("../assets/fonts/BravuraText.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    if (Platform.OS === "ios") {
      try {
        Purchases.configure({ apiKey: "appl_zZGUxbBzchveUkWXlMPDeuztdeD" });
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === "android") {
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
