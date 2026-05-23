import { PaywallShell } from "@/components/paywall/PaywallShell";
import { UserContext } from "@/context/user-context";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import Purchases from "react-native-purchases";

export default function Paywall() {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);
    try {
      if (await Purchases.isConfigured()) {
        const offerings = await Purchases.getOfferings();
        const { customerInfo } = await Purchases.purchasePackage(
          offerings.all.monthly_test.availablePackages[0],
        );
        if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
          await handleUpdateUserInfo({ is_subscribed: true });
          router.dismissAll();
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "Purchase was cancelled.") {
        Alert.alert("Error purchasing", "Please try again later or contact support", [
          { text: "OK", onPress: () => {} },
          {
            text: "Help",
            onPress: () => {
              router.replace("/(settings)/help");
            },
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PaywallShell
      isSubscribed={!!currentUser?.is_subscribed}
      isLoading={isLoading}
      onSubscribe={handleSubscribe}
      onContinueSuccess={() => router.dismissAll()}
      onClose={() => router.dismissAll()}
      showCloseButton
    />
  );
}
