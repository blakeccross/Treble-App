import { createContext, useContext, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import { supabase } from "@/utils/supabase";
import { Module, SectionItem } from "@/types";
import { UserContext } from "./user-context";
import * as FileSystem from "expo-file-system";

type ModuleContextProps = { modules: { data: Module[] | null; loading: boolean } };

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [modules, setModules] = useState<{ data: Module[] | null; loading: boolean }>({ data: null, loading: false });
  const { currentUser, handleUpdateUserInfo } = useContext(UserContext);

  useEffect(() => {
    if (!modules.data) {
      getModuleData();
    } else {
      setModules({ ...modules, data: modules.data ? updateCompletedModules(updateCompletedSections(modules.data)) : null });
    }
  }, [currentUser?.completed_sections]);

  // useEffect(() => {}, [currentUser?.completed_sections]);

  async function getModuleData() {
    setModules({ ...modules, loading: true });
    try {
      // if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase.from("module").select(`*, section(*, section_item(*))`).order("id", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const addedLocalImage = (await downloadEachPoster(data)) as Module[];
        const sortedQuestions = await Promise.all(
          addedLocalImage.map(async (module) => ({
            ...module,
            section: await Promise.all(
              module.section.map(async (section) => {
                const sectionItems = await downloadEachSectionImage(section.section_item);
                return { ...section, section_item: sortQuestions(sectionItems) };
              })
            ),
          }))
        );

        setModules({ ...modules, data: updateCompletedModules(updateCompletedSections(sortedQuestions)), loading: false });
      }
    } catch (error) {
      // if (error instanceof Error) {
      //   Alert.alert(error.message)
      // }
    } finally {
      // setLoading(false)
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

  async function downloadEachSectionImage(sectionItems: SectionItem[]): Promise<SectionItem[]> {
    console.log("Downloading section images");
    const updatedModules = await Promise.all(
      sectionItems.map(async (sectionItem) => {
        try {
          if (!sectionItem.image) return { ...sectionItem, local_image_uri: "" };
          const localUri = FileSystem.documentDirectory ? FileSystem.documentDirectory + sectionItem.id : "";

          // Check if the file already exists
          const fileInfo = await FileSystem.getInfoAsync(localUri);
          if (fileInfo.exists) {
            console.log("File Exists");
            return { ...sectionItem, local_image_uri: localUri };
          }

          // File does not exist, proceed to download
          const downloadResumable = FileSystem.createDownloadResumable(sectionItem.image, localUri, {});
          const { uri }: any = await downloadResumable.downloadAsync();
          console.log("Finished downloading to ", uri);
          return { ...sectionItem, local_image_uri: uri };
        } catch (error) {
          console.error(`Error downloading image for section item ${sectionItem.id}:`, error);
          return { ...sectionItem, local_image_uri: "" };
        }
      })
    );

    return updatedModules;
  }

  return <ModuleContext.Provider value={{ modules }}>{children}</ModuleContext.Provider>;
}
