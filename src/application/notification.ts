import { NotificationRepository } from "../domain/respositories/NotificationRepository";

class NotificationService {
    private notificationRepo: NotificationRepository;

    constructor() {
        this.notificationRepo = new NotificationRepository();
    }

    async saveNotification(data: any) {
        try {
            const result = await this.notificationRepo.saveNotification(data);
            console.log(result);
            return result
        } catch (error) {

        }
    }

    async getNotification(id: string) {
        try {
            const result: any = await this.notificationRepo.getNotification(id);
            console.log(result);
            if (result?.length > 0) {
                return { success: true, message: 'Notification Data', data: result }
            } else if (result.length == 0) {
                return { success: true, message: 'No notification Data' }
            }

            return { success: false, message: 'Something went wrong' }

        } catch (error) {

        }
    }

    async updateNotification(id: string) {
        try {
            const result = await this.notificationRepo.updateNotification(id)
            if (result && result?.matchedCount > 0) {
                return { success: true, message: 'updated the notificaiton' };
            } 
            return { success: false, message: 'updated the notificaiton' };
        } catch (error) {
            return { success: false, message: 'Something went wrong' }
        }
    }
}

export { NotificationService }