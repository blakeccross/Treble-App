import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { router, usePathname } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { MMKV, useMMKVObject } from "react-native-mmkv";
import Purchases from "react-native-purchases";
import Toast from "react-native-toast-message";

type UserContextProps = {
  currentUser: Profile | undefined;
  handleUpdateUserInfo: (info: Partial<Profile>) => Promise<void>;
  getUser: () => Promise<void>;
  handleSignOut: () => void;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useMMKVObject<Profile>("user");
  const pathname = usePathname();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      if (await Purchases.isConfigured()) {
        Purchases.logIn(data.session.user.id);
      }
      await handleGetUserData(data.session.user.id);
      router.replace("/(home)");
    } else {
      setCurrentUser(undefined);
      if (pathname !== "/welcome" && pathname !== "/") {
        router.replace("/(auth)/welcome");
      }
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        console.log("USER SIGNED OUT");
        // setSession(null)
      } else if (session) {
        console.log("USER SIGNED IN");
        handleGetUserData(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleGetUserData(id: string) {
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();

    if (profile) {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        console.log("customerInfo", customerInfo.activeSubscriptions);
        const purchasedProducts = customerInfo.entitlements.active["month"] ? ["month"] : [];
        setCurrentUser({ ...(currentUser || {}), ...profile, purchased_products: purchasedProducts });
      } catch (e) {
        setCurrentUser({ ...(currentUser || {}), ...profile, purchased_products: [] });
      }
    }
  }

  async function handleUpdateUserInfo(info: Partial<Profile>) {
    console.log("info", info);
    const updatedUser = { ...(currentUser || {}), ...info } as Profile;
    setCurrentUser(updatedUser);

    const { data, error } = await supabase.from("profiles").update(info).eq("id", currentUser?.id).select();
    // if (data) {
    //   setCurrentUser(updatedUser);
    // }
    if (error) console.error(error);
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error trying to sign user out",
      });
    } else {
      setCurrentUser(undefined);
      router.replace("/(auth)");
    }
  }

  // if (!currentUser) throw Error();

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo, getUser, handleSignOut }}>{children}</UserContext.Provider>;
}
