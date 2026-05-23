import { PaywallShell } from "@/components/paywall/PaywallShell";
import { UserContext } from "@/context/user-context";
import React, { useContext, useEffect, useState } from "react";
import Purchases from "react-native-purchases";

export default function Paywall({
  openPaywall,
  setOpenPaywall,
}: {
  openPaywall: boolean;
  setOpenPaywall: (open: boolean) => void;
}) {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.is_subscribed) {
      setModalVisible(openPaywall);
    }
  }, [openPaywall, currentUser?.is_subscribed]);

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
          setOpenPaywall(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const dismiss = () => {
    setOpenPaywall(false);
    setModalVisible(false);
  };

  return (
    <PaywallShell
      isSubscribed={!!currentUser?.is_subscribed}
      isLoading={isLoading}
      onSubscribe={handleSubscribe}
      onContinueSuccess={dismiss}
      onClose={dismiss}
      showCloseButton
      modalPresented
      modalVisible={modalVisible}
      onModalRequestClose={dismiss}
    />
  );
}
