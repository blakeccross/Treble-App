import { X } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";

import { Leaderboard } from "@/types";
import { supabase } from "@/utils/supabase";
import { Avatar, H3, H4, H5, Paragraph, Separator, Spinner, View, XStack } from "tamagui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Network from "expo-network";

export default function LeaderBoard() {
  const { top } = useSafeAreaInsets();
  const { gameName } = useLocalSearchParams<{ gameName: string }>();
  const networkState = Network.useNetworkState();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // if (networkState.isConnected) {
    //   getLeaderboardData();
    // } else {
    //   setIsOffline(true);
    // }
    getLeaderboardData();
  }, []);

  async function getLeaderboardData() {
    setIsLoading(true);
    let { data: leaderboardRes, error } = await supabase
      .from("leaderboard")
      .select("*, profile(full_name, avatar_url)")
      .not(gameName, "is", null)
      .order(gameName, { ascending: false })
      .limit(100);
    if (leaderboardRes) {
      const leaderboardFormatted = leaderboardRes.filter((item) => item.profile.full_name);
      setLeaderboard(leaderboardFormatted);
    }
    setIsLoading(false);
  }

  return (
    <View backgroundColor={"$background"} flex={1}>
      <View backgroundColor={"$blue10"} paddingTop={top}>
        <XStack padding="$3" alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismiss()}>
            <X size="$3" color={"white"} />
          </Pressable>
          <H3 fontWeight={600} color={"white"}>
            Leaderboard
          </H3>
          <XStack gap="$1" width={"$3"} />
        </XStack>
      </View>
      {/* {isOffline && (
        <View flex={1} justifyContent="center" alignItems="center">
          <Paragraph>Must be online to view leaderboard</Paragraph>
        </View>
      )} */}
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => String(item.created_at)}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <>
              <XStack
                key={item.created_at}
                padding="$4"
                justifyContent="space-between"
                alignItems="center"
                pressStyle={{ scale: 0.99, backgroundColor: "$backgroundPress" }}
              >
                <XStack alignItems="center" gap="$2">
                  <Avatar circular>
                    <Avatar.Image accessibilityLabel={item.profile.full_name} src={item.profile.avatar_url} />
                    <Avatar.Fallback backgroundColor="$gray5" />
                  </Avatar>
                  <H4 fontWeight={600}>{item.profile.full_name}</H4>
                </XStack>
                <H5 fontWeight={600}>{item[gameName as keyof Leaderboard]}</H5>
              </XStack>
              <Separator />
            </>
          )}
        />
      )}
    </View>
  );
}
