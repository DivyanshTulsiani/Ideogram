import { useEffect } from "react"
import { memo } from 'react'
import pdflogo from '../assets/pdf.png'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface FileUploadProps {
  File: File;
  OnchangeFile: () => void;
  Status: UploadStatus;
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

  useEffect(() => {
    if (props.File && props.Status != 'uploading' && props.Status != 'success' && props.Status != 'error') {
      props.OnchangeFile();
    }
  }, [props.File, props.OnchangeFile, props.Status])


  // //ye sirf idle pe chalega
  // if(props.File && props.Status != 'uploading' &&  props.Status != 'success' && props.Status != 'error'){
  //   props.OnchangeFile()
  // }

  return (
    <>
      <div className="flex justify-between items-center px-2 py-3 bg-[#e1e9f6] h-[3rem] w-[35%] rounded-lg mb-3 shadow-sm">
        <div className="flex-none w-[60%] items-center truncate">
          {props.File.name}
        </div>
        <div className="flex-none rounded-lg p-1 items-center">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejnooin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg> */}
          <img src={pdflogo} className="w-6 h-auto" />


        </div>
        {props.Status === 'uploading' ? (<div className="items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" height="20" width="20"><radialGradient id="a9" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#000000"></stop><stop offset=".3" stop-color="#000000" stop-opacity=".9"></stop><stop offset=".6" stop-color="#000000" stop-opacity=".6"></stop><stop offset=".8" stop-color="#000000" stop-opacity=".3"></stop><stop offset="1" stop-color="#000000" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a9)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2.5" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#000000" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg></div>) : null}


      </div>
    </>
  )
}

export default memo(FileUpload)