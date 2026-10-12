import { createContext, useContext } from "react";

export const LookProductContext = createContext(null);

export function useLookProduct() {
  const value = useContext(LookProductContext);
  if (!value) {
    throw new Error("useLookProduct must be used inside <LookProductProvider>");
  }
  return value;
}