import { useModuleHeroTransition } from "@/context/module-hero-transition";
import type { Module } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View as RNView,
} from "react-native";
import { ChevronRight, Paragraph, View, YStack } from "@/ui";
import { fontSize, lineHeight } from "@/theme/tokens";

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
  const posterRef = useRef<RNView>(null);
  const titleRef = useRef<RNView>(null);
  const hero = useModuleHeroTransition();
  const hideHeroContent = hero?.hiddenHomeModuleId === module.id;

  useEffect(() => {
    hero?.registerHeroMeasureTargets(module.id, { posterRef, titleRef });
    return () => hero?.unregisterHeroMeasureTargets(module.id);
  }, [hero, module.id]);

  const handlePress = useCallback(() => {
    if (disabled || !module.is_available) return;
    if (onPress) {
      onPress();
      return;
    }
    posterRef.current?.measureInWindow((x, y, width, height) => {
      const posterRect = { x, y, width, height };
      const fallbackTitle = {
        x: x + THUMB + 12,
        y: y + 4,
        width: 200,
        height: 22,
      };
      const go = (tr: typeof fallbackTitle) => {
        hero?.beginHeroTransition({
          moduleId: module.id,
          uri: module.local_poster_uri,
          sourceRect: posterRect,
          title: module.title,
          titleSourceRect: tr,
          titleSourceFontSize: fontSize.$5,
          titleSourceLineHeight: lineHeight.$5,
          titleStartsLight: false,
        });
        router.push(`/module-overview/${module.id}`);
      };
      if (titleRef.current) {
        titleRef.current.measureInWindow((tx, ty, tw, th) => {
          go(
            tw > 2 && th > 2
              ? { x: tx, y: ty, width: tw, height: th }
              : fallbackTitle,
          );
        });
      } else {
        go(fallbackTitle);
      }
    });
  }, [disabled, hero, module, onPress]);

  const showProgress =
    module.is_available && module.progress > 0 && !module.completed;

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
      <RNView
        ref={posterRef}
        collapsable={false}
        style={[styles.thumb, hideHeroContent && styles.heroHidden]}
      >
        <Image
          source={module.local_poster_uri}
          style={StyleSheet.absoluteFill}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={200}
        />
      </RNView>

      <YStack flex={1} gap="$1" paddingLeft="$3" justifyContent="center">
        <RNView
          ref={titleRef}
          collapsable={false}
          style={hideHeroContent ? styles.heroHidden : undefined}
        >
          <Paragraph
            fontFamily="InterBold"
            fontSize="$5"
            color="$color"
            numberOfLines={1}
          >
            {module.title}
          </Paragraph>
        </RNView>
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
  heroHidden: {
    opacity: 0,
  },
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
