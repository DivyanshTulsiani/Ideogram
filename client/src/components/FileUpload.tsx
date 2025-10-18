import { type ChangeEvent, type MouseEvent} from "react"
import { memo } from 'react'

interface FileUploadProps {
  File: File;
  OnchangeFile: (e: MouseEvent<HTMLButtonElement>) => void;
}

//important learning 

//what i wrote below is a serious misunderstanding i will clarify this in the next para
//typescript infers types automatically for functions defined within a component think of giving a type to function that is passed 
//in a button now a button accepts a function that has a type MouseEventHandler<HTMLButtonElement> for onClick() either you can define this within same component so that ts infers this on its own
//or if are passing it down as a prop u can use a useRef just like how we assign useRef to DOM elements we will assign it to a input element call the orignal function as a proxy 
//the new function defined in the button gets its type auto inferred by ts

//in actuality the types are really simple
// ts gives auto inference for functions if u define them within a comp and use them there only
//but once u pass them down as a prop things get ugly u need to specify the type u want to give 
//but this is not that tough at all 
//say for input elements if u want a fn for OnChange just get ChangeEvent<HTMLInputElement> but lets say 
//for giving types to onClick hanlder in a button use MouseEvent<HTMLButtonElement> as simple as that
const FileUpload = (props: FileUploadProps) => {

  return (
    <>
      <div className="flex justify-between items-center px-2 py-3 bg-[#e1e9f6] h-[3rem] w-[35%] rounded-lg mb-3">
        <div className="flex-none w-[60%] items-center truncate">
          {props.File.name}
        </div>
        <div className="flex-none bg-red-300 rounded-lg p-1 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejnooin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>


        </div>
        <div>
          <button onClick={props.OnchangeFile}>
            h
          </button>
        </div>
      </div>
    </>
  )
}

export default memo(FileUpload)