import { createContext, useEffect, useState } from "react";
import { user_data } from "@/utils/sample-user-data";

export const UserContext = createContext({} as typeof user_data);

export default function ModuleProvider({ children }: { children: JSX.Element }) {
  const [userData, setUserData] = useState(user_data);

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}
