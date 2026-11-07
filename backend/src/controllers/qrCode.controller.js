import { asyncHandler } from "../utils/asyncHandler.js";
import QrCode  from "qrcode";

const generateBusinessQR = asyncHandler(async (req, res) => {
    const businessId = req.business.id;
    const businessName= encodeURIComponent(req.business.name);
    
    const customerPageURL = `${process.env.FRONTEND_URL}/join/${businessId}/${businessName}`;

    const qrCode = await QrCode.toDataURL(customerPageURL);

    return res.status(200).json({
        success: true,
        business: req.business,
        customerPageURL,
        qrCode
    })
});

export { generateBusinessQR };