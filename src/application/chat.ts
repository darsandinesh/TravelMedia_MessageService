import { IChat, IImage, IMessage, IVideo } from "../domain/entities/IChat";
import { ChatRepository } from "../domain/respositories/ChatRepository";
import { fetchFileFromS3, uploadFileToS3 } from "../infrastructure/s3/s3Actions";

class ChatService {
    private chatRepo: ChatRepository;

    constructor() {
        this.chatRepo = new ChatRepository();
    }

    async getConversationData(userId: string): Promise<{ success: boolean, message: string, data?: IChat[] }> {
        try {
            const result = await this.chatRepo.find(userId);
            console.log(result, 'res')
            console.log(result, 'res')
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: true, message: 'chats found',data:result.data }
        } catch (error) {
            console.error("Error fetching convo users:", error);
            return { success: false, message: 'Unable to load the chats' }
        }
    }

    async getChatId(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IChat }> {
        try {
            const result = await this.chatRepo.createChatId(userId, recievedId);

            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }

            return { success: result.success, message: result.message, data: result.data }
        } catch (error) {
            console.error("Error creating chatId:", error);
            return { success: false, message: 'Something wen wrong' }
        }
    }

    async fetchMessages(userId: string, recievedId: string): Promise<{ success: boolean, message: string, data?: IMessage[] }> {
        try {
            const result = await this.chatRepo.findMessages(userId, recievedId)
            if (!result || !result.success) {
                return { success: result.success, message: result.message }
            }
            return { success: result.success, message: result.message, data: result.data }
        } catch (error) {
            console.error("Error fetching messages:", error);
            return { success: false, message: 'Something went wrong' }
        }
    }

    async newMessage(chatId: string, content: string, images: string[], video: string, senderId: string, receiverId: string): Promise<{ success: boolean, message: string, data?: IMessage }> {
        try {

            console.log(senderId,'-----------',receiverId   )
            const result = await this.chatRepo.createMessage(chatId, content, images, video, senderId, receiverId);

            if (!result || !result.success) {
                return { success: result.success, message: result.message };
            }

            return { success: result.success, message: result.message, data: result.data };
        } catch (error) {
            console.error("Error creating messages:", error);
            throw new Error(`Error creating messages: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }


}

export { ChatService }