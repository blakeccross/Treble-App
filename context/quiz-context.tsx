import { useLocalSearchParams, useRouter } from "expo-router";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";
import { ModuleContext } from "./module-context";
import { Section, SectionItem } from "@/types";

type Quiz = {
  currentQuestionIndex: number;
  questions: SectionItem[];
  section: Section;
  nextQuestion: () => void;
  lives: number;
  setLives: Dispatch<SetStateAction<number>>;
};
export const QuizContext = createContext<Quiz>({} as Quiz);

export default function QuizProvider({ children }: { children: JSX.Element[] }) {
  const router = useRouter();
  const { module_id, section_id } = useLocalSearchParams<{ module_id: string; section_id: string }>();

  const { data: moduleData } = useContext(ModuleContext);
  const sections = moduleData.flatMap((item) => item.section);

  const currentModule = moduleData.find((item) => item.id === +module_id);
  const currentSection = sections.find((item) => item.id === +section_id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(0);
  const currentQuestionIndex = useRef<number>(0);

  if (!currentSection) {
    router.push("");
    return null;
  }
  if (!currentModule) {
    router.push("");
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
        setLives(3);
        currentQuestionIndex.current = 0;
        // setCurrentQuestion(currentQuestion + 1);

        router.push({
          pathname: "/quiz-complete",
        });
      }
      // else {
      //   // Finished Module
      //   currentQuestionIndex.current = 0;
      //   router.push({
      //     pathname: "/module-complete",
      //   });
      // }
    }
  }

  return (
    <QuizContext.Provider
      value={{
        currentQuestionIndex: currentQuestionIndex.current,
        nextQuestion,
        questions: currentSection?.section_item,
        section: currentSection,
        lives,
        setLives,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
