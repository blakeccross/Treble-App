import { createContext, useContext, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import { supabase } from "@/utils/supabase";
import { Module } from "@/types";
import { UserContext } from "./user-context";

type ModuleContextProps = { data: Module[] };

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [data, setData] = useState<Module[]>([]);
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);

  useEffect(() => {
    getModuleData();
  }, []);

  useEffect(() => {
    console.log("SETTING");
    setData(updateCompletedModules(updateCompletedSections(data)));
  }, [currentUser?.completedSections]);

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
        console.log("HERE", updateCompletedModules(updateCompletedSections(data)));
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
    const completedModuleIDs = new Set(currentUser?.completedModules);

    return data.map((module) => {
      const numOfCompletedSectionsInModule = module.section.filter(
        (section) => currentUser?.completedSections && currentUser?.completedSections.includes(section.id)
      ).length;

      console.log(Math.floor((numOfCompletedSectionsInModule / module.section.length) * 100));

      return {
        ...module,
        completed: completedModuleIDs.has(module.id),
        progress: completedModuleIDs.has(module.id) ? 100 : Math.floor((numOfCompletedSectionsInModule / module.section.length) * 100),
      };
    });
  }

  function updateCompletedSections(data: Module[]) {
    const completedSectionIds = new Set(currentUser?.completedSections);

    return data.map((module) => {
      return {
        ...module,
        section: module.section.map((task) => ({ ...task, completed: completedSectionIds.has(task.id) })),
      };
    });
  }

  console.log(data);

  return <ModuleContext.Provider value={{ data }}>{children}</ModuleContext.Provider>;
}
