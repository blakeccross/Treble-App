import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { ChevronLeft, H5, Progress, View, XStack, YStack } from "@/ui";

type AuthFlowHeaderProps = {
  title: string;
  /** 0–100; when set, a slim progress bar is shown under the title row */
  progress?: number;
};

export function AuthFlowHeader({ title, progress }: AuthFlowHeaderProps) {
  return (
    <YStack
      backgroundColor="$backgroundStrong"
      borderBottomWidth={StyleSheet.hairlineWidth * 2}
      borderBottomColor="$borderColor"
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$5"
        paddingVertical="$3"
      >
        <View
          width="$3"
          height="$3"
          alignItems="center"
          justifyContent="center"
          onPress={() => router.back()}
          pressStyle={{ scale: 0.96, opacity: 0.85 }}
        >
          <ChevronLeft size="$2" color="$color" />
        </View>
        <H5 fontWeight="normal" color="$color">
          {title}
        </H5>
        <View width="$3" height="$3" />
      </XStack>
      {typeof progress === "number" ? (
        <View paddingHorizontal="$5" paddingBottom="$3">
          <Progress
            value={progress}
            height="$0.75"
            backgroundColor="$gray4"
            borderRadius="$10"
          >
            <Progress.Indicator backgroundColor="$blue10" />
          </Progress>
        </View>
      ) : null}
    </YStack>
  );
}
