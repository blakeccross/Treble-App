import React, { useEffect, useState } from "react";
import { Button, H2, H3, H4, H5, Paragraph, Separator, View, YStack } from "tamagui";
import BottomSheet from "./BottomSheet";
import { FlatList, SafeAreaView } from "react-native";
import moment from "moment";
import { XPHistory } from "../types";
import { useUser } from "../context/user-context";
import { Heart, HeartCrack, LockOpen } from "@tamagui/lucide-icons";

export default function HeartModal({ openHeartModal, setOpenHeartModal }: { openHeartModal: boolean; setOpenHeartModal: (open: boolean) => void }) {
  const { lives, livesRefreshTime } = useUser();
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const refreshTime = moment(livesRefreshTime);
      const duration = moment.duration(refreshTime.diff(now));
      const formatted = `${duration.minutes()}m ${duration.seconds()}s`;
      setCountdown(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, [livesRefreshTime]);

  return (
    <BottomSheet isOpen={openHeartModal} setIsOpen={setOpenHeartModal}>
      <YStack flex={1} gap="$4" paddingBottom={"$8"}>
        <View marginTop={"$4"} alignItems="center">
          {lives !== undefined && lives <= 0 ? <HeartCrack color={"$red10"} size={"$10"} /> : <Heart color={"$red10"} size={"$10"} />}
          <H2>{lives !== undefined && lives <= 0 ? "You are out of lives!" : "You have " + lives + " hearts"}</H2>
          {livesRefreshTime && (
            <>
              <Paragraph>Hearts will not reset until</Paragraph>
              <H2>{countdown}</H2>
            </>
          )}
        </View>
        <Button marginHorizontal={"auto"}>
          <LockOpen />
          Unlock unlimited hearts
        </Button>
      </YStack>
      <SafeAreaView />
    </BottomSheet>
  );
}
