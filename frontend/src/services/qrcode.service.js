import { apiRequest } from "./api.js";

class QRCodeService {
    async generateQRCode() {
        try {
            const response = await apiRequest("/qr-code/generate", {
                method: "GET"
            });

            return response;
        } catch (error) {
            throw error;
        }
    };
};

const qrCodeService = new QRCodeService();
export default qrCodeService;