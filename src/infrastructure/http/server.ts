import express from 'express';
import config from '../config/index';
import { connectToDatabase } from '../database/mongodb';
import RabbitMQClient from '../rabbitMq/client';

const app = express();
app.use(express.json());

const startServer = async () => {
    try {
        await connectToDatabase();
        await RabbitMQClient.initialize();

        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        })
    } catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
}

startServer()