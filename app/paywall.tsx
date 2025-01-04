import { UserContext } from "@/context/user-context";
import { Check, Star } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import React, { useContext, useEffect, useState } from "react";
import { Modal, SafeAreaView } from "react-native";
import Purchases from "react-native-purchases";
import { Button, H1, H2, H3, H4, ListItem, Paragraph, Separator, View, XStack, YGroup, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function Paywall({ openPaywall, setOpenPaywall }: { openPaywall: boolean; setOpenPaywall: (open: boolean) => void }) {
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (currentUser?.is_subscribed === false) {
      setModalVisible(openPaywall);
    }
  }, [openPaywall]);

  async function handleTryForFree() {
    if (await Purchases.isConfigured()) {
      const offerings = await Purchases.getOfferings();
      const { customerInfo } = await Purchases.purchasePackage(offerings.all.monthly_test.availablePackages[0]);
      if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
        await handleUpdateUserInfo({ is_subscribed: true });
        setOpenPaywall(false);
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
        setModalVisible(false);
      }}
    >
      {!currentUser?.is_subscribed ? (
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
      ) : (
        <LinearGradient width="100%" height="100%" colors={["$blue10", "$blue8"]} start={[0.5, 1]} end={[0, 0]} paddingHorizontal={"$4"}>
          <YStack alignItems="center" justifyContent="center" flex={1} padding="$4">
            <XStack gap="$2">
              <Paragraph color={"$background"}>Success!</Paragraph>
              <Check color={"$background"} size={"$1"} />
            </XStack>
            <H2
              key={0}
              color={"$background"}
              textAlign="center"
              fontWeight={800}
              enterStyle={{
                scale: 3,
                y: -10,
                opacity: 0,
              }}
              opacity={1}
              scale={1}
              y={0}
              animation="lazy"
            >
              Welcome to the Treble Pro!
            </H2>
          </YStack>
          <Button onPress={() => setModalVisible(false)} fontWeight={600} fontSize={"$7"} height={"$5"} width={"100%"} themeInverse>
            Continue
          </Button>

          <SafeAreaView />
        </LinearGradient>
      )}
    </Modal>
  );
}
