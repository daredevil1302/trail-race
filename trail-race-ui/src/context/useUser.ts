import { useContext } from "react";
import { UserContext, type UserContextType } from "./UserContext";

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
