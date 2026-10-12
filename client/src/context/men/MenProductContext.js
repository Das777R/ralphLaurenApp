import { useContext, createContext } from "react";

export const MenProductContext = createContext(null);

export function useMenContext(){
  const value = useContext(MenProductContext);
  if(!value){
    throw new Error("useLookProduct must be used inside <MenProvider>");
  }
  return value;
}