import { createContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Module, SectionItem } from "@/types";
import { useUser } from "./user-context";
import * as FileSystem from "expo-file-system";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "react-native-mmkv";

type ModuleContextProps = {
  modules: { data?: Module[] | null; loading: boolean; error?: boolean } | undefined;
  refreshModules: () => void;
  isModuleUpdateAvailable: boolean;
};

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const { currentUser } = useUser();
  const [modules, setModules] = useMMKVObject<{ data?: Module[] | null; loading: boolean; error?: boolean }>("modules");
  const [moduleVersion, setModuleVersion] = useMMKVNumber("module_versions");
  const [latestModuleVersion, setLatestModuleVersion] = useState("");
  const [isModuleUpdateAvailable, setIsModuleUpdateAvailable] = useState(false);

  useEffect(() => {
    getModuleVersions();
  }, []);

  useEffect(() => {
    if (!modules?.data) {
      getModuleData();
    } else {
      setModules({
        ...modules,
        data: modules.data ? updateCompletedModules(updateCompletedSections(modules.data)) : null,
        loading: false,
        error: false,
      });
    }
  }, [currentUser?.completed_sections]);

  async function getModuleVersions() {
    const { data, error, status } = await supabase.from("module_update").select(`*`).order("created_at", { ascending: true }).limit(1);

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
      const { data, error, status } = await supabase.from("module").select(`*, section(*, section_item(*))`).order("id", { ascending: true });
      const { data: moduleUpdate } = await supabase.from("module_update").select(`*`).order("created_at", { ascending: true }).limit(1);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const addedLocalImage = (await downloadEachPoster(data)) as Module[];
        const sortedQuestions = addedLocalImage.map((module) => ({
          ...module,
          section: module.section.map((section) => {
            return { ...section, section_item: sortQuestions(section.section_item) };
          }),
        }));

        setModules({ ...modules, data: updateCompletedModules(updateCompletedSections(sortedQuestions)), loading: false, error: false });
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
      const addedCompletedSections = module.section.map((task) => ({ ...task, completed: completedSectionIds.has(task.id) }));
      return {
        ...module,
        section: addedCompletedSections.sort((a, b) => a.id - b.id),
      };
    });
  }

  async function downloadEachPoster(modules: Module[]): Promise<Module[]> {
    const updatedModules = await Promise.all(
      modules.map(async (module) => {
        try {
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

          return { ...module, local_poster_uri: uri };
        } catch (error) {
          console.error(`Error downloading poster for module ${module.id}:`, error);
          // Return the module with the original poster URL if download fails
          return { ...module, local_poster_uri: "" };
        }
      })
    );

    return updatedModules;
  }

  return <ModuleContext.Provider value={{ modules, refreshModules: getModuleData, isModuleUpdateAvailable }}>{children}</ModuleContext.Provider>;
}
