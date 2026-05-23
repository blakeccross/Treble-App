import { HeroModuleTransitionOverlay } from "@/components/module/HeroModuleTransitionOverlay";
import type {
  HeroMeasureRefs,
  HeroSourceRect,
  ModuleHeroReversePayload,
} from "@/context/module-hero-transition";
import { useModuleHeroTransition } from "@/context/module-hero-transition";
import { useFocusEffect } from "expo-router/react-navigation";
import React, { useCallback, useRef, useState } from "react";
import { Modal, StyleSheet, View as RNView } from "react-native";

function measureRect(
  ref: HeroMeasureRefs["posterRef"],
  fallback: HeroSourceRect,
): Promise<HeroSourceRect> {
  return new Promise((resolve) => {
    if (!ref.current) {
      resolve(fallback);
      return;
    }
    ref.current.measureInWindow((x, y, width, height) => {
      if (width > 2 && height > 2) {
        resolve({ x, y, width, height });
      } else {
        resolve(fallback);
      }
    });
  });
}

/**
 * Runs the reverse hero animation when returning from module-overview to home.
 */
export function HomeHeroReverseHandler() {
  const hero = useModuleHeroTransition();
  const [reverse, setReverse] = useState<ModuleHeroReversePayload | null>(null);
  const [homePosterRect, setHomePosterRect] = useState<HeroSourceRect | null>(
    null,
  );
  const startedRef = useRef(false);

  const clearReverse = useCallback(() => {
    setReverse(null);
    setHomePosterRect(null);
    startedRef.current = false;
    hero?.setHiddenHomeModuleId(null);
    hero?.endReverseHeroTransition();
  }, [hero]);

  const startReverse = useCallback(
    (pending: ModuleHeroReversePayload) => {
      if (startedRef.current || !hero) return;
      startedRef.current = true;

      const { forward } = pending;
      hero.setHiddenHomeModuleId(forward.moduleId);
      setReverse(pending);
      setHomePosterRect(forward.sourceRect);

      void (async () => {
        const refs = hero.getHeroMeasureTargets(forward.moduleId);
        if (!refs) return;
        const posterRect = await measureRect(refs.posterRef, forward.sourceRect);
        setHomePosterRect(posterRect);
      })();
    },
    [hero],
  );

  useFocusEffect(
    useCallback(() => {
      const pending = hero?.getPendingReverseTransition();
      if (!pending) {
        startedRef.current = false;
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => startReverse(pending));
      });
    }, [hero, startReverse]),
  );

  const onComplete = useCallback(() => {
    clearReverse();
  }, [clearReverse]);

  if (!reverse || !homePosterRect) return null;

  const { forward, overviewPosterRect } = reverse;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <RNView style={styles.root} pointerEvents="none">
        <HeroModuleTransitionOverlay
          direction="reverse"
          uri={forward.uri}
          imageSourceRect={homePosterRect}
          imageTargetRect={overviewPosterRect}
          onComplete={onComplete}
        />
      </RNView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
