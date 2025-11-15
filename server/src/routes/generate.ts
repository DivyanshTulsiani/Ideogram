import express from "express"
import multer from "multer"
import { Blob } from "buffer";
import { Router } from "express"
import { Request,Response } from "express";
import { ContentPromptModel,UserModel } from "../models/db";
import  authmiddleware  from "../middleware/auth"
import fetch from "node-fetch";
import FormData from "form-data"
import fs from "fs"

interface AuthRequestBody {
  email: string;
  password: string;
}

interface FastAPIResponse {
  parsed: {
    nodes: any[]; // Define the actual node structure if known
    edges: any[]; // Define the actual edge structure if known
  },
  retrieved_context: any
  // Add other properties that FastAPI returns
}

const app = express()
app.use(express.json())

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/getchat",authmiddleware,async (req: Request,res: Response) =>{
  try{
    const email = req.user?.email

    
    const user = await UserModel.findOne({email: email})
    if(!user){
      res.status(404).json({
        message: "User not found"
      })
    }
    const userId = user?._id

    try{
      const chats = await ContentPromptModel.find({UserId: userId})

      if(!chats){
        res.status(404).json({
          message: "User not found"
        })
      }

      res.status(200).json({
        chats
      })
    }
    catch(e){
      res.status(500).json({
        e: e,
        message: "Internal server error"
      })
    }

  }
  catch(e){
    res.status(500).json({
      e: e,
      message: "Internal server error"
    })
  }
})


router.post("/getuserdata",authmiddleware,async (req: Request,res: Response) =>{
  try{
    const email = req.user?.email;

    const user = await UserModel.find({email: email})

    if(!user){
     res.status(404).json({
      message: "User not found"
     })
    }

    res.status(200).json({
      email: user[0]?.email,
      name: user[0]?.name

    })
  }
  catch(e){

  }
})

router.post("/uploadpdf",authmiddleware,upload.single("file"),async (req: Request,res: Response) =>{
  try{
    const userId  = req.user?.email
    console.log(userId)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // const filepath = req.file.path
  
    // if(!filepath){
    //   res.status(400).json({
    //     message: "File path is not valid"
    //   })
    // }

    console.log("check 1")

    const formData = new FormData()
    formData.append("file",req.file.buffer,{
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })
  
    // const filebuffer = fs.readFileSync(filepath)
    // const blob = new Blob([filebuffer], { type: "application/pdf" })

    // console.log("check 2")
  
    // const formData = new FormData();
    // //the second arg here is wanting a string or a blob but we are giving a read stream
    // formData.append("file",blob,req.file.originalname)

    console.log("check 3")
  
    const fastapiresponse = await fetch(`https://fastapi-q58g.onrender.com/upload-pdf/${userId}`,{
      method: "POST",
      body: formData,
      headers: formData.getHeaders()
    })

    console.log("check 4")
  
    const data = await fastapiresponse.json()
    // fs.unlinkSync(filepath)

    res.status(200).json({
      message: "PDF uploaded succesfully",
      data: data
    })
  }
  catch(e){

  }
})


router.post("/generate",authmiddleware,async (req: Request,res: Response) =>{
  let newcontent;
  try{
    const email = req.user?.email;
    const user = await UserModel.findOne({
      email: email
    })
    if(!user){
      res.status(404).json({
        message: "User not found"
      })
    }
    const userId = user?._id
    const prompt = req.body.prompt


    try{
      const currentdate = new Date()
      const stringdate = currentdate.toDateString()
        newcontent = await ContentPromptModel.create({
        UserId: userId,
        prompt: prompt,
        date: stringdate
      })
    }
    catch(e){
      return res.status(400).json({
        Error: e
      })
    }
    const fastapiresponse = await fetch(`https://fastapi-q58g.onrender.com/generate/diagram`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: email,
        prompt: prompt
      })
    })
    console.log("reached generation");
    
    const resp = await fastapiresponse.json() as FastAPIResponse

    if(!resp){
      console.log("error")
    }
    if(!newcontent){
      throw new Error("newcontent not found")
    }

    if (!resp.parsed || !resp.parsed.nodes || !resp.parsed.edges) {
      console.error('Invalid response structure:', resp);
      return res.status(500).json({
        Error: "Invalid FastAPI response structure",
        received: resp
      });
    }
    try{
    const updated = await ContentPromptModel.findByIdAndUpdate(newcontent._id,{Nodes: resp.parsed.nodes,Edges: resp.parsed.edges},{new: true})
    }
    catch(e){
      console.log(e)
    }



    res.status(200).json({
      message: "Diagram generated succesfully",
      Data: resp
    })

  }
  catch(e){

  }
})



router.patch('/updatepromptdata',async (req: Request,res: Response) => {
  const {node,edge,id} = req.body;

  try{
    const updated = await ContentPromptModel.findByIdAndUpdate(id,{Nodes: node,Edges: edge},{new: true})
  }
  catch(e){
    res.status(500).json({message: "Error updating node and edges"})
  }
  

  res.json({message: "Nodes and Edges added Succesfully"})
})

router.post('/getnodeedge',authmiddleware,async (req: Request,res: Response) => {
  const id = req.body.id;
  // console.log("id", id)

  try{
    const NodeEdge = await ContentPromptModel.findOne({_id: id})
    console.log(NodeEdge?.Nodes)
    if(!NodeEdge){

    }
    res.json({
      Node: NodeEdge?.Nodes,
      Edge: NodeEdge?.Edges
    })
  }
  catch(e){
    return console.log("Error", e)
  }
})

export { router }