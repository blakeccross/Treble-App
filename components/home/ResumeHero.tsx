import { GlassPanel } from "@/components/GlassPanel";
import { useModuleHeroTransition } from "@/context/module-hero-transition";
import { fontSize, lineHeight } from "@/theme/tokens";
import type { Module } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View as RNView,
} from "react-native";
import { ArrowUpRight, LinearGradient, Paragraph, View, YStack } from "@/ui";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

/** First in-progress module, else first incomplete, else last available. */
export function pickResumeModule(modules: Module[]): Module | null {
  const available = modules.filter((m) => m.is_available);
  if (available.length === 0) return null;

  const inProgress = available.filter((m) => !m.completed && m.progress > 0);
  if (inProgress.length > 0) {
    return [...inProgress].sort(
      (a, b) => b.progress - a.progress || a.id - b.id,
    )[0];
  }

  const notStarted = available.find((m) => !m.completed);
  if (notStarted) return notStarted;

  return available[available.length - 1];
}

type ResumeHeroProps = {
  module: Module;
};

function resumeSubtitle(module: Module) {
  if (!module.is_available) return "Coming soon";
  if (module.completed) return "Review module";
  if (module.progress > 0) {
    return `${Math.round(module.progress)}% complete`;
  }
  return "Tap to continue";
}

export function ResumeHero({ module }: ResumeHeroProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardSize = Math.min(screenWidth - 32, 420);
  const imageFrameRef = useRef<RNView>(null);
  const titleRef = useRef<RNView>(null);
  const hero = useModuleHeroTransition();
  const hideHeroContent = hero?.hiddenHomeModuleId === module.id;

  useEffect(() => {
    hero?.registerHeroMeasureTargets(module.id, {
      posterRef: imageFrameRef,
      titleRef,
    });
    return () => hero?.unregisterHeroMeasureTargets(module.id);
  }, [hero, module.id]);

  const handlePress = () => {
    if (!module.is_available) return;
    imageFrameRef.current?.measureInWindow((x, y, w, h) => {
      const posterRect = { x, y, width: w, height: h };
      const fallbackTitle = {
        x: x + 16,
        y: y + h - 100,
        width: w - 32,
        height: 56,
      };
      const go = (tr: typeof fallbackTitle) => {
        hero?.beginHeroTransition({
          moduleId: module.id,
          uri: module.local_poster_uri,
          sourceRect: posterRect,
          title: module.title,
          titleSourceRect: tr,
          titleSourceFontSize: fontSize.$8,
          titleSourceLineHeight: lineHeight.$8,
          titleStartsLight: true,
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
  };

  return (
    <Pressable
      disabled={!module.is_available}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        { width: cardSize },
        pressed && module.is_available && styles.cardPressed,
        !module.is_available && styles.cardDisabled,
      ]}
    >
      <View
        width={cardSize}
        height={cardSize}
        borderRadius={20}
        overflow="hidden"
        backgroundColor="$gray3"
        style={styles.cardShadow}
      >
        <RNView
          ref={imageFrameRef}
          collapsable={false}
          style={[
            StyleSheet.absoluteFill,
            hideHeroContent && styles.heroHidden,
          ]}
        >
          <Image
            source={module.local_poster_uri}
            style={StyleSheet.absoluteFill}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={280}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.75)"]}
            start={[0, 0.35]}
            end={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
        </RNView>

        <View position="absolute" top={0} right={0} padding="$3" zIndex={2}>
          <GlassPanel
            borderRadius={22}
            glassEffectStyle="clear"
            style={styles.actionButton}
          >
            <ArrowUpRight size={20} color="white" strokeWidth={2.25} />
          </GlassPanel>
        </View>

        <View position="absolute" left={0} right={0} bottom={0} padding="$3">
          <YStack gap="$1" padding="$4">
            <Paragraph
              fontSize="$2"
              fontFamily="InterBold"
              color="rgba(255,255,255,0.82)"
              letterSpacing={0.7}
              style={{ ...styles.titleOnArt, textTransform: "uppercase" }}
            >
              Continue
            </Paragraph>
            <RNView
              ref={titleRef}
              collapsable={false}
              style={hideHeroContent ? styles.heroHidden : undefined}
            >
              <Paragraph
                fontFamily="InterBold"
                fontSize="$8"
                lineHeight="$8"
                letterSpacing={-0.4}
                numberOfLines={2}
                style={styles.titleOnArt}
              >
                {module.title}
              </Paragraph>
            </RNView>
            <Paragraph
              fontSize="$4"
              color="rgba(255,255,255,0.92)"
              numberOfLines={1}
              style={styles.titleOnArt}
            >
              {resumeSubtitle(module)}
            </Paragraph>
          </YStack>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroHidden: {
    opacity: 0,
  },
  titleOnArt: {
    color: "#FFFFFF",
  },
  pressable: {
    alignSelf: "center",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  glassFooter: {
    width: "100%",
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
