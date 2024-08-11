import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import useAsyncStorage from "@/hooks/useAsyncStorage";

type User = {
  name: string;
  email: string;
  completedModules?: number[];
  completedSections?: number[];
};

type UserContextProps = { currentUser: User | null; setCurrentUser: Dispatch<SetStateAction<User | null>> };

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [userData, updateStorageItem, clearStorageItem] = useAsyncStorage("profile");

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(userData);
  }, []);

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
}
