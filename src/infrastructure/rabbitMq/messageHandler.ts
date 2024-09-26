import { chatController } from '../../interface/chatController';
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

            default:
                response = { error: "Operation not supported" };
                break;
        }
        console.log(response,'in message handler');
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}