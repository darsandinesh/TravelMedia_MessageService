import mongoose, { Mongoose } from "mongoose";
import { Chat } from "../../model/Chat";
import { IChat, IMessage } from "../entities/IChat";
import { IChatRepository } from "./IChatRepository";
import Message from "../../model/Message";

export class ChatRepository implements IChatRepository {

    async find(userId: string): Promise<{ success: boolean; message: string; data?: IChat[]; }> {
        try {

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return { success: false, message: 'Invalid userId format' }
            }

            const UserId = new mongoose.Types.ObjectId(userId);
            // const chats = await Chat.find({ participants: UserId })
            //     .populate({
            //         path: 'lastmessage',
            //         model: Message
            //     })

            const chats = await Chat.aggregate([
                { $match: { participants: userId } },  // Match chats with the given participant
                {
                    $lookup: {
                        from: 'messages',  // Join with the 'messages' collection
                        localField: '_id',  // Join on the chat _id
                        foreignField: 'chatId',  // The field in 'messages' that references the chat
                        as: 'messages',  // Alias for the joined messages array
                    },
                },
                {
                    $addFields: {
                        unreadCount: {
                            $size: {
                                $filter: {
                                    input: '$messages',
                                    as: 'message',
                                    cond: { $eq: ['$$message.read', false] },  // Only unread messages
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'messages',  // Join with 'messages' to get the lastmessage
                        localField: 'lastmessage',
                        foreignField: '_id',
                        as: 'lastmessage',  // Add the lastmessage as an array
                    },
                },
                {
                    $unwind: {
                        path: '$lastmessage',
                        preserveNullAndEmptyArrays: true,  
                    },
                },
            ]);

            if (!chats || chats.length === 0) {
                return { success: false, message: 'No chats found' }
            }

            const formattedChats = chats.map((chat: any) => ({
                _id: chat._id,
                participants: chat?.participants?.filter((p: any) => p !== userId),
                lastMessage: chat.lastmessage,
                unreadCount:chat.unreadCount
            }))
            return { success: true, message: "Chats found", data: formattedChats };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching chats", err);
            return { success: false, message: `Error fetching chats: ${err.message}` };
        }
    }

    async createChatId(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IChat }> {
        try {
            const senderId = new mongoose.Types.ObjectId(userId);
            const reciverId = new mongoose.Types.ObjectId(recievedId);
            let chat = await Chat.findOne({ participants: { $all: [senderId, reciverId] } });

            const unread = await Message.find({ chatId: chat?._id });

            console.log(unread, '-------------unreadcount')

            if (chat) {
                return { success: true, message: "Chat already exists", data: chat }
            } else {
                chat = new Chat({
                    participants: [senderId, reciverId]
                })
                await chat.save();
                return { success: true, message: "Chat id created ", data: chat }
            }

        } catch (error) {
            console.log("Error in create chatid ", error);
            return { success: false, message: 'create chat id eroor' }
        }
    }

    async findMessages(userId: string, receiverId: string): Promise<{ success: boolean, message: string, data?: IMessage[] }> {
        try {

            console.log(userId, receiverId, '--------------data in find mesage')
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return { success: false, message: 'Invalid userId fromat' }
            }

            if (!mongoose.Types.ObjectId.isValid(receiverId)) {
                return { success: false, message: 'Invalid reciverId fromat' }
            }

            const UserIdObj = new mongoose.Types.ObjectId(userId);
            const ReciverIdObj = new mongoose.Types.ObjectId(receiverId);

            await Message.updateMany({ receiverId: UserIdObj }, { $set: { read: true } });

            const messages1 = await Message.find({ senderId: UserIdObj, receiverId: ReciverIdObj });
            console.log('Messages where user is sender:', messages1);

            const messages2 = await Message.find({ senderId: ReciverIdObj, receiverId: UserIdObj });
            console.log('Messages where user is receiver:', messages2);


            const messages = [...messages1, ...messages2]
                .sort((a: any, b: any) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

                });

            console.log('Merged and sorted messages:', messages);


            console.log(messages, 'hello message')

            if (!messages || messages.length === 0) {
                return { success: false, message: 'No messages found' };
            }


            return { success: true, message: 'Message found', data: messages }
        } catch (error) {
            console.log('Error in find messages -->', error);
            return { success: false, message: 'Error in findMessage' }
        }
    }

    async createMessage(chatId: string, content: string, images: string[], video: string, senderId: string, recieverId: string): Promise<{ success: boolean, message: string, data?: IMessage }> {
        try {

            const newMessage = new Message({
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(recieverId),
                content,
                chatId: new mongoose.Types.ObjectId(chatId)
            })

            const savedmessage = await newMessage.save();
            const update = await Chat.updateOne({ _id: chatId }, { $set: { lastmessage: savedmessage._id } }, { upsert: true });
            console.log(update);
            return { success: true, message: "message created successful", data: savedmessage }
        } catch (error) {
            console.log("Error in the createMessage -->", error);
            return { success: false, message: 'Something went worong ' }
        }
    }

    async saveMedia(data: { images: { mimetype: string }[], senderId: string, chatId: string, receiverId: string }, media: string[]) {
        try {

            let newMessage
            if (data.images[0].mimetype == 'video/mp4') {
                newMessage = new Message({
                    senderId: new mongoose.Types.ObjectId(data.senderId),
                    receiverId: new mongoose.Types.ObjectId(data.receiverId),
                    videoUrl: media,
                    chatId: new mongoose.Types.ObjectId(data.chatId)
                })
            } else {
                newMessage = new Message({
                    senderId: new mongoose.Types.ObjectId(data.senderId),
                    receiverId: new mongoose.Types.ObjectId(data.receiverId),
                    imagesUrl: media,
                    chatId: new mongoose.Types.ObjectId(data.chatId)
                })
            }


            console.log(data)
            console.log(newMessage)
            if (newMessage) {
                const savedmessage = await newMessage.save();

                console.log(savedmessage, 'savedMessage')
                const update = await Chat.updateOne({ _id: data.chatId }, { lastMessage: savedmessage._id });
                console.log(update, 'update')
                return { success: true, message: "message created successful", data: savedmessage }
            }
            return { success: false, message: 'Something went wrong' }
        } catch (error) {
            console.log("Error in the createMessage -->", error);
            return { success: false, message: 'Something went worong ' }
        }
    }


}