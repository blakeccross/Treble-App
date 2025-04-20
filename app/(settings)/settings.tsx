import { useUser } from "@/context/user-context";
import { ArrowLeft, ChevronRight, HelpCircle, Lock, Moon, User, Volume2 } from "@tamagui/lucide-icons";
import { Link, RelativePathString, router } from "expo-router";
import React from "react";
import { Alert, FlatList, Pressable, SafeAreaView } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { H4, H5, XStack, YStack } from "tamagui";

export default function ProfileSettings() {
  const { currentUser, handleSignOut } = useUser();
  const [hasSeenWelcomeScreen, setHasSeenWelcomeScreen] = useMMKVBoolean("hasSeenWelcomeScreen");

  const menuItems = [
    {
      name: currentUser?.id ? "Profile" : "Create Profile",
      href: currentUser?.id ? "/(settings)/profile" : "(auth)/welcome",
      icon: <User size="$2" />,
    },
    { name: "Appearance", href: "/(settings)/appearance", icon: <Moon size="$1.5" /> },
    { name: "Audio", href: "/(settings)/audio", icon: <Volume2 /> },
    { name: "Help", href: "/(settings)/help", icon: <HelpCircle size="$1.5" /> },
    // { name: "Notifications", href: "/(settings)/notifications", icon: <Bell size="$1.5" /> },
  ];

  async function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: () => {
          handleSignOut();
          // setHasSeenWelcomeScreen(true);
          router.replace("/(tabs)/(home)");
        },
      },
    ]);
  }

  return (
    <SafeAreaView>
      <SafeAreaView />
      <YStack gap="$2" padding="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismissTo("/(tabs)/profile")}>
            <ArrowLeft size="$3" />
          </Pressable>
          <H5 fontWeight={500}>Settings</H5>

          <XStack gap="$1" width={"$3"}></XStack>
        </XStack>
      </YStack>

      <YStack padding="$4">
        <FlatList
          data={menuItems}
          style={{ height: "100%" }}
          renderItem={({ item }) => (
            <Link asChild href={item.href as RelativePathString}>
              <XStack alignItems="center" justifyContent="space-between" paddingVertical="$3" borderBottomWidth={1} borderBottomColor="$gray7">
                <XStack alignItems="center" gap="$2">
                  {item.icon}
                  <H4>{item.name}</H4>
                </XStack>
                <ChevronRight size="$2" />
              </XStack>
            </Link>
          )}
          ListFooterComponent={
            currentUser?.id ? (
              <Pressable onPress={handleLogout}>
                <XStack alignItems="center" justifyContent="space-between" paddingVertical="$3" borderBottomWidth={1} borderBottomColor="$gray7">
                  <XStack alignItems="center" gap="$2">
                    <Lock size="$1.5" color="$red9" />
                    <H4 color="$red9">Log out</H4>
                  </XStack>
                </XStack>
              </Pressable>
            ) : null
          }
        />

        {/* <Button onPress={() => router.push("/(settings)/profile")}>Profile</Button> */}
      </YStack>
    </SafeAreaView>
  );
}
