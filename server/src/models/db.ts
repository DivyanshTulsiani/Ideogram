import mongoose, {model,Schema} from "mongoose";
import { date } from "zod";


const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
  email:{type: String,unique: true},
  password:{type: String},
  name:{type: String}
})

export const UserModel = model('users',User);

const ContentPrompt = new Schema({
  prompt:{type: String},
  date:{type: String},
  UserId: {type: ObjectId, ref: 'users', required: true}
})

export const ContentPromptModel =  model('contentprompt',ContentPrompt);
