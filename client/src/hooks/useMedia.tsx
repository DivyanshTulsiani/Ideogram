import { useEffect,useState } from "react";


export const useMedia = (query: string) => {
  const [Matches,SetMatches] = useState<boolean>()

  useEffect(()=>{
    const media = window.matchMedia(query)
    const listener = () => SetMatches(media.matches)

    media.addEventListener("change",listener)
    return () => media.removeEventListener("change",listener)
  },[Matches,query])

  return Matches
}