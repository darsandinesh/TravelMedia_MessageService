import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";
import rabbitmqConfig from "../config/rabbitMq";

export default class Consumer {
    constructor(private channel : Channel){}

    async consumeMessage(){
        await this.channel.assertQueue(rabbitmqConfig.rabbitMQ.queues.messageQueue, {durable: true});
        this.channel.consume(rabbitmqConfig.rabbitMQ.queues.messageQueue, async(message: ConsumeMessage | null)=>{
            if (message) {
                const { correlationId, replyTo } = message.properties;
                const operation = message.properties.headers?.function;

                if (message.content) {
                    const data = JSON.parse(message.content.toString());
                    await MessageHandler.handle(operation, data, correlationId, replyTo);
                }
            }
        }, { noAck: true });
    }
}