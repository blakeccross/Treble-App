import { createContext, useContext, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import { supabase } from "@/utils/supabase";
import { Module } from "@/types";
import { UserContext } from "./user-context";
import * as FileSystem from "expo-file-system";

type ModuleContextProps = { data: Module[] };

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [data, setData] = useState<Module[]>([]);
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);

  useEffect(() => {
    getModuleData();
  }, []);

  useEffect(() => {
    setData(updateCompletedModules(updateCompletedSections(data)));
  }, [currentUser?.completed_sections]);

  async function getModuleData() {
    try {
      // setLoading(true)
      // if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase.from("module").select(`*, section(*, section_item(*))`);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const addedLocalImage = await downloadEachPoster(data);
        setData(updateCompletedModules(updateCompletedSections(addedLocalImage)));
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
    const completedModuleIDs = new Set(currentUser?.completed_modules);

    return data.map((module) => {
      const numOfCompletedSectionsInModule = module.section.filter(
        (section) => currentUser?.completed_sections && currentUser?.completed_sections.includes(section.id)
      ).length;

      return {
        ...module,
        completed: completedModuleIDs.has(module.id),
        progress: completedModuleIDs.has(module.id) ? 100 : Math.floor((numOfCompletedSectionsInModule / module.section.length) * 100),
      };
    });
  }

  function updateCompletedSections(data: Module[]): Module[] {
    const completedSectionIds = new Set(currentUser?.completed_sections);

    return data.map((module) => {
      return {
        ...module,
        section: module.section.map((task) => ({ ...task, completed: completedSectionIds.has(task.id) })),
      };
    });
  }

  async function downloadEachPoster(modules: Module[]): Promise<Module[]> {
    const updatedModules = await Promise.all(
      modules.map(async (module) => {
        const localUri = FileSystem.documentDirectory + module.poster_url;

        // Check if the file already exists
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
          // console.log("File already exists at ", localUri);
          return { ...module, local_poster_uri: localUri };
        }

        // File does not exist, proceed to download
        const downloadResumable = FileSystem.createDownloadResumable(
          "https://pueoumkuxzosxrzqoefw.supabase.co/storage/v1/object/public/module-icons/" + module.poster_url,
          localUri,
          {}
        );

        const { uri }: any = await downloadResumable.downloadAsync();
        // console.log("Finished downloading to ", uri);
        return { ...module, local_poster_uri: uri };
      })
    );

    return updatedModules;
  }

  return <ModuleContext.Provider value={{ data }}>{children}</ModuleContext.Provider>;
}
