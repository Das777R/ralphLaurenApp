import { useContext, createContext } from "react";

export const WomenProductContext = createContext(null);

export function useWomenContext(){
  const value = useContext(WomenProductContext);
  if(!value){
    throw new Error("useLookProduct must be used inside <WomenProvider>");
  }
  return value;
}