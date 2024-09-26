import mongoose, { Schema } from "mongoose";
import { IChat } from "../domain/entities/IChat";

export interface IChatDocument extends IChat, Document { }

const chatSchema: Schema = new Schema({
    participants:[{
        type:String,
        required:true
    }],
    lastmessage:{
        type:mongoose.Types.ObjectId,
        ref:'Message'
    }
}, { timestamps: true })

export const Chat = mongoose.model<IChatDocument>("Chat", chatSchema);