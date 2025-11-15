import mongoose, {model,Schema,Document} from "mongoose";
// import { date } from "zod";


interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  googleId?: string;
  provider: "local" | "google";
}

const ObjectId = Schema.Types.ObjectId;

const User = new Schema<IUser>({
  email:{type: String,unique: true,required: true},
  password:{type: String,
    required: function(){
      return this.provider === "local"
    }
  },
  name:{type: String},
  googleId:{type: String},
  provider:{type:String,enum: ["local","google"],default: "local"}
})

export const UserModel = model('users',User);

const ContentPrompt = new Schema({
  prompt:{type: String},
  date:{type: String},
  UserId: {type: ObjectId, ref: 'users', required: true},
  Nodes: {type: Schema.Types.Mixed, default: []},
  Edges: {type: Schema.Types.Mixed, default: []}
})

export const ContentPromptModel =  model('contentprompt',ContentPrompt);
