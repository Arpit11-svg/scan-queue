import jwt from "jsonwebtoken";

const generateToken = (business) => {
    return jwt.sign(
        {
            id: business.id,
            email: business.email,
            role: "business"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

export default generateToken;