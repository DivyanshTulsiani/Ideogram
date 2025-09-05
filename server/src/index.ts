import express from "express";
import mongoose from "mongoose";
import * as z from "zod"
import bcrypt from "bcrypt"
import { UserModel } from "./models/db";
import { router as userRouter } from "./routes/user"
import cors from "cors"
const app = express();
import dotenv from "dotenv"
dotenv.config()

//imp note .env must always be in the outermost folder alongside index.ts

const MONGOOSE_URI = process.env.MONGOOSE_URI


app.use(express.json())
app.use(cors())
app.use("/api/v1/users",userRouter)

// app.post("/api/v1/signin",(req,res) => {

// })

// app.post("/api/v1/content",(req,res) => {

// })

// app.get("/api/v1/content",(req,res) => {

// })

// app.delete("/api/v1/content",(req,res) => {

// })

// app.post("/api/v1/share",(req,res) => {

// })

//this is neccesary in ts as we cant leave that undefined
if(!MONGOOSE_URI){
  throw new Error("Mongo uri is not defined")
}

app.listen(3000, async function () {
  try {
    await mongoose.connect(MONGOOSE_URI)
    console.log("hello");
  }
  catch (e) {
    console.log(e)
  }
})