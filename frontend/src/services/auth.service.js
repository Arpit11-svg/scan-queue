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
            console.log("ERROR FROM AUTH.SERVICE.JS file: ", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;