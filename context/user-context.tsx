import { Profile } from "@/types";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import moment from "moment";
import { createContext, useContext, useEffect } from "react";
import { MMKV, useMMKVNumber, useMMKVObject, useMMKVString } from "react-native-mmkv";
import Purchases from "react-native-purchases";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import * as Network from "expo-network";

const storage = new MMKV();

type UserContextProps = {
  currentUser: Profile | undefined;
  handleUpdateUserInfo: (info: Partial<Profile>) => Promise<any>;
  getUser: () => Promise<void>;
  handleSignOut: () => void;
  lives?: number;
  setLives: (lives: number) => void;
  updatedLives: (value: number) => void;
  livesRefreshTime?: string;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default function ModuleProvider({ children }: { children: React.ReactNode }) {
  const networkState = Network.useNetworkState();
  const [currentUser, setCurrentUser] = useMMKVObject<Profile>("user");
  const [lives, setLives] = useMMKVNumber("lives");
  const [livesRefreshTime, setLivesRefreshTime] = useMMKVString("livesRefreshTime");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const checkLivesRefresh = () => {
      if (!currentUser?.is_subscribed) {
        if (lives === undefined) {
          setLives(5);
          setLivesRefreshTime("");
        } else if (lives >= 5) {
          setLivesRefreshTime("");
        } else if (lives < 5 && !livesRefreshTime) {
          const time = moment().add(1, "hour").format();
          setLivesRefreshTime(time);
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Lives Refreshed! 🎵",
              body: "Your lives have been reset. Time to practice!",
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: moment(time).diff(moment(), "seconds"),
              channelId: "lives_refreshed",
            },
          });
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
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const handleAuthChange = async () => {
        if (event === "SIGNED_OUT") {
        } else if (event === "SIGNED_IN" && session) {
          await handleGetUserData(session.user.id);
        }
      };
      handleAuthChange();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleGetUserData(id: string) {
    const isSubscribed = await handleCheckUserSubscription(id);
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();

    if (profile) {
      setCurrentUser({ ...(currentUser || {}), ...profile, is_subscribed: isSubscribed });
    }
  }

  async function handleCheckUserSubscription(id: string) {
    const isConfigured = await Purchases.isConfigured();
    if (isConfigured) {
      await Purchases.logIn(id);
      const customerInfo = await Purchases.getCustomerInfo();

      return customerInfo.activeSubscriptions.length > 0;
    }
    return false;
  }

  async function handleUpdateUserInfo(info: Partial<Profile>) {
    console.log("updating user", info);
    const updatedUser = { ...(currentUser || {}), ...info } as Profile;
    setCurrentUser(updatedUser);

    // Only update user if they've created an account
    if (currentUser?.id) {
      return supabase.from("profiles").update(info).eq("id", currentUser?.id).select();
    } else {
      return true;
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    try {
      await Purchases.logOut();
    } catch (error) {
      console.error(error);
    }
    if (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error trying to sign user out",
      });
    } else {
      // Get all keys from storage
      const allKeys = storage.getAllKeys();
      // Filter out the keys we want to keep
      const keysToClear = allKeys.filter((key) => key !== "hasSeenWelcomeScreen" && key !== "modules" && key !== "moduleVersion");
      // Clear each key individually
      keysToClear.forEach((key) => storage.delete(key));
    }
    return Promise.resolve();
  }

  function updatedLives(value: number) {
    if (lives) setLives(lives + value);
  }

  return (
    <UserContext.Provider value={{ currentUser, handleUpdateUserInfo, getUser, handleSignOut, lives, setLives, updatedLives, livesRefreshTime }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
