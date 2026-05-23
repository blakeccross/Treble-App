import { Button, H2, Paragraph, View, YStack } from "@/ui";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus>();

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") {
      router.push("/(auth)/(sign-up)/paywall");
    }
    setPermissionStatus(status);
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    if (status === "granted") {
      router.push("/(auth)/(sign-up)/paywall");
    }
  };

  const handleSkip = () => {
    router.push("/(auth)/(sign-up)/paywall");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <View flex={1} backgroundColor="$background">
        <YStack
          flex={1}
          justifyContent="center"
          paddingHorizontal="$5"
          gap="$6"
          maxWidth={440}
          alignSelf="center"
          width="100%"
        >
          <YStack gap="$3">
            <H2 textAlign="center" fontWeight="normal">
              Stay in the rhythm
            </H2>
            <Paragraph textAlign="center" color="$gray11">
              Optional reminders for lessons and practice. You can change this anytime in Settings.
            </Paragraph>
          </YStack>
          <YStack gap="$3">
            <Button
              height="$5"
              borderRadius="$6"
              onPress={requestNotificationPermission}
              disabled={permissionStatus === "granted"}
              elevate
            >
              {permissionStatus === "granted" ? "Notifications on" : "Enable notifications"}
            </Button>
            <Button variant="outlined" height="$5" borderRadius="$6" onPress={handleSkip}>
              Not now
            </Button>
          </YStack>
        </YStack>
      </View>
    </SafeAreaView>
  );
}
