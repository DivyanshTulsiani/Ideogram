import express from "express";
import mongoose from "mongoose";
import * as z from "zod"
import bcrypt from "bcrypt"
import { UserModel } from "./models/db";
import { router as userRouter } from "./routes/user"
import cors from "cors"
const app = express();

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

app.listen(3000, async function () {
  try {
    await mongoose.connect("mongodb+srv://divyanshtulsiani01:Divyansh08040501@cluster0.zok4lb4.mongodb.net/Ideogram")
    console.log("hello");
  }
  catch (e) {
    console.log(e)
  }
})