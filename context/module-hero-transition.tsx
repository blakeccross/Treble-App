import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { View as RNView } from "react-native";

export type HeroSourceRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ModuleHeroPayload = {
  moduleId: number;
  uri: string;
  sourceRect: HeroSourceRect;
  title: string;
  titleSourceRect: HeroSourceRect;
  titleSourceFontSize: number;
  titleSourceLineHeight: number;
  /** False when title sits on light card footer (dark text); true on hero image (light text). */
  titleStartsLight: boolean;
};

export type ModuleHeroReversePayload = {
  forward: ModuleHeroPayload;
  overviewPosterRect: HeroSourceRect;
  overviewTitleRect: HeroSourceRect;
};

export type HeroMeasureRefs = {
  posterRef: React.RefObject<RNView | null>;
  titleRef: React.RefObject<RNView | null>;
};

type ModuleHeroTransitionContextValue = {
  beginHeroTransition: (payload: ModuleHeroPayload) => void;
  getHeroTransitionIfMatch: (moduleId: number) => ModuleHeroPayload | null;
  endHeroTransition: () => void;
  beginReverseHeroTransition: (payload: ModuleHeroReversePayload) => void;
  getPendingReverseTransition: () => ModuleHeroReversePayload | null;
  endReverseHeroTransition: () => void;
  registerHeroMeasureTargets: (
    moduleId: number,
    refs: HeroMeasureRefs,
  ) => void;
  unregisterHeroMeasureTargets: (moduleId: number) => void;
  getHeroMeasureTargets: (moduleId: number) => HeroMeasureRefs | undefined;
  /** Hide home poster/title while reverse overlay is flying. */
  hiddenHomeModuleId: number | null;
  setHiddenHomeModuleId: (moduleId: number | null) => void;
};

const ModuleHeroTransitionContext =
  createContext<ModuleHeroTransitionContextValue | null>(null);

export function ModuleHeroTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingRef = useRef<ModuleHeroPayload | null>(null);
  const pendingReverseRef = useRef<ModuleHeroReversePayload | null>(null);
  const measureTargetsRef = useRef<Map<number, HeroMeasureRefs>>(new Map());
  const [hiddenHomeModuleId, setHiddenHomeModuleId] = useState<number | null>(
    null,
  );

  const registerHeroMeasureTargets = useCallback(
    (moduleId: number, refs: HeroMeasureRefs) => {
      measureTargetsRef.current.set(moduleId, refs);
    },
    [],
  );

  const unregisterHeroMeasureTargets = useCallback((moduleId: number) => {
    measureTargetsRef.current.delete(moduleId);
  }, []);

  const getHeroMeasureTargets = useCallback((moduleId: number) => {
    return measureTargetsRef.current.get(moduleId);
  }, []);

  const value = useMemo<ModuleHeroTransitionContextValue>(
    () => ({
      beginHeroTransition(payload: ModuleHeroPayload) {
        pendingRef.current = payload;
      },
      getHeroTransitionIfMatch(moduleId: number) {
        const p = pendingRef.current;
        if (p && p.moduleId === moduleId) return p;
        return null;
      },
      endHeroTransition() {
        pendingRef.current = null;
      },
      beginReverseHeroTransition(payload: ModuleHeroReversePayload) {
        pendingReverseRef.current = payload;
      },
      getPendingReverseTransition() {
        return pendingReverseRef.current;
      },
      endReverseHeroTransition() {
        pendingReverseRef.current = null;
      },
      registerHeroMeasureTargets,
      unregisterHeroMeasureTargets,
      getHeroMeasureTargets,
      hiddenHomeModuleId,
      setHiddenHomeModuleId,
    }),
    [
      hiddenHomeModuleId,
      registerHeroMeasureTargets,
      unregisterHeroMeasureTargets,
      getHeroMeasureTargets,
    ],
  );

  return (
    <ModuleHeroTransitionContext.Provider value={value}>
      {children}
    </ModuleHeroTransitionContext.Provider>
  );
}

export function useModuleHeroTransition() {
  return useContext(ModuleHeroTransitionContext);
}
