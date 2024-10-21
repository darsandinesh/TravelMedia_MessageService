import { NotificationService } from '../application/notification'

class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService
    }

    async saveNotification(data: any) {
        try {
            console.log(data);
            const result = await this.notificationService.saveNotification(data);
            return result;
        } catch (error) {

        }
    }

    async getNotification(id: string) {
        try {
            const result = this.notificationService.getNotification(id);
            return result;
        } catch (error) {

        }
    }

    async updateNotification(id: string) {
        try {
            const result = this.notificationService.updateNotification(id);
            return result;
        } catch (error) {
            return { success: false, message: 'Unable to update the notification' }
        }
    }
}


export const notificationController = new NotificationController()