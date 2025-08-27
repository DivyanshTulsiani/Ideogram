import {model,Schema} from "mongoose";
import { date } from "zod";


const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
  email:{type: String,unique: true},
  password:{type: String},
  name:{type: String}
})

const ContentPrompt = new Schema({
  prompt:{type: String},
  date:{type: String},
  UserId: {type: ObjectId}
})

export const UserModel = model('users',User);
export const ContentPromptModel =  model('contentprompt',ContentPrompt);
