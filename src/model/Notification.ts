import mongoose, { Schema, Document } from 'mongoose';

// Define the notification types
const NotificationType = {
    LIKE: 'LIKE',
    COMMENT: 'COMMENT',
    REPLY: 'REPLY',
    FOLLOW: 'FOLLOW',
    POST: 'POST',
    CUSTOM: 'CUSTOM',  
};

interface INotification extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    senderId: mongoose.Schema.Types.ObjectId;
    type: string;
    postId?: mongoose.Schema.Types.ObjectId;
    // commentId?: mongoose.Schema.Types.ObjectId;
    // replyId?: mongoose.Schema.Types.ObjectId;
    message?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const NotificationSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export { Notification, NotificationType };
