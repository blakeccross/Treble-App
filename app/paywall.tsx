import { UserContext } from "@/context/user-context";
import { Star } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import Purchases from "react-native-purchases";
import { Button, H3, ListItem, Separator, View, YGroup } from "tamagui";

export default function Paywall({ openPaywall, setOpenPaywall }: { openPaywall: boolean; setOpenPaywall: (open: boolean) => void }) {
  const { currentUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!currentUser?.purchased_products?.length) {
      setModalVisible(openPaywall);
    }
  }, [openPaywall]);

  async function handleTryForFree() {
    if (await Purchases.isConfigured()) {
      const offerings = await Purchases.getOfferings();
      const { customerInfo } = await Purchases.purchasePackage(offerings.all.monthly_test.availablePackages[0]);
      if (typeof customerInfo.entitlements.active["my_entitlement_identifier"] !== "undefined") {
        // Unlock that great "pro" content
      }
    }
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={modalVisible}
      onRequestClose={() => {
        setOpenPaywall(!modalVisible);
      }}
    >
      <View backgroundColor="$background" flex={1}>
        <Image source={require("@/assets/images/gold_subscription.jpg")} style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "grey" }} />
        <View padding="$4" flex={1} height={"100%"} justifyContent="space-between">
          <View>
            <View>
              <H3 fontWeight={800} textAlign="center">
                Unlock your learning potential
              </H3>
            </View>
            <YGroup alignSelf="center" bordered size="$4" separator={<Separator />}>
              <YGroup.Item>
                <ListItem hoverTheme icon={Star} title="Unlock All Modules" subTitle="Begin learning beyond the basics" />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem hoverTheme icon={Star} title="All Games" subTitle="Train your ear with fun games" />
              </YGroup.Item>
            </YGroup>
          </View>
          <View>
            <Button onPress={handleTryForFree}>Try for $0.00</Button>
            <Button unstyled color={"$gray12"} textAlign="center" padding="$4" onPress={() => setOpenPaywall(false)}>
              No Thanks
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
