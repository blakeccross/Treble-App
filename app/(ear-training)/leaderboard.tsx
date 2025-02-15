import { ArrowLeft, Check, ChevronRight, Lock, Play, RefreshCw, X } from "@tamagui/lucide-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, useWindowDimensions, ScrollView, LayoutChangeEvent, FlatList, Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";

import { Avatar, H1, H2, H3, H4, H5, ListItem, Paragraph, Separator, Spinner, View, XStack, YGroup, YStack } from "tamagui";
import { window } from "@/utils";
import { Dropdown } from "@/components/dropdown";
import { ModuleContext } from "@/context/module-context";
import { UserContext } from "@/context/user-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { blue, blueDark } from "@tamagui/themes";
import { Button } from "@/components/button";
import { supabase } from "@/utils/supabase";
import { Leaderboard } from "@/types";

export default function LeaderBoard() {
  const { currentUser } = useContext(UserContext);
  const { gameName } = useLocalSearchParams<{ gameName: string }>();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getLeaderboardData() {
      setIsLoading(true);
      let { data: leaderboardRes, error } = await supabase
        .from("leaderboard")
        .select("*, profile(full_name, avatar_url)")
        .not(gameName, "is", null)
        .order(gameName, { ascending: false })
        .limit(100);
      if (leaderboardRes) {
        console.log(leaderboardRes);
        const leaderboardFormatted = leaderboardRes.filter((item) => item.profile.full_name);
        setLeaderboard(leaderboardFormatted);
      }
      setIsLoading(false);
    }
    getLeaderboardData();
  }, []);

  return (
    <View backgroundColor={"$background"} flex={1}>
      <SafeAreaView style={{ marginBottom: 200, flex: 1 }}>
        <XStack padding="$3" alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.dismiss()}>
            <X size="$3" />
          </Pressable>
          <H3 fontWeight={600}>Leaderboard</H3>
          <XStack gap="$1" width={"$3"} />
        </XStack>
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
                  key={item.id}
                  padding="$4"
                  justifyContent="space-between"
                  alignItems="center"
                  pressStyle={{ scale: 0.99, backgroundColor: "$backgroundPress" }}
                >
                  <XStack alignItems="center" gap="$2">
                    <Avatar circular>
                      <Avatar.Image accessibilityLabel={item.profile.full_name} src={item.profile.avatar_url} />
                      <Avatar.Fallback backgroundColor="$blue10" />
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
      </SafeAreaView>
    </View>
  );
}
