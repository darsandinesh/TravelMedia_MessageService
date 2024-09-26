import mongoose from "mongoose";
import config from '../config/index'

export const connectToDatabase = async()=>{
    try{
        await mongoose.connect(config.dbUri);
        console.log('connected to database');
    }catch(error){
        console.log('db connection error',error);
    }
}