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
            return { success: true, message: 'chats found', data: result.data }
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

            console.log(senderId, '-----------', receiverId)
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

    async saveMedia(data: any): Promise<{ success: boolean, message: string, data?: string[] }> {
        try {
            let imageUrls: string[] = [];

            if (data.images && data.images.length > 0) {
                for (const image of data.images) {
                    try {
                        const imageUrl = await uploadFileToS3(image.buffer, image.originalname);
                        imageUrls.push(imageUrl);
                        console.log(`Successfully uploaded image: ${image.originalname}, URL: ${imageUrl}`);
                    } catch (uploadError) {
                        console.error(`Error uploading image to S3:`, uploadError);
                    }
                }
            }

            const res = await this.chatRepo.saveMedia(data, imageUrls);
            if (!res.success) {
                return { success: false, message: "Something went wrong" }
            }

            if (imageUrls.length === 0) {
                return { success: false, message: "No images were successfully uploaded" };
            }
            return { success: true, message: "Images uploaded successfully", data: imageUrls };
        } catch (error) {
            console.error("Error in addImages function:", error);
            return { success: false, message: `Error saving images: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }


}

export { ChatService }