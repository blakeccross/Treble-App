import { Module, Section, SectionItem, XPHistory } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { ModuleContext } from "./module-context";
import { UserContext } from "./user-context";

type Quiz = {
  currentQuestionIndex: number;
  questions: SectionItem[] | null;
  section: Section;
  currentModule: Module;
  nextQuestion: () => void;
  lives?: number;
  setLives: (lives: number) => void;
};

export const QuizContext = createContext<Quiz>({} as Quiz);

export default function QuizProvider({ children }: { children: JSX.Element[] }) {
  const router = useRouter();
  const { module_id, section_id } = useLocalSearchParams<{ module_id: string; section_id: string }>();
  const { currentUser, handleUpdateUserInfo, lives, setLives } = useContext(UserContext);
  const { modules } = useContext(ModuleContext);
  const [xpHistory, setXPHistory] = useMMKVObject<XPHistory[]>("xp_history");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [sortedQuestions, setSortedQuestions] = useState<SectionItem[]>([]);

  // Memoize computed values
  const sections = useMemo(() => modules?.data?.flatMap((item) => item.section) || [], [modules?.data]);

  const currentModule = useMemo(() => modules?.data?.find((item) => item.id === +module_id), [modules?.data, module_id]);

  const currentSection = useMemo(() => sections.find((item) => item.id === +section_id) as Section, [sections, section_id]);

  const currentSectionQuestions = useMemo(() => currentSection?.section_item, [currentSection]);

  // Memoize the finishedSection callback
  const finishedSection = useCallback(
    async (moduleComplete: boolean) => {
      if (!currentSection || !currentModule) return;

      const completedSections = Array.from(new Set([...(currentUser?.completed_sections || []), currentSection.id])).filter(
        (id): id is number => id !== undefined
      );

      const completedModules = Array.from(new Set([...(currentUser?.completed_modules || []), currentModule.id])).filter(
        (id): id is number => id !== undefined
      );

      const baseXP = currentSection.section_item.length;
      const livesPenalty = 3 - (lives || 0);
      let XPGained = Math.max(0, baseXP - livesPenalty);

      const updates: Partial<typeof currentUser> = {
        completed_sections: completedSections,
        total_xp: 0,
      };

      if (moduleComplete) {
        updates.completed_modules = completedModules;
        XPGained += 10;
      }

      const today = moment().startOf("day");
      const hasActiveDayToday = currentUser?.active_days?.some((date) => moment(date).startOf("day").isSame(today));

      if (!hasActiveDayToday) {
        updates.active_days = [...(currentUser?.active_days || []), new Date().toString()];
      }

      const newTotalXP = (currentUser?.total_xp || 0) + XPGained;
      await handleUpdateUserInfo({ ...updates, total_xp: newTotalXP });

      const newXPHistory: XPHistory[] = [
        ...(xpHistory || []),
        {
          title: currentModule.title,
          description: currentSection.title || "",
          xp_earned: XPGained,
          date: new Date().toString(),
        },
      ];
      setXPHistory(newXPHistory);
      setCurrentQuestionIndex(0);

      router.replace({
        pathname: "/quiz-complete",
        params: { numOfCorrectAnswers: XPGained, moduleComplete: String(moduleComplete) },
      });
    },
    [currentUser, currentSection, currentModule, lives, handleUpdateUserInfo, xpHistory, router]
  );

  // Memoize the nextQuestion callback
  const nextQuestion = useCallback(() => {
    if (currentSection && currentQuestionIndex < currentSection.section_item.length - 1) {
      const nextQuestion = sortedQuestions[currentQuestionIndex + 1];
      setCurrentQuestionIndex((prev) => prev + 1);

      router.replace({
        pathname: `/(questions)/${nextQuestion.type}`,
      });
    } else {
      const userFinishedModule = currentModule?.section
        .map((item) => item.id)
        .every((v) => [...(currentUser?.completed_sections || []), currentSection?.id].includes(v));

      if (userFinishedModule && currentModule && !currentUser?.completed_modules?.includes(currentModule.id)) {
        finishedSection(true);
      } else {
        finishedSection(false);
      }
    }
  }, [currentSection, currentQuestionIndex, currentModule, currentUser, router, sortedQuestions, finishedSection]);

  // Memoize the sorting effect
  useEffect(() => {
    if (currentSectionQuestions) {
      const sorted = [...currentSectionQuestions].sort((a, b) => {
        if (a.type === "reading" && b.type !== "reading") return -1;
        if (a.type !== "reading" && b.type === "reading") return 1;
        return Math.random() - 0.5;
      });
      setSortedQuestions(sorted.slice(0, 20));
    }
  }, [currentSectionQuestions]);

  // Memoize the lives check effect
  useEffect(() => {
    if (!currentUser?.is_subscribed && lives !== undefined && lives <= 0 && sortedQuestions[currentQuestionIndex]?.type !== "reading") {
      router.replace(`/out-of-lives`);
    }
  }, [lives, currentQuestionIndex, currentUser?.is_subscribed, router, sortedQuestions]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      currentQuestionIndex,
      nextQuestion,
      questions: sortedQuestions,
      section: currentSection,
      currentModule: currentModule as Module, // Type assertion since we know it's not undefined at this point
      lives,
      setLives,
    }),
    [currentQuestionIndex, nextQuestion, sortedQuestions, currentSection, currentModule, lives, setLives]
  );

  if (!currentSection || !currentModule) {
    router.navigate("/(tabs)");
    return null;
  }

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
}
