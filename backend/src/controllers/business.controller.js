import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";


const registerBusiness = asyncHandler(async (req, res) => {
    
    const { name, email, password } = req.body;

    if ([name, email, password].some(field => field.trim() === "")) {
        res.status(400).json({
            success: false,
            message: "Please provide all required fields: name, email, and password."
        });
        return;
    }

    const existedBusiness = await pool.query(
        "SELECT id FROM businesses WHERE email = $1",
        [email]
    );
    if (existedBusiness.rows.length > 0) {
        res.status(400).json({
            success: false,
            message: "Business with this email already exists."
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
     await pool.query(
        "INSERT INTO businesses (name, email, password_hash) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
    );
    res.status(201).json({
        success: true,
        message: "Business registered successfully."
    });
});


const loginBusiness = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        !email?.trim() ||
        !password?.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password."
        });
    }

    const result = await pool.query(
        `SELECT id, name, email, password_hash
         FROM businesses
         WHERE email = $1`,
        [email.trim()]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    const business = result.rows[0];

    const isMatch = await bcrypt.compare(
        password,
        business.password_hash
    );

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    // Generate JWT after successful authentication
    const token = generateToken(business);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
    }

    return res
    .status(200)
    .cookie("accessToken", token, options)
    .json({
        success: true,
        message: "Login successful.",
        business: {
            id: business.id,
            name: business.name,
            email: business.email
        }
    });
    
});


export { registerBusiness, loginBusiness };