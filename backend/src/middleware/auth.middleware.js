import logger from "../configs/logger.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {

    
    try {
        const token = req.headers.authorization;

        if (!token) {
            logger.warn("Request Failed - No token Found")
            res.status(400).json({ message: "No token" })
        }

        // verify token
        const verify = jwt.verify(token, process.env.JWT_SECRET)

        // find user from token
        req.user = await User.findById(verify.id).select('-password');
        logger.info("Request Success - Token Verified")
        next();

    }
    catch (error) {
        logger.error(`Request Error - Server Error ${error}`)
        res.status(401).json({ message: "No authorization, No token" })
    }
}

export default protect