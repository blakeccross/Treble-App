import { createContext, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import { supabase } from "@/utils/supabase";
import { Module } from "@/types";

type ModuleContextProps = { data: Module[] };

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [data, setData] = useState<Module[]>([]);

  useEffect(() => {
    getModuleData();
  }, []);

  async function getModuleData() {
    try {
      // setLoading(true)
      // if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase.from("module").select(`*, section(*, section_item(*))`);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setData(updateCompletedModules(updateCompletedSections(data)));
      }
    } catch (error) {
      // if (error instanceof Error) {
      //   Alert.alert(error.message)
      // }
    } finally {
      // setLoading(false)
    }
  }

  function updateCompletedModules(data: Module[]) {
    const completedModuleIDs = new Set(user_data.completed_modules);

    return data.map((module) => {
      const numOfCompletedSectionsInModule = module.section.filter((section) => user_data.completed_sections.includes(section.id)).length;

      return {
        ...module,
        completed: completedModuleIDs.has(module.id),
        progress: completedModuleIDs.has(module.id) ? 100 : Math.floor(numOfCompletedSectionsInModule / module.section.length) * 100,
      };
    });
  }

  function updateCompletedSections(data: Module[]) {
    const completedSectionIds = new Set(user_data.completed_sections);

    return data.map((module) => {
      return {
        ...module,
        section: module.section.map((task) => ({ ...task, completed: completedSectionIds.has(task.id) })),
      };
    });
  }

  return <ModuleContext.Provider value={{ data }}>{children}</ModuleContext.Provider>;
}
