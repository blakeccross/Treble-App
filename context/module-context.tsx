import { prefetchModulePosterImages } from "@/constants/modulePosters";
import { createContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Module, SectionItem } from "@/types";
import { useUser } from "./user-context";
import { useMMKVNumber, useMMKVObject } from "react-native-mmkv";

type ModuleContextProps = {
  modules:
    | { data?: Module[] | null; loading: boolean; error?: boolean }
    | undefined;
  refreshModules: () => void;
  isModuleUpdateAvailable: boolean;
};

export const ModuleContext = createContext<ModuleContextProps>(
  {} as ModuleContextProps,
);

export default function ModuleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useUser();
  const [modules, setModules] = useMMKVObject<{
    data?: Module[] | null;
    loading: boolean;
    error?: boolean;
  }>("modules");
  const [moduleVersion, setModuleVersion] = useMMKVNumber("module_versions");
  const [isModuleUpdateAvailable, setIsModuleUpdateAvailable] = useState(false);

  useEffect(() => {
    getModuleVersions();
  }, []);

  useEffect(() => {
    if (!modules?.data) {
      getModuleData();
    } else {
      prefetchModulePosterImages(modules.data);
      setModules({
        ...modules,
        data: modules.data
          ? updateCompletedModules(updateCompletedSections(modules.data))
          : null,
        loading: false,
        error: false,
      });
    }
  }, [currentUser?.completed_sections]);

  async function getModuleVersions() {
    const { data, error, status } = await supabase
      .from("module_update")
      .select(`*`)
      .order("created_at", { ascending: true })
      .limit(1);

    if (data) {
      if (moduleVersion !== data[0].version) {
        setIsModuleUpdateAvailable(true);
      }
    }
  }

  async function getModuleData() {
    setModules({ loading: true, error: false });
    try {
      // if (!session?.user) throw new Error('No user on the session!')
      const { data, error, status } = await supabase
        .from("module")
        .select(`*, section(*, section_item(*))`)
        .order("id", { ascending: true });
      const { data: moduleUpdate } = await supabase
        .from("module_update")
        .select(`*`)
        .order("created_at", { ascending: true })
        .limit(1);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const sortedQuestions = data.map((module) => ({
          ...module,
          section: module.section.map((section) => {
            return {
              ...section,
              section_item: sortQuestions(section.section_item),
            };
          }),
        }));

        prefetchModulePosterImages(sortedQuestions);

        setModules({
          ...modules,
          data: updateCompletedModules(
            updateCompletedSections(sortedQuestions),
          ),
          loading: false,
          error: false,
        });
        if (moduleUpdate) {
          setModuleVersion(moduleUpdate[0].version);
          setIsModuleUpdateAvailable(false);
        }
      } else {
        setModules({ ...modules, loading: false, error: true });
      }
    } catch (error) {
      console.log("Error fetching module data", error);
      setModules({ ...modules, loading: false, error: true });
    }
  }

  function sortQuestions(questions: SectionItem[]): SectionItem[] {
    return questions.sort((a, b) => {
      if (a.type === "reading" && b.type !== "reading") return -1;
      if (a.type !== "reading" && b.type === "reading") return 1;
      return Math.random() - 0.5; // Randomize the rest
    });
  }

  function updateCompletedModules(data: Module[]) {
    const completedModuleIDs = new Set(currentUser?.completed_modules);

    return data.map((module) => {
      const numOfCompletedSectionsInModule = module.section.filter(
        (section) =>
          currentUser?.completed_sections &&
          currentUser?.completed_sections.includes(section.id),
      ).length;

      return {
        ...module,
        completed: completedModuleIDs.has(module.id),
        progress: completedModuleIDs.has(module.id)
          ? 100
          : Math.floor(
              (numOfCompletedSectionsInModule / module.section.length) * 100,
            ),
      };
    });
  }

  function updateCompletedSections(data: Module[]): Module[] {
    const completedSectionIds = new Set(currentUser?.completed_sections);

    return data.map((module) => {
      const addedCompletedSections = module.section.map((task) => ({
        ...task,
        completed: completedSectionIds.has(task.id),
      }));
      return {
        ...module,
        section: addedCompletedSections.sort((a, b) => a.id - b.id),
      };
    });
  }

  return (
    <ModuleContext.Provider
      value={{
        modules,
        refreshModules: getModuleData,
        isModuleUpdateAvailable,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}
