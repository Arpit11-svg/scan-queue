import { apiRequest } from "./api.js";

class BusinessService {
    async getProfile() {
        try {
            const response = await apiRequest("/business/profile", {
                method: "GET"
            });

            return response;
        } catch (error) {
            console.error("Error fetching business profile:", error);
            throw error;
        }
    };
    
    async getQueueEntries() {
        try {
            const response = await apiRequest("/queue/business/queue", {
                method: "GET"
            });
            return response;
        } catch (error) {
            console.error("Error fetching queue entries:", error);
            throw error;
        }
    };
}

const businessService = new BusinessService();
export default businessService;