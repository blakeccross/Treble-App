import React from "react";
import { H3, H5, Paragraph, Separator, Sheet, XStack, YStack } from "tamagui";
import { Dimensions, FlatList, View } from "react-native";
import moment from "moment";
import { XPHistory } from "../types";
import { useMMKVObject } from "react-native-mmkv";

export default function XPHistoryModal({ openXPHistory, setOpenXPHistory }: { openXPHistory: boolean; setOpenXPHistory: (open: boolean) => void }) {
  const windowHeight = Dimensions.get("window").height;
  const [xpHistory] = useMMKVObject<XPHistory[]>("xp_history");

  return (
    <Sheet snapPointsMode="fit" zIndex={100_000} animation="quick" disableDrag={true} open={openXPHistory} onOpenChange={setOpenXPHistory}>
      <Sheet.Overlay animation="lazy" backgroundColor="$shadow6" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

      <Sheet.Frame borderTopLeftRadius={"$10"} borderTopRightRadius={"$10"} padding="$4" height={windowHeight * 0.75}>
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
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
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
      </Sheet.Frame>
    </Sheet>
  );
}
