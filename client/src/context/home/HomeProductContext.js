import { useContext, createContext } from "react";

export const HomeProductContext = createContext(null);

export function useProductsContext() {
  const value = useContext(HomeProductContext);
  if (!value) {
    throw new Error("useProductsContext must be used inside <HomeProductProvider>");
  }
  return value;
}