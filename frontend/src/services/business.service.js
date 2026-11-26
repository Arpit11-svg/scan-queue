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

    async callNextCustomer(){
        try {
            const response = await apiRequest("/queue/business/queue/call-next",{
                method: "PATCH"
            });
            return response;
            
        } catch (error) {
            console.error("Error calling next customer: ",error);
            throw error;
        }
    }

    async getActiveCustomer(){
        try {
            const response = await apiRequest("/queue/business/queue/active", {
                method: "GET"
            });
            return response;

        } catch (error) {
            console.error("Error getting active customer: ",error);
            throw error;
        }
    }

    async cancelActiveCustomer(customerId){
        try {
            const response = await apiRequest(`/queue/business/queue:${customerId}/cancel`, {
                method: "PATCH"
            });
            return response;
        } catch (error) {
            console.error("Error canceling active customer: ",error);
            throw error;
        }
    }
}

const businessService = new BusinessService();
export default businessService;