import { SafeAreaView } from "react-native";
import { Button, CardHeader, H2, Paragraph, View } from "tamagui";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useState, useEffect } from "react";

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
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1} paddingHorizontal="$6" justifyContent="center" gap="$4">
        <View gap="$2">
          <H2 textAlign="center" fontWeight={800}>
            Never miss a beat
          </H2>
          <Paragraph textAlign="center">We'll send you notifications for your lessons, practice, and more.</Paragraph>
          <View gap="$3">
            <Button onPress={requestNotificationPermission} disabled={permissionStatus === "granted"}>
              {permissionStatus === "granted" ? "Notifications enabled" : "Enable notifications"}
            </Button>
            <Button variant="outlined" color="$gray12" onPress={handleSkip}>
              Skip for now
            </Button>
          </View>
        </View>
      </View>
      {/* <View marginTop="auto" padding="$4">
        <Button onPress={handleSkip}>Continue</Button>
      </View> */}
    </SafeAreaView>
  );
}
