import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { router, usePathname } from "expo-router";
import moment from "moment";
import { createContext, useContext, useEffect } from "react";
import { useMMKVNumber, useMMKVObject, useMMKVString } from "react-native-mmkv";
import Purchases from "react-native-purchases";
import Toast from "react-native-toast-message";
import * as Network from "expo-network";

type UserContextProps = {
  currentUser: Profile | undefined;
  handleUpdateUserInfo: (info: Partial<Profile>) =>
    | Promise<any[]>
    | {
        data: {};
        status: string;
      };
  getUser: () => Promise<void>;
  handleSignOut: () => void;
  lives?: number;
  setLives: (lives: number) => void;
  updatedLives: (value: number) => void;
  livesRefreshTime?: string;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const networkState = Network.useNetworkState();
  const [currentUser, setCurrentUser] = useMMKVObject<Profile>("user");
  const [lives, setLives] = useMMKVNumber("lives");
  const [livesRefreshTime, setLivesRefreshTime] = useMMKVString("livesRefreshTime");
  const pathname = usePathname();

  useEffect(() => {
    // setLives(2);
    getUser();
  }, []);

  useEffect(() => {
    const checkLivesRefresh = () => {
      if (!currentUser?.is_subscribed) {
        console.log("lives", lives);
        if (lives === undefined) {
          setLives(5);
          setLivesRefreshTime("");
        } else if (lives >= 5) {
          setLivesRefreshTime("");
        } else if (lives < 5 && !livesRefreshTime) {
          setLivesRefreshTime(moment().add(1, "hour").format());
        } else if (lives < 5 && livesRefreshTime && moment().isAfter(moment(livesRefreshTime))) {
          setLives(5);
          setLivesRefreshTime("");
        }
      }
    };

    checkLivesRefresh();

    const interval = setInterval(checkLivesRefresh, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lives, livesRefreshTime, currentUser]);

  async function getUser() {
    const { data, error } = await supabase.auth.getSession();

    if (data.session) {
      await handleGetUserData(data.session.user.id);
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.push("/(tabs)/(home)");
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
      const handleAuthChange = async () => {
        if (event === "SIGNED_OUT") {
          console.log("USER SIGNED OUT");
          // setSession(null)
        } else if (event === "SIGNED_IN" && session) {
          console.log("USER SIGNED IN");
          await handleGetUserData(session.user.id);
          await handleCheckUserSubscription(session.user.id);
          router.dismissAll();
          router.push("/(tabs)/(home)");
        } else if (session) {
          console.log(event);
        }
      };
      handleAuthChange();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleGetUserData(id: string) {
    if (await Purchases.isConfigured()) {
      Purchases.logIn(id);
    }
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();

    if (profile) {
      setCurrentUser({ ...(currentUser || {}), ...profile });
    }
  }

  async function handleCheckUserSubscription(id: string) {
    if (await Purchases.isConfigured()) {
      await Purchases.logIn(id);
      const customerInfo = await Purchases.getCustomerInfo();
      const is_subscribed = customerInfo.entitlements.active["pro"].isActive;
      if (currentUser) {
        setCurrentUser({ ...currentUser, is_subscribed: is_subscribed });
      }
    }
  }

  async function handleUpdateUserInfo(info: Partial<Profile>) {
    console.log("updating user", info);
    const updatedUser = { ...(currentUser || {}), ...info } as Profile;
    setCurrentUser(updatedUser);
    if (networkState.isConnected) {
      return await supabase.from("profiles").update(info).eq("id", currentUser?.id).select();
      // if (data) {
      //   setCurrentUser(updatedUser);
      // }
    }
    return { data: {}, status: "" };
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    await Purchases.logOut();
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

  function updatedLives(value: number) {
    if (lives) setLives(lives + value);
  }

  // if (!currentUser) throw Error();

  return (
    <UserContext.Provider value={{ currentUser, handleUpdateUserInfo, getUser, handleSignOut, lives, setLives, updatedLives, livesRefreshTime }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
