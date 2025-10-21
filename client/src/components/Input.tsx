import { useState, type ChangeEvent,useCallback, createContext, useContext } from 'react';
import { useFlowContext } from '../App';
import { memo } from 'react';
import FileUpload from './FileUpload';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

type GenerateStatus = 'idle' | 'Generating'

interface GenerateLoaderContextType{
  StatusGen: GenerateStatus
  SetStatusGen: (Status: GenerateStatus) => void
}

interface GenerateLoaderContextProviderProps{
  children: React.ReactNode
}

export const GenerateLoaderContext = createContext<GenerateLoaderContextType | undefined>(undefined)

export const GenerateLoaderContextProvider = ({children} : GenerateLoaderContextProviderProps) => {
    const [StatusGen,SetStatusGen] = useState<GenerateStatus>("idle");

    return(
      <GenerateLoaderContext.Provider value={{StatusGen,SetStatusGen}}>
        {children}
      </GenerateLoaderContext.Provider>
    )
}

const Input = () => {

  const { initialNodes, initialEdges, SetinitialNodes, SetinitialEdges } = useFlowContext()

  const context = useContext(GenerateLoaderContext)

  if(!context){
    throw new Error("Input must be used within a GenerateLoaderContext")
  }

  const {StatusGen, SetStatusGen} = context;

  const [InputVal, SetInputval] = useState<string>("");
  const [InputFile, SetInputFile] = useState<File | null>(null);
  const [Status, SetStatus] = useState<UploadStatus>("idle")

  //this change handler basically connects to the input box when it changes i change the Inputval state variable
  //for further sending it as a prompt 
  const PromptChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    SetInputval(e.target.value)
  }

  //this handles my state variable triggering it to change when user actually enters a file there
  const FileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      SetInputFile(e.target.files[0])
      SetStatus("idle")
    }
  }


  const UploadFile = useCallback(async () => {
    console.log(InputFile?.name) 
    if (InputFile && Status != 'uploading') {
      SetStatus('uploading')
      const formdata = new FormData()
      formdata.append('file', InputFile)
      try {
        const response = await fetch(`http://localhost:3000/api/v1/content/uploadpdf`, {
          method: "POST",
          headers: {
            "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdjk5QGdtYWlsLmNvbSIsImlhdCI6MTc1OTc2MTMzNX0.4SxVLt3XsKH5o-DSPQTtJjCKnKo1DekfG5wcwnzcu7c"
          },
          body: formdata
        })
        if (response.ok) {
          const data = await response.json()
          if (data && data.message) {
            SetStatus("success")
            console.log(data.message)
          }
        }
        else {
          SetStatus("error")
        }
      }
      catch (e) {

      }

    }
  },[InputFile,Status])


  const GenerateDiagram = async () => {
    SetStatusGen('Generating')
    try {
      const response = await fetch(`http://localhost:3000/api/v1/content/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdjk5QGdtYWlsLmNvbSIsImlhdCI6MTc1OTc2MTMzNX0.4SxVLt3XsKH5o-DSPQTtJjCKnKo1DekfG5wcwnzcu7c"
        },
        body: JSON.stringify({
          prompt: InputVal
        })
      })
      if (response.ok) {
        SetStatusGen('idle')
        const data = await response.json()
        if (data && data.Data && data.Data.parsed) {
          const reqdata = data.Data.parsed
          const reqnode = reqdata.nodes
          const reqedges = reqdata.edges
          SetinitialEdges(reqedges)
          SetinitialNodes(reqnode)
        }
      }
    }
    catch (e) {

    }
  }


  return (
    <>
      {InputFile ? (
        <div className='absolute left-1/2 top-9/10 -translate-x-1/2 -translate-y-9/10 items-center gap-2 rounded-2xl bg-[#f5f7fa] shadow-sm px-3 py-2 w-[95%] sm:w-[75%] md:w-[70%] lg:w-[50%] xl:w-[50%] mx-auto h-[6.5rem]'>
          <div>
            <FileUpload File={InputFile} OnchangeFile={UploadFile} Status={Status}/>
          </div>
          <div className='flex'>
          <div>
            <input type="file" accept='application/pdf' onChange={FileChangeHandler} id='pdf-upload' className='hidden' />
            <label htmlFor='pdf-upload' className='flex mr-2 items-center justify-center gap-1 bg-white rounded-full shadow-sm p-1 hover:bg-blue-300 transition cursor-pointer duration-300 ease-in'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>


            </label>
          </div>

          <input className='flex-grow bg-transparent outline-none text-sm placeholder-gray-500' onChange={PromptChangeHandler} value={InputVal} placeholder='Describe the Flowchart/Diagram...' />
          <button className='bg-blue-300 rounded-full p-1' onClick={GenerateDiagram}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
          {InputFile && Status !== 'uploading' && (
            <div>
              <button onClick={UploadFile}>Upload</button>
            </div>
          )}

        </div>
        </div>) :
        <div className='absolute left-1/2 top-9/10 -translate-x-1/2 -translate-y-9/10 flex items-center gap-2 rounded-2xl bg-[#f5f7fa] shadow-sm px-3 py-2 w-[95%] sm:w-[75%] md:w-[70%] lg:w-[50%] xl:w-[50%] mx-auto h-[3.5rem]'>
          <div>
            <input type="file" accept='application/pdf' onChange={FileChangeHandler} id='pdf-upload' className='hidden' />
            <label htmlFor='pdf-upload' className='flex items-center justify-center gap-1 bg-white rounded-full shadow-sm p-1 hover:bg-blue-300 transition cursor-pointer duration-300 ease-in'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>


            </label>
          </div>

          <input className='flex-grow bg-transparent outline-none text-sm placeholder-gray-500' onChange={PromptChangeHandler} value={InputVal} placeholder='Describe the Flowchart/Diagram...' />
          <button className='bg-blue-300 rounded-full p-1' onClick={GenerateDiagram}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
          {InputFile && Status !== 'uploading' && (
            <div>
              <button onClick={UploadFile}>Upload</button>
            </div>
          )}

        </div>
      }

    </>
  )
}


export default memo(Input)