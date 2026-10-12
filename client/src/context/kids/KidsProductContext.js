import { useContext, createContext } from "react";

export const KidsProductContext = createContext(null);

export function useKidsContext(){
  const value = useContext(KidsProductContext);
  if(!value){
    throw new Error("useLookProduct must be used inside <MenProvider>");
  }
  return value;
}