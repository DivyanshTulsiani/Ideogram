import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET


//as we know middleware is just a function 
//an entire express app can be considered basically a chain of middlewares only this funciton additionaly has 
//a next() object which basically call the next function in line if the call is succesfull

async function authmiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (token) {
    if (!JWT_SECRET) {
      throw new Error("Jwt secret is not present");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.email) {
      
    }
  }
  else {

  }
}