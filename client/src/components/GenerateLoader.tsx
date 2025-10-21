import { useContext } from "react";
import { GenerateLoaderContext } from "./Input";
import commandlogo from '../assets/command.png'
import pdflogo from '../assets/pdf.png'
import processinglogo from '../assets/processing.png'
import programminglogo from '../assets/programing.png'
// type GenerateStatus = 'idle' | 'Generating'

// interface GenerateLoaderProps{
//   Status: GenerateStatus
// }

export const GenerateLoader = () => {
  const context = useContext(GenerateLoaderContext)

  if (!context) {
    throw new Error("Context provider not provided")
  }

  const { StatusGen } = context

  return (
    <>
      {StatusGen === 'Generating' ? (<div className="absolute left-1/2 top-5/10 -translate-x-1/2 -translate-y-5/10 items-center bg-[#f5f7fa] h-[9rem] w-[70%] sm:w-[50%] md:w-[50%] lg:w-[30%] rounded-2xl shadow-sm">
        <div className="flex justify-between items-center px-8 mt-8">
          <div className="">
            <img src={commandlogo} className="h-9 w-auto animate-bounce" />
          </div>
          <div className="animate-ping">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="animate-pulse"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
          </div>
          <div>
            <img src={pdflogo} className="h-9 w-auto animate-bounce" />
          </div>
          <div className="animate-ping">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
          </div>
          <div>
            <img src={processinglogo} className="h-9 w-auto animate-bounce" />
          </div>
          <div className="animate-ping">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
          </div>
          <div>
            <img src={programminglogo} className="h-9 w-auto animate-bounce" />
          </div>
        </div>
        <div className="items-center flex justify-center mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" height="30" width="30"><circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#000000" stroke="#000000" stroke-width="15" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
        </div>
        <div className="items-center flex justify-center text-gray-500 animate-pulse mb-8">
          Generating hold tight...
        </div>
      </div>) : null}
    </>
  )
}