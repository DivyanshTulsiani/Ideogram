import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as z from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "../models/db";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT, OAuth2Client } from "google-auth-library";

const router = Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

interface SignupRequestBody {
  email: string;
  password?: string;
  name?: string;
  googleId?: string;
  provider: "local" | "google";

}


router.post("/auth/google",async (req: Request,res: Response) =>{
  try{
    const { token } = req.body;

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if(!googleClientId){
      return res.status(404).json({
        message: "Google client if is not defined"
      })
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId
    })

    const payload = ticket.getPayload();

    if(!payload){
      return res.status(401).json({
        message: "Invalid Google token"
      })
    }

    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub

    let user = await UserModel.findOne({email: email})

    if(!user){
      await UserModel.create({
        email,
        name,
        provider: "google",
        googleId
      })
      if(!JWT_SECRET){
        throw new Error("JWT secret is not defined")
      }
      const token = jwt.sign({email: email},JWT_SECRET)

      res.status(201).json({
        message: "New user created toke assigned",
        token: token
      })

    }
    else{
      if(!JWT_SECRET){
        throw new Error("JWT secret is not defined")
      }
      const token = jwt.sign({email: email},JWT_SECRET)

      res.status(200).json({
        message: "User signed in",
        token: token
      })
    }


  }
  catch(e){

  }
})

router.post("/signup", async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
  if (req.body.email && req.body.password && req.body.name && req.body) {
    const email = req.body.email; // Fixed: was req.body
    const password = req.body.password;
    const name = req.body.name;

    let letuserfound = await UserModel.findOne({ email: email });
    if (!letuserfound) { 
      const requiredBody = z.object({
        email: z.string().min(5).max(100).email({ message: "Not in proper email format" }),
        password: z.string().min(6, { message: "Minimum 6 characters required" }).max(100),
        name: z.string().min(3, { message: "Minimum 3 characters required" }).max(100)
      });

      const parsedDataSuccess = requiredBody.safeParse(req.body);
      if (!parsedDataSuccess.success) {
        res.status(400).json({
          message: "Credentials are not in correct format"
        });
      } else {
        try {
          const hashedpassword = await bcrypt.hash(password, 5);
          await UserModel.create({
            email: email,
            password: hashedpassword,
            name: name,
            provider: "local",

          });
          res.status(201).json({
            message: "User created"
          });
        } catch {
          res.status(500).json({
            message: "Internal server error"
          });
        }
      }
    } else {
      res.status(409).json({
        message: "User already exists"
      });
    }
  } else {
    res.status(400).json({
      message: "All details not provided"
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (req.body.email && req.body.password) {
    try {
      let userfound = await UserModel.findOne({ email: email });
      if (!userfound) {
        return res.status(400).json({
          message: "User does not exist"
        });
      }
      
      if (userfound?.password) {
        const passwordmatch = await bcrypt.compare(password, userfound.password);
        if (!passwordmatch) {
          return res.status(400).json({
            message: "Incorrect password"
          });
        }
        
        if (!JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        
        const token = jwt.sign({ email: email }, JWT_SECRET);
        res.status(200).json({
          message: "User has successfully signed in",
          token: token
        });
      }
    } catch (e) {
      res.status(500).json({
        message: "Internal server error"
      });
    }
  } else {
    res.status(400).json({
      message: "Bad request, credentials not in correct format"
    });
  }
});

export { router };