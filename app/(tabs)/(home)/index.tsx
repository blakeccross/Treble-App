import LoadingIndicator from "@/components/loading";
import { ModuleCard } from "@/components/ModuleCard";
import { HomeHeroReverseHandler } from "@/components/home/HomeHeroReverseHandler";
import { pickResumeModule, ResumeHero } from "@/components/home/ResumeHero";
import { SectionLabel } from "@/components/home/SectionLabel";
import Paywall from "@/components/paywall.modal";
import XPHistoryModal from "@/components/XPHistory.modal";
import { ModuleContext } from "@/context/module-context";
import { useUser } from "@/context/user-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { red, yellow } from "@/theme/colors";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { Link, Redirect, router } from "expo-router";
import * as StoreReview from "expo-store-review";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppTheme } from "@/theme/ThemeContext";
import { FlatList, StatusBar, StyleSheet } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  H1,
  Heart,
  LinearGradient,
  Paragraph,
  RefreshCw,
  ScrollView,
  View,
  XStack,
  YStack,
} from "@/ui";

/** Soft blue wash behind the header area */
const HOME_TOP_GRADIENT = {
  light: [
    "rgba(0, 122, 255, 0.11)",
    "rgba(0, 122, 255, 0.03)",
    "transparent",
  ] as const,
  dark: [
    "rgba(10, 132, 255, 0.16)",
    "rgba(10, 132, 255, 0.05)",
    "transparent",
  ] as const,
};

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { modules, refreshModules, isModuleUpdateAvailable } =
    useContext(ModuleContext);
  const [hasSeenWelcomeScreen, setHasSeenWelcomeScreen] = useMMKVBoolean(
    "hasSeenWelcomeScreen",
  );
  const { currentUser, lives } = useUser();
  const [openPaywall, setOpenPaywall] = useState(false);
  const [openXPHistory, setOpenXPHistory] = useState(false);

  const networkState = Network.useNetworkState();
  const { name: themeName } = useAppTheme();
  const isDark = themeName === "dark";
  const hasRequestedReview = useRef(false);

  const firstName = currentUser?.full_name?.trim().split(/\s+/)[0];
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const resumeModule = useMemo(
    () => (modules?.data?.length ? pickResumeModule(modules.data) : null),
    [modules?.data],
  );

  const modulesListData = useMemo(() => {
    if (!modules?.data?.length) return [];
    if (!resumeModule || modules.data.length <= 1) return modules.data;
    return modules.data.filter((m) => m.id !== resumeModule.id);
  }, [modules?.data, resumeModule]);

  useEffect(() => {
    if (
      hasSeenWelcomeScreen &&
      !hasRequestedReview.current &&
      Device.isDevice
    ) {
      hasRequestedReview.current = true;
      StoreReview.requestReview();
    }
  }, [hasSeenWelcomeScreen]);

  if (!hasSeenWelcomeScreen && !currentUser) {
    return <Redirect href={"/welcome"} />;
  }

  return (
    <>
      <HomeHeroReverseHandler />
      <View flex={1} backgroundColor="$background">
        <LinearGradient
          colors={
            isDark ? [...HOME_TOP_GRADIENT.dark] : [...HOME_TOP_GRADIENT.light]
          }
          start={[0.5, 0]}
          end={[0.5, 1]}
          style={[styles.topGradient, { height: top + 260 }]}
        />
        <View flex={1} paddingTop={top} zIndex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={isDark ? "light-content" : "dark-content"}
          />
          <View paddingHorizontal="$4" paddingTop="$2" paddingBottom="$1">
            <XStack justifyContent="space-between" alignItems="center">
              <View
                minWidth={"$10"}
                paddingBottom={"$3"}
                alignItems="flex-start"
              >
                {currentUser?.id ? (
                  <Link asChild href={"/profile"}>
                    <Avatar circular size="$3" pressStyle={{ scale: 0.96 }}>
                      {currentUser?.avatar_url && (
                        <Avatar.Image
                          accessibilityLabel="Profile"
                          src={currentUser?.avatar_url}
                        />
                      )}
                      <Avatar.Fallback backgroundColor="$gray3" />
                      <FontAwesome6
                        name="user-large"
                        size={18}
                        color="#6B7280"
                      />
                    </Avatar>
                  </Link>
                ) : (
                  <Link asChild href={"/(auth)/welcome"}>
                    <Paragraph
                      color="$blue10"
                      fontFamily="InterBold"
                      fontSize="$4"
                    >
                      Sign up / Log in
                    </Paragraph>
                  </Link>
                )}
              </View>

              <XStack gap="$4" alignItems="center">
                {!currentUser?.is_subscribed && (
                  <XStack
                    gap="$1"
                    alignItems="center"
                    onPress={() => router.push("/hearts")}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <Heart size="$1.5" color="$red10" fill={red.red10} />
                    <Paragraph
                      fontFamily="InterBold"
                      fontSize="$5"
                      color="$color"
                    >
                      {lives}
                    </Paragraph>
                  </XStack>
                )}
                <XStack
                  gap="$1"
                  alignItems="center"
                  onPress={() => setOpenXPHistory(true)}
                  pressStyle={{ scale: 0.98 }}
                >
                  <AntDesign name="star" size={18} color={yellow.yellow10} />
                  <Paragraph
                    fontFamily="InterBold"
                    fontSize="$5"
                    color="$color"
                  >
                    {currentUser?.total_xp || 0}
                  </Paragraph>
                </XStack>
              </XStack>
            </XStack>
          </View>

          <XPHistoryModal
            openXPHistory={openXPHistory}
            setOpenXPHistory={setOpenXPHistory}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            flex={1}
            zIndex={1}
            onScroll={({ nativeEvent }) => {
              if (
                nativeEvent.contentOffset.y < -200 &&
                !modules?.loading &&
                networkState.isConnected
              ) {
                refreshModules();
              }
            }}
            scrollEventThrottle={16}
          >
            <View flex={1} overflow="hidden" paddingTop="$1">
              {!networkState.isConnected && (
                <View>
                  <Paragraph
                    textAlign="center"
                    marginTop={"$2"}
                    color="$gray11"
                  >
                    You are offline
                  </Paragraph>
                </View>
              )}

              <View
                paddingHorizontal="$4"
                paddingTop="$2"
                paddingBottom="$2"
                maxWidth={720}
                width="100%"
                alignSelf="center"
              >
                {modules && modules.loading ? (
                  <View
                    width={"100%"}
                    height={400}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <LoadingIndicator />
                  </View>
                ) : modules?.error ? (
                  <View
                    width={"100%"}
                    height={400}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Paragraph
                      textAlign="center"
                      marginBottom={"$2"}
                      color="$gray11"
                    >
                      Error loading modules
                    </Paragraph>
                    <Button icon={RefreshCw} onPress={refreshModules}>
                      Try again
                    </Button>
                  </View>
                ) : (
                  modules &&
                  modules.data && (
                    <>
                      {isModuleUpdateAvailable && (
                        <Button
                          borderRadius="$4"
                          marginBottom="$4"
                          backgroundColor="$blue10"
                          onPress={refreshModules}
                          icon={RefreshCw}
                        >
                          Update available
                        </Button>
                      )}
                      {resumeModule && (
                        <>
                          <SectionLabel marginTop="$1">Resume</SectionLabel>
                          <ResumeHero module={resumeModule} />
                        </>
                      )}
                      {modulesListData.length > 0 && (
                        <SectionLabel marginTop={resumeModule ? "$6" : "$2"}>
                          {resumeModule ? "All modules" : "Modules"}
                        </SectionLabel>
                      )}
                      <FlatList
                        data={modulesListData}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        style={{ minHeight: 240 }}
                        renderItem={({ item: module, index }) => (
                          <ModuleCard
                            key={module.id}
                            module={module}
                            disabled={!module.is_available}
                            showDivider={index < modulesListData.length - 1}
                          />
                        )}
                      />
                    </>
                  )
                )}
              </View>
              <Paywall
                openPaywall={openPaywall}
                setOpenPaywall={setOpenPaywall}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
});
