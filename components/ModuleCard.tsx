import {
  getModulePosterImageUrl,
  prefetchModulePosterImage,
} from "@/constants/modulePosters";
import type { Module } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, View as RNView } from "react-native";
import { ChevronRight, Paragraph, View, YStack } from "@/ui";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const THUMB = 56;

type ModuleCardProps = {
  module: Module;
  disabled?: boolean;
  onPress?: () => void;
  /** Show bottom divider (Robinhood list style). */
  showDivider?: boolean;
};

function getSubtitle(module: Module) {
  if (!module.is_available) return "Coming soon";
  if (module.completed) return "Completed";
  if (module.progress > 0) return `${Math.round(module.progress)}% complete`;
  return "Not started";
}

export function ModuleCard({
  module,
  disabled,
  onPress,
  showDivider = true,
}: ModuleCardProps) {
  useEffect(() => {
    void prefetchModulePosterImage(module.poster);
  }, [module.poster]);

  const handlePress = useCallback(() => {
    if (disabled || !module.is_available) return;
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/module-overview/${module.id}`);
  }, [disabled, module.id, module.is_available, onPress]);

  const showProgress =
    module.is_available && module.progress > 0 && !module.completed;
  const posterImage = getModulePosterImageUrl(module.poster);

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.rowDivider,
        !module.is_available && styles.rowDisabled,
        pressed && module.is_available && styles.rowPressed,
      ]}
    >
      <RNView collapsable={false} style={styles.thumb}>
        {posterImage ? (
          <Image
            source={posterImage}
            style={StyleSheet.absoluteFill}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : null}
      </RNView>

      <YStack flex={1} gap="$1" paddingLeft="$3" justifyContent="center">
        <Paragraph
          fontFamily="InterBold"
          fontSize="$5"
          color="$color"
          numberOfLines={1}
        >
          {module.title}
        </Paragraph>
        <Paragraph fontSize="$3" color="$gray11" numberOfLines={1}>
          {getSubtitle(module)}
        </Paragraph>
      </YStack>

      <View paddingLeft="$2" justifyContent="center">
        {showProgress ? (
          <Paragraph fontFamily="InterBold" fontSize="$5" color="$blue10">
            {Math.round(module.progress)}%
          </Paragraph>
        ) : module.completed ? (
          <Paragraph fontSize="$3" color="$blue10">
            Done
          </Paragraph>
        ) : (
          <ChevronRight size={20} color="$gray8" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E4E4E7",
  },
});
