import { Module, Section, SectionItem, XPHistory } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
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

  const sections = modules?.data && modules.data.flatMap((item) => item.section);

  const currentModule = modules?.data && modules.data.find((item) => item.id === +module_id);
  const currentSection = sections && (sections.find((item) => item.id === +section_id) as Section);
  const currentSectionQuestions = currentSection?.section_item;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [sortedQuestions, setSortedQuestions] = useState<SectionItem[]>([]);

  useEffect(() => {
    if (currentSectionQuestions) {
      const sorted = currentSectionQuestions.sort((a, b) => {
        if (a.type === "reading" && b.type !== "reading") return -1;
        if (a.type !== "reading" && b.type === "reading") return 1;
        return Math.random() - 0.5; // Randomize the rest
      });
      setSortedQuestions(sorted);
    }
  }, [currentSectionQuestions]);

  useEffect(() => {
    if (
      !currentUser?.is_subscribed &&
      lives !== undefined &&
      lives <= 0 &&
      sortedQuestions[currentQuestionIndex] &&
      sortedQuestions[currentQuestionIndex]?.type !== "reading"
    ) {
      router.replace(`/out-of-lives`);
    }
  }, [lives, currentQuestionIndex]);

  if (!currentSection || !currentModule) {
    router.navigate("/(tabs)");
    return null;
  }

  function nextQuestion() {
    if (currentSection && currentQuestionIndex < currentSection.section_item.length - 1) {
      // const nextQuestion = currentSection.section_item[currentQuestionIndex.current + 1];
      // currentQuestionIndex.current = currentQuestionIndex.current + 1;
      const nextQuestion = sortedQuestions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Update state instead of ref

      console.log("NEXT QUESTION", currentQuestionIndex + 1, nextQuestion.type, nextQuestion.question);

      router.replace({
        pathname: `/(questions)/${nextQuestion.type}`,
      });
    } else {
      // Finished Section

      const userFinishedModule = currentModule?.section
        .map((item) => item.id)
        .every((v) => [...(currentUser?.completed_sections || []), currentSection?.id].includes(v));

      // Check if current module has already been completed
      if (userFinishedModule && currentModule && !currentUser?.completed_modules?.includes(currentModule?.id)) {
        finishedSection(userFinishedModule || false);
      } else {
        finishedSection(false);
      }
    }
  }

  async function finishedSection(moduleComplete: boolean) {
    const completedSections = Array.from(new Set([...(currentUser?.completed_sections || []), currentSection?.id])).filter(
      (id): id is number => id !== undefined
    );

    const completedModules = Array.from(new Set([...(currentUser?.completed_modules || []), currentModule?.id])).filter(
      (id): id is number => id !== undefined
    );

    let XPGained = currentSection?.section_item.length || 0 - (3 - (lives || 0));

    const updates: Partial<typeof currentUser> = {
      completed_sections: completedSections,
      total_xp: 0,
    };

    if (moduleComplete) {
      updates.completed_modules = completedModules;
      XPGained += 10;
    }

    if (!currentUser?.active_days || (currentUser?.active_days && !currentUser?.active_days.some((date) => moment(date).isSame(moment(), "day")))) {
      updates.active_days = [...(currentUser?.active_days || []), new Date().toString()];
    }

    // Single call to handleUpdateUserInfo with all updates
    await handleUpdateUserInfo({ ...updates, total_xp: currentUser?.total_xp ? currentUser.total_xp + XPGained : XPGained });
    setXPHistory([
      ...(xpHistory || []),
      { title: currentModule?.title || "", description: currentSection?.title || "", xp_earned: XPGained, date: new Date().toString() },
    ]);

    setCurrentQuestionIndex(0);
    // currentQuestionIndex.current = 0;

    router.replace({
      pathname: "/quiz-complete",
      params: { numOfCorrectAnswers: XPGained, moduleComplete: String(moduleComplete) },
    });
  }

  return (
    <QuizContext.Provider
      value={{
        currentQuestionIndex,
        nextQuestion,
        questions: sortedQuestions,
        section: currentSection,
        currentModule,
        lives,
        setLives,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
