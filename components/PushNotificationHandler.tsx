import { useUser } from "@/context/user-context";
import { registerForPushNotificationsAsync } from "@/utils/registerPushNotifications";
import { useEffect, useRef } from "react";

// Component to handle push notification registration and saving token to database
export default function PushNotificationHandler() {
  const { currentUser, handleUpdateUserInfo } = useUser();
  const isRegisteringRef = useRef(false);
  const registeredUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Skip if already registered for this user or if registration is in progress
    if (isRegisteringRef.current || registeredUserIdRef.current === currentUser?.id) {
      return;
    }

    // Skip if no user ID
    if (!currentUser?.id) {
      return;
    }

    isRegisteringRef.current = true;
    registeredUserIdRef.current = currentUser.id;

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (currentUser?.id) {
          // Only save if user is logged in and token was successfully retrieved
          try {
            await handleUpdateUserInfo({ expo_push_token: token ?? null });
          } catch (error) {
            console.error("Error saving push notification token:", error);
          }
        }
      } catch (error) {
        console.error("Error in PushNotificationHandler useEffect:", error);
      } finally {
        isRegisteringRef.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  return null; // This component doesn't render anything
}
