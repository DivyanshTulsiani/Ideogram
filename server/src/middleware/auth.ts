import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import { UserModel } from "../models/db"
import express from "express"

dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET

interface UserReq extends Request{
  user?: {email: string}
}


//as we know middleware is just a function 
//an entire express app can be considered basically a chain of middlewares only this funciton additionaly has 
//a next() object which basically call the next function in line if the call is succesfull

export default async function authmiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (token) {
    try{
      if (!JWT_SECRET) {
        throw new Error("Jwt secret is not present");
      }
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (decoded.email) {
        let userfound = await UserModel.findOne({email: decoded.email})
        if(userfound){  
          (req as UserReq).user = { email: decoded.email };
          // if (!req.body) req.body = {}; 
          // req.body.email = decoded.email
          console.log("here we go");
          next();
        }
        else{
          res.status(404).json({
            message: "Unable to find the requested user"
          })
        }
      }
    }
    catch(e){
      console.log(e);
      res.status(404).json({
        message: "Some error occured",
        error: e 
      })
    }
  }
  else {
    res.status(500).json({
      message: "Token not found"
    })
  }
}