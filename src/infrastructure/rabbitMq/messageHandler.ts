import { chatController } from '../../interface/chatController';
import { notificationController } from '../../interface/notificationController';
import RabbitMQClient from './client';

export default class MessageHandler {
    static async handle(operation: string, data: any, correlationId: string, replyTo: string) {
        let response;

        switch (operation) {
            case 'getConvData':
                console.log('Handling operation:', operation);
                response = await chatController.getConversationData(data);
                break;
            case 'get-chatId':
                response = await chatController.fetchChatId(data);
                break;
            case 'fetch-message':
                response = await chatController.getMessages(data);
                break;

            case 'save-message':
                response = await chatController.saveNewMessage(data);
                break;
            case 'save-image':
                response = await chatController.saveMedia(data);
                break;

            // notificaiton impementaion here
            case 'save-notification':
                response = await notificationController.saveNotification(data);
                break;
            case 'getNotification':
                response = await notificationController.getNotification(data);
                break;
            case 'update-Notification':
                response = await notificationController.updateNotification(data)
                break;
            default:
                response = { error: "Operation not supported" };
                break;
        }
        console.log(response, 'in message handler');
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}