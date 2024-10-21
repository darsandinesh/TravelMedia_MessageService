import { ChatService } from "../application/chat";
import { IImage, IVideo } from "../domain/entities/IChat";

class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    async getConversationData(data: { userId: string }) {
        try {
            console.log(data);
            const userId = data?.userId;
            const result = await this.chatService.getConversationData(userId);
            return result;

        } catch (error) {
            console.log('Error in the getConversationData -->', error);
        }
    }

    async fetchChatId(data: { userId: string, recievedId: string }) {
        try {
            const userId = data.userId;
            const recievedId = data.recievedId;
            const result = await this.chatService.getChatId(userId, recievedId);
            return result;
        } catch (error) {
            console.error("Error creating chatId:", error);
            throw error;
        }
    }

    async getMessages(data: { userId: string, recievedId: string }) {
        try {
            const userId = data.userId;
            const recievedId = data.recievedId;
            const result = await this.chatService.fetchMessages(userId, recievedId);
            return result;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    }

    async saveNewMessage(data: { chatId: string, content: string, images: string[], video: string, record: string, recordDuration: number, senderId: string, receiverId: string }) {
        try {

            const chatId = data.chatId;
            const content = data.content;
            const images = data.images;
            const video = data.video;
            const record = data.record;
            const recordDuration = data.recordDuration
            const senderId = data.senderId;
            const recieverId = data.receiverId;

            const result = await this.chatService.newMessage(chatId, content, images, video, senderId, recieverId);
            return result;
        } catch (error) {
            console.error("Error creating messages:", error);
            throw error;
        }
    }

    async saveMedia(data: any) {
        try {

            const result = await this.chatService.saveMedia(data)
            console.log(result, 'media upload');
            return result;
        } catch (error) {
            console.error("Error saving images:", error);
            throw error;
        }
    }


}

export const chatController = new ChatController();