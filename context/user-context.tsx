import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { createContext, useEffect } from "react";
import { useMMKVObject } from "react-native-mmkv";

type User = {
  id: string;
  name: string;
  email: string;
  completedModules?: number[];
  completedSections?: number[];
  profileImageURL?: string;
  premium?: boolean;
};

type UserContextProps = { currentUser: User | undefined; handleUpdateUserInfo: (info: any) => void };

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useMMKVObject<User>("user");

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        console.log("USER IS SIGNED IN", data.session.user.id);
        router.replace("/(home)");
        handleUpdateUserInfo({ email: data.session.user.email, id: data.session.user.id });
        handleGetUserData(data.session.user.id);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        console.log("USER SIGNED OUT");
        // setSession(null)
      } else if (session) {
        console.log("USER SIGNED IN");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleGetUserData(id: string) {
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (profile) {
      handleUpdateUserInfo({ name: profile.full_name, profileImageURL: profile.avatar_url, id: profile.id });
    }
  }

  function handleUpdateUserInfo(info: any) {
    const updatedUser = { ...(currentUser || {}), ...info };
    setCurrentUser(updatedUser);
  }

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo }}>{children}</UserContext.Provider>;
}
