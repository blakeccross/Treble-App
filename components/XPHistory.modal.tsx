import { H3, H5, Paragraph, Separator, XStack, YStack } from "@/ui";
import { BottomSheet, ScrollView } from "@expo/ui";
import moment from "moment";
import React, { useMemo } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { XPHistory } from "../types";

export default function XPHistoryModal({
  openXPHistory,
  setOpenXPHistory,
}: {
  openXPHistory: boolean;
  setOpenXPHistory: (open: boolean) => void;
}) {
  const [xpHistory] = useMMKVObject<XPHistory[]>("xp_history");

  const sortedHistory = useMemo(
    () =>
      [...(xpHistory ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [xpHistory],
  );

  return (
    <BottomSheet
      isPresented={openXPHistory}
      onDismiss={() => setOpenXPHistory(false)}
      snapPoints={[{ fraction: 0.75 }, "full"]}
    >
      <ScrollView>
        <YStack flex={1}>
          <H3 fontWeight="normal" marginBottom="$3">
            XP History
          </H3>

          {sortedHistory.length === 0 ? (
            <Paragraph>As you gain experience, it will show up here</Paragraph>
          ) : (
            sortedHistory.map((item, index) => (
              <React.Fragment key={`${item.date}-${index}`}>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  marginBottom="$2"
                >
                  <YStack flex={1} marginRight="$2">
                    <H5 fontWeight="normal">{`${item.title} • ${item.description}`}</H5>
                    <Paragraph fontSize="$2" color="$gray11">
                      {moment(item.date).format("MMM D, YYYY hh:mm a")}
                    </Paragraph>
                  </YStack>
                  <H5 fontWeight="normal">{item.xp_earned}</H5>
                </XStack>
                <Separator />
              </React.Fragment>
            ))
          )}
        </YStack>
      </ScrollView>
    </BottomSheet>
  );
}
