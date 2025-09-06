import express from "express"
import { Router } from "express"
import { Request,Response } from "express";
import { ContentPromptModel } from "../models/db";
import  authmiddleware  from "../middleware/auth"


const router = Router();



router.post("/uploadpdf",authmiddleware,async (req: Request,res: Response) =>{

})


router.post("/generate",authmiddleware,async (req: Request,res: Response) =>{
  
})