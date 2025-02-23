import React from "react";
import { H3, H5, Paragraph, Separator, XStack, YStack } from "tamagui";
import BottomSheet from "./BottomSheet";
import { FlatList, View } from "react-native";
import moment from "moment";
import { XPHistory } from "../types";

export default function XPHistoryModal({
  openXPHistory,
  setOpenXPHistory,
  xpHistory,
}: {
  openXPHistory: boolean;
  setOpenXPHistory: (open: boolean) => void;
  xpHistory?: XPHistory[];
}) {
  return (
    <BottomSheet isOpen={openXPHistory} setIsOpen={setOpenXPHistory} height={"80%"}>
      <YStack flex={1}>
        <H3 fontWeight={600} marginBottom="$2">
          XP History
        </H3>

        <FlatList
          data={xpHistory?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} // Sort by date descending
          keyExtractor={(item) => String(item.date)}
          style={{ flex: 1 }}
          ListEmptyComponent={() => (
            <View>
              <Paragraph>As you gain experience, it will show up here</Paragraph>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <>
              <XStack key={item.date} alignItems="center" justifyContent="space-between" width={"100%"} marginBottom="$2">
                <YStack>
                  <XStack alignItems="center" gap="$2">
                    <H5 fontWeight={600}>{item.title + " • " + item.description}</H5>
                  </XStack>
                  <Paragraph fontSize={"$2"} color={"$gray10"}>
                    {moment(item.date).format("MMM D, YYYY hh:mm a")}
                  </Paragraph>
                </YStack>
                <H5 fontWeight={600}>{item.xp_earned}</H5>
              </XStack>
              <Separator />
            </>
          )}
        />
      </YStack>
    </BottomSheet>
  );
}
