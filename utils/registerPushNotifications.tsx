import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync() {
  let token;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("myNotificationChannel", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }
  } catch (error) {
    console.error("Error getting push notification permissions:", error);
    return null;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }

    // Add timeout to prevent hanging
    const tokenPromise = Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("getExpoPushTokenAsync timeout after 10 seconds")), 10000);
    });

    try {
      const result = await Promise.race([tokenPromise, timeoutPromise]);
      token = (result as any).data;
    } catch (timeoutError) {
      console.error("registerForPushNotificationsAsync: getExpoPushTokenAsync timed out or failed", timeoutError);
      throw timeoutError;
    }
  } catch (e) {
    token = null;
  }

  return token;
}
