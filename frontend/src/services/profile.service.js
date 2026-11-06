import { apiRequest } from "./api.js";

class ProfileService {
    async getProfile() {
        try {
            const response = await apiRequest("/business/profile", {
                method: "GET"
            });

            return response;
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    }
}

const profileService = new ProfileService();
export default profileService;