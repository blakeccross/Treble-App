import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import Purchases from "react-native-purchases";
import Toast from "react-native-toast-message";

type UserContextProps = {
  currentUser: Profile | undefined;
  handleUpdateUserInfo: (info: Partial<Profile>) => Promise<void>;
  handleSignOut: () => void;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useMMKVObject<Profile>("user");

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/(home)");
        //handleUpdateUserInfo({ email: data.session.user.email, id: data.session.user.id });
        handleGetUserData(data.session.user.id);
      } else {
        router.replace("/(auth)/welcome");
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
        handleGetUserData(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    Purchases.getCustomerInfo().then((info) => {
      if (info.allPurchasedProductIdentifiers.length > 0) {
        handleUpdateUserInfo({ premium: true });
      }
    });
  }, []);

  async function handleGetUserData(id: string) {
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();

    if (profile) {
      let allPurchasedProductIdentifiers;
      try {
        allPurchasedProductIdentifiers = (await Purchases.getCustomerInfo()).allPurchasedProductIdentifiers;
      } catch (error) {
        console.error(error);
      }
      const updatedUser = { ...(currentUser || {}), ...profile, purchased_products: allPurchasedProductIdentifiers || [] };

      setCurrentUser(updatedUser);
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

  return <UserContext.Provider value={{ currentUser, handleUpdateUserInfo, handleSignOut }}>{children}</UserContext.Provider>;
}
