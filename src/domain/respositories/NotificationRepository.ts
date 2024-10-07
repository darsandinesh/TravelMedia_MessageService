import mongoose, { Mongoose } from "mongoose";
import { Notification } from '../../model/Notification';

export class NotificationRepository {

    async saveNotification(data: any) {
        try {
            if (!data.userId || !data.senderId || !data.type) {
                return { success: false, message: 'id is missing' }
            }

            const newNotification = new Notification({
                userId: new mongoose.Types.ObjectId(data.userId),
                senderId: new mongoose.Types.ObjectId(data.senderId),
                type: data.type,
                postId: new mongoose.Types.ObjectId(data.postId),
                message: data.message
            })

            await newNotification.save();
            return { success: true, message: 'message saved' }
        } catch (error) {

        }
    }

    async getNotification(id:string){
        try {
            console.log(id)
            const newId = new mongoose.Types.ObjectId(id);
            const data = await Notification.find({senderId:newId});
        
            console.log(data)
            return data
        } catch (error) {
            
        }
    }
}