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

const app = express()
app.use(express.json())

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/uploadpdf",authmiddleware,upload.single("file"),async (req: Request,res: Response) =>{
  try{
    const userId  = (req as any).user.email
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
  
    const fastapiresponse = await fetch(`http://127.0.0.1:8000/upload-pdf/${userId}`,{
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
  try{
    const email = (req as any).user.email;
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
      await ContentPromptModel.create({
        UserId: userId,
        prompt: prompt,
        date: stringdate
      })
    }
    catch(e){
      res.status(400).json({
        Error: e
      })
    }
    const fastapiresponse = await fetch(`http://127.0.0.1:8000/generate/diagram`,{
      method: "POST",
      body: JSON.stringify({
        user_id: email,
        prompt: prompt
      })
    })

    const resp = await fastapiresponse.json()
    res.status(200).json({
      message: "Diagram generated succesfully",
      Data: resp
    })

  }
  catch(e){

  }
})

export { router }