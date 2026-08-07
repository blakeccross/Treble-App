import {
  getModulePosterImageUrl,
  prefetchModulePosterImage,
} from "@/constants/modulePosters";
import { GlassPanel } from "@/components/GlassPanel";
import type { Module } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";
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
  const posterImage = getModulePosterImageUrl(module.poster);

  useEffect(() => {
    void prefetchModulePosterImage(module.poster);
  }, [module.poster]);

  const handlePress = () => {
    if (!module.is_available) return;
    router.push(`/module-overview/${module.id}`);
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
        <RNView collapsable={false} style={StyleSheet.absoluteFill}>
          <Image
            source={posterImage ?? undefined}
            style={StyleSheet.absoluteFill}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={280}
            cachePolicy="memory-disk"
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
  actionButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
