import { apiRequest } from "./api.js";

class QueueService {
    async joinQueue(businessId, formData) {
        try {
            const response = await apiRequest(`/customer-queue/${businessId}/join-queue`, {
                method: "POST",
                body: JSON.stringify(formData)
            });
            return response;
        } catch (error) {
            console.error("Error joining queue:", error);
            throw error;
        }
    };
}

const queueService = new QueueService();
export default queueService;