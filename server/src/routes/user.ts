import express from "express";
import mongoose from "mongoose";
import * as z from "zod"
import bcrypt from "bcrypt"
import { UserModel } from "../models/db";
import { Router } from "express"

const router = Router();


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
        res.status(404).json({
          message: "Credentials are not in correct format"
        })
      }
      else {
        try {
          const hashedpassword = await bcrypt.hash(password,5);
          await UserModel.create({
            email: email,
            password: hashedpassword,
            name: name
          })

          res.status(200).json({
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
  else {
    res.status(411).json({
      message: "All details not provided"
    })
  }

})

export { router }