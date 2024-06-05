import { useRouter } from "expo-router";
import { Dispatch, MutableRefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react";
import { sampleModule } from "@/utils/sample-questions";
import type { SampleQuestionType } from "@/utils/sample-questions";
type Quiz = {
  currentQuestionIndex: number;
  // setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  questions: SampleQuestionType[];
  nextQuestion: () => void;
  lives: number;
  setLives: Dispatch<SetStateAction<number>>;
};
export const QuizContext = createContext<Quiz>({} as Quiz);

export default function QuizProvider({ children }: { children: JSX.Element[] }) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [lives, setLives] = useState(0);
  const currentQuestionIndex = useRef<number>(0);

  useEffect(() => {
    setLives(3);
  }, []);

  function nextQuestion() {
    if (lives < 1) {
      router.push(`(questions)/out-of-lives`);
    } else {
      // currentQuestionIndex.current = currentQuestionIndex.current + 1;
      if (currentQuestionIndex.current < sampleModule[currentSection].length - 1) {
        currentQuestionIndex.current = currentQuestionIndex.current + 1;

        router.push({
          pathname: "/(questions)/" + sampleModule[currentSection][currentQuestionIndex.current].type,
        });
      } else if (currentSection < sampleModule.length - 1) {
        setLives(3);
        currentQuestionIndex.current = 0;
        setCurrentSection(currentSection + 1);

        router.push({
          pathname: "/(questions)/quiz-complete",
        });
      } else {
        // Finished Module
        currentQuestionIndex.current = 0;
        router.push({
          pathname: "/(questions)/module-complete",
        });
      }
    }
  }

  return (
    <QuizContext.Provider
      value={{ currentQuestionIndex: currentQuestionIndex.current, nextQuestion, questions: sampleModule[currentSection], lives, setLives }}
    >
      {children}
    </QuizContext.Provider>
  );
}
