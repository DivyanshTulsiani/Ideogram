import express from "express";
import mongoose from "mongoose";
import * as z from "zod"
import bcrypt from "bcrypt"
import { UserModel } from "../models/db";
import { Router } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const router = Router();
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET


router.post("/signup", async (req, res) => {

  if (req.body.email && req.body.password && req.body.name) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let letuserfound = await UserModel.findOne({ email: email })
    if (!letuserfound) {
      const requiredBody = z.object({
        email: z.string().min(5).max(100).email({ message: "Not in proper email format" }),
        password: z.string().min(6, { message: "Minimum 6 characters required" }).max(100),
        name: z.string().min(3, { message: "Minimum 3 characters required" }).max(100)
      })

      const parsedDataSuccess = requiredBody.safeParse(req.body)
      if (!parsedDataSuccess.success) {
        res.status(400).json({
          message: "Credentials are not in correct format"
        })
      }
      else {
        try {
          const hashedpassword = await bcrypt.hash(password, 5);
          await UserModel.create({
            email: email,
            password: hashedpassword,
            name: name
          })
          //200 is good but pefer 201 for new resource allocated
          res.status(201).json({
            message: "User created"
          })
        }
        catch {
          res.status(500).json({
            message: "Internal server error"
          })
        }
      }
    }
    else {
      res.status(404).json({
        message: "User already exists"
      })
    }
  }
  //added 400 for bad request
  else {
    res.status(400).json({
      message: "All details not provided"
    })
  }

})

//so now we have to sign the user in we will do a db request to check for his credential
//check if the user exist then check for his password but since it is hashed we must check 
//it by hashing
router.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.email && req.body.password) {
    try {
      let userfound = await UserModel.findOne({
        email: email
      })
      if(!userfound){
        res.status(400).json({
          message: "User does not exist"
        })
      }
      //this ? after userfound is additional safety measure in ts it ensures that 
      //userfound is not a null value
      if(userfound?.password){
        const passwordmatch = await bcrypt.compare(password,userfound.password)
        if(!passwordmatch){
          res.status(400).json({
            message: "Incorrect password"
          })
        }
        if (!JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign({
          email: email
        },JWT_SECRET)
        res.status(200).json({
          message: "User has succesfully signed in",
          token: token
        })
      }
    }
    catch(e){
      res.status(500).json({
        message: "Internal server error"
      })
    }


  }
  else {
    res.status(400).json({
      message: "Bad request, credentials not in correct format"
    })
  }
})



export { router }