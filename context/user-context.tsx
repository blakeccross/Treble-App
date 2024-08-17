import { createContext } from "react";
import { useMMKVObject } from "react-native-mmkv";

type User = {
  name: string;
  email: string;
  completedModules?: number[];
  completedSections?: number[];
  profileImageURL?: string;
};

type UserContextProps = { currentUser: User | undefined; handleUpdateUserInfo: (info: any) => void };

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useMMKVObject<User>("user");

  function handleUpdateUserInfo(info: any) {
    const updatedUser = { ...(currentUser || {}), ...info };
    setCurrentUser(updatedUser);
  }

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo }}>{children}</UserContext.Provider>;
}
