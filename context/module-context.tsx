import { createContext, useEffect, useState } from "react";
import { SAMPLE_DATA } from "@/utils/sample-data";
import { user_data } from "@/utils/sample-user-data";

// Define Task Type with completed property
type Task = {
  id: number;
  title: string;
  premium: boolean;
  completed?: boolean; // Optional property with default value of undefined
};

type ModuleProps = {
  id: number;
  module_name: string;
  icon: string;
  background_color: string;
  progress: number;
  description: string;
  tasks: Task[];
};

type ModuleContextProps = { data: ModuleProps[] };

export const ModuleContext = createContext<ModuleContextProps>({} as ModuleContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [data, setData] = useState<ModuleProps[]>(SAMPLE_DATA);

  useEffect(() => {
    // Get the completed section IDs
    const completedSectionIds = new Set(user_data.completed_sections); // Use Set for faster lookups

    // Update data with completed property for tasks
    const updatedData = data.map((module) => {
      return {
        ...module,
        tasks: module.tasks.map((task) => ({ ...task, completed: completedSectionIds.has(task.id) })),
      };
    });
    setData(updatedData);
  }, []);

  return <ModuleContext.Provider value={{ data }}>{children}</ModuleContext.Provider>;
}
