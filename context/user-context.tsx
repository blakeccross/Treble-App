import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";
import useAsyncStorage from "@/hooks/useAsyncStorage";

type User = {
  name: string;
  email: string;
  completedModules?: number[];
  completedSections?: number[];
  profileImageURL?: string;
};

type UserContextProps = { currentUser: User | null; handleUpdateUserInfo: (info: any) => void };

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [userData, updateStorageItem, clearStorageItem] = useAsyncStorage("profile");

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(userData);
  }, []);

  function handleUpdateUserInfo(info: any) {
    updateStorageItem(JSON.stringify({ ...currentUser, ...info }));
    setCurrentUser({ ...currentUser, ...info });
    console.log(userData);
  }

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo }}>{children}</UserContext.Provider>;
}
