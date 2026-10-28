import { apiRequest } from "./api.js";

class AuthService {
    async register(formData) {

        try {
            const response = await apiRequest("/business/register", {
                method: "POST",
                body: JSON.stringify(formData)
            })

            return response;
        } catch (error) {
            throw error;
        }
    }

    async login(formData){
        try {
            const response = await apiRequest("/business/login", {
                method: "POST",
                body: JSON.stringify(formData)
            })
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;