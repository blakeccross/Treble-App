import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { createContext, useEffect } from "react";
import { useMMKVObject } from "react-native-mmkv";

type User = {
  id: string;
  full_name: string;
  email: string;
  completedModules?: number[];
  completed_sections?: number[];
  avatar_url?: string;
  premium?: boolean;
  active_days?: string[];
};

type UserContextProps = { currentUser: User | undefined; handleUpdateUserInfo: (info: any) => void };

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useMMKVObject<User>("user");

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/(home)");
        //handleUpdateUserInfo({ email: data.session.user.email, id: data.session.user.id });
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
      handleUpdateUserInfo({ full_name: profile.full_name, avatar_url: profile.avatar_url, active_days: profile?.active_days });
      const updatedUser = { ...(currentUser || {}), ...profile };
      setCurrentUser(updatedUser);
    }
  }

  async function handleUpdateUserInfo(info: any) {
    const updatedUser = { ...(currentUser || {}), ...info };

    const { data, error } = await supabase.from("profiles").update(info).eq("id", currentUser?.id).select();
    if (data) {
      setCurrentUser(updatedUser);
    }
    if (error) console.error(error);
  }

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo }}>{children}</UserContext.Provider>;
}
