import { useState, type ChangeEvent } from 'react';
import { useFlowContext } from '../App';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

const Input = () => {

  const {initialNodes,initialEdges,SetinitialNodes,SetinitialEdges} = useFlowContext()

  const [InputVal,SetInputval] = useState<string>("");
  const [InputFile,SetInputFile] = useState<File | null>(null);
  const [Status,SetStatus] = useState<UploadStatus>("idle")

  //this change handler basically connects to the input box when it changes i change the Inputval state variable
  //for further sending it as a prompt 
  const PromptChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
    SetInputval(e.target.value)
  }

  //this handles my state variable triggering it to change when user actually enters a file there
  const FileChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files){
      SetInputFile(e.target.files[0])
    }
  }

  const UploadFile = async () =>{
      if(InputFile && Status != 'uploading'){
        SetStatus('uploading')
        const formdata = new FormData()
        formdata.append('file', InputFile)
        try{
          const response = await fetch(`http://localhost:3000/api/v1/content/uploadpdf`,{
            method: "POST",
            headers: {
              "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdjk5QGdtYWlsLmNvbSIsImlhdCI6MTc1OTc2MTMzNX0.4SxVLt3XsKH5o-DSPQTtJjCKnKo1DekfG5wcwnzcu7c"
            },
            body: formdata
          })
          if(response.ok){
            const data = await response.json()
            if(data && data.message){
              SetStatus("success")
              console.log(data.message)
            }
          }
          else{
            SetStatus("error")
          }
        }
        catch(e){

        }
        
      }
  }


  const GenerateDiagram = async () => {
    try{
      const response = await fetch(`http://localhost:3000/api/v1/content/generate`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpdjk5QGdtYWlsLmNvbSIsImlhdCI6MTc1OTc2MTMzNX0.4SxVLt3XsKH5o-DSPQTtJjCKnKo1DekfG5wcwnzcu7c"
        },
        body: JSON.stringify({
          prompt: InputVal
        })
    })
    if(response.ok){
        const data = await response.json()
        if(data && data.Data && data.Data.parsed){
            const reqdata = data.Data.parsed
            const reqnode = reqdata.nodes
            const reqedges = reqdata.edges
            SetinitialEdges(reqedges)
            SetinitialNodes(reqnode)
        }
    }
    }
    catch(e){

    }
  }


  return(
    <>
    <div className='absolute z-10 bg-red-300 top-130 left-120 flex'>
      <input onChange={PromptChangeHandler} value={InputVal}/>
      <button className='bg-blue-300' onClick={GenerateDiagram}>Generate</button>
      <input type="file" onChange={FileChangeHandler}/>
      {InputFile && (
        <div>
          <p>File: {InputFile.name}</p>
        </div>
      )}
      {InputFile && Status !== 'uploading' && (
        <div>
          <button onClick={UploadFile}>Upload</button>
        </div>
      )}

    </div>
    </>
  )
}


export default Input