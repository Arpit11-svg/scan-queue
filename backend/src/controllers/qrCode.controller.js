import { asyncHandler } from "../utils/asyncHandler.js";
import QrCode  from "qrcode";

const generateBusinessQR = asyncHandler(async (req, res) => {
    const businessId = req.business.id;
    
    const customerPageURL = `${process.env.FRONTEND_URL}/join/${businessId}`;

    const qrCode = await QrCode.toDataURL(customerPageURL);

    return res.status(200).json({
        success: true,
        businessId,
        customerPageURL,
        qrCode
    })
});

export { generateBusinessQR };