import mongoose from "mongoose";

// Interface for a message in the chat
export interface IMessage {
    senderId?: string;
    receiverId?: string;
    content?:string;
    imagesUrl?:string[];
    videoUrl?:string;
    recordUrl?:string;
    chatId?:mongoose.Types.ObjectId; 
}

// Interface for chat
export interface IChat {
    _id?:mongoose.Types.ObjectId;
    participants?:string[];
    lastMessage?:mongoose.Types.ObjectId;    
}

// Interface for image upload
export interface IImage {
    chatId: string;
    senderId: string;
    receiverId: string;
    images?: {
        buffer: Buffer;
        originalname: string;
    }[];
}

// Interface for video upload
export interface IVideo {
    chatId: string;
    senderId:string;
    receiverId: string;
    video?:{
        buffer: Buffer;
        originalname: string;
    }
}

export interface IAUdio {
    chatId: string;
    senderId:string;
    receiverId: string;
    audio?:{
        buffer: Buffer;
        originalname: string;
    }
}
