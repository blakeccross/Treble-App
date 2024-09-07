import { useLocalSearchParams, useRouter } from "expo-router";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";
import { ModuleContext } from "./module-context";
import { Module, Section, SectionItem } from "@/types";
import { UserContext } from "./user-context";
import moment from "moment";

type Quiz = {
  currentQuestionIndex: number;
  questions: SectionItem[];
  section: Section;
  currentModule: Module;
  nextQuestion: () => void;
  lives: number;
  setLives: Dispatch<SetStateAction<number>>;
};
export const QuizContext = createContext<Quiz>({} as Quiz);

export default function QuizProvider({ children }: { children: JSX.Element[] }) {
  const router = useRouter();
  const { module_id, section_id } = useLocalSearchParams<{ module_id: string; section_id: string }>();
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);
  const { data: moduleData } = useContext(ModuleContext);

  const sections = moduleData.flatMap((item) => item.section);

  const currentModule = moduleData.find((item) => item.id === +module_id);
  const currentSection = sections.find((item) => item.id === +section_id) as Section;
  const currentSectionQuestions = sortQuestions(currentSection.section_item);

  const sectionIndexInModule = currentModule?.section.map((item) => item.id).indexOf(currentSection?.id || 0) as number;

  const [lives, setLives] = useState(0);
  const currentQuestionIndex = useRef<number>(0);

  if (!currentSection || !currentModule) {
    router.push("/");
    return null;
  }

  useEffect(() => {
    setLives(3);
  }, []);

  function nextQuestion() {
    if (lives < 1) {
      router.push(`/out-of-lives`);
    } else {
      if (currentSection && currentQuestionIndex.current < currentSection.section_item.length - 1) {
        currentQuestionIndex.current = currentQuestionIndex.current + 1;

        router.push({
          pathname: `/${currentSection.section_item[currentQuestionIndex.current].type}`,
        });
      } else {
        // Finished Section

        const userFinishedModule = currentModule?.section
          .map((item) => item.id)
          .every((v) => [...(currentUser?.completed_sections || []), currentSection.id].includes(v));

        finishedSection(userFinishedModule || false);
      }
    }
  }

  function sortQuestions(questions: SectionItem[]) {
    return questions.sort((a, b) => {
      if (a.type === "reading" && b.type !== "reading") return -1;
      if (a.type !== "reading" && b.type === "reading") return 1;
      return Math.random() - 0.5; // Randomize the rest
    });
  }

  function finishedSection(moduleComplete: boolean) {
    const completedSections = [...(currentUser?.completed_sections || []), currentSection?.id];
    const completedModules = [...(currentUser?.completed_modules || []), currentModule?.id];

    handleUpdateUserInfo({ completed_sections: completedSections });

    if (moduleComplete) handleUpdateUserInfo({ completed_modules: completedModules });

    if (!currentUser?.active_days || (currentUser?.active_days && !currentUser?.active_days.some((date) => moment(date).isSame(moment(), "day")))) {
      handleUpdateUserInfo({ active_days: [...(currentUser?.active_days || []), new Date().toString()] });
    }
    const XPGained = currentSection?.section_item.length || 0 - (3 - lives);
    const newXPValue = (currentUser?.total_xp ? Number(currentUser?.total_xp) : 0) + XPGained;
    setLives(3);
    currentQuestionIndex.current = 0;

    handleUpdateUserInfo({ total_xp: newXPValue });
    router.push({
      pathname: "/quiz-complete",
      params: { numOfCorrectAnswers: XPGained, moduleComplete: String(moduleComplete) },
    });
  }

  return (
    <QuizContext.Provider
      value={{
        currentQuestionIndex: currentQuestionIndex.current,
        nextQuestion,
        questions: currentSectionQuestions,
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
