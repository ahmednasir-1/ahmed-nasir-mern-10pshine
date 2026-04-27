import { User } from "../models/user.model.js";
import isEmail from "validator/lib/isEmail.js"
import logger from "../configs/logger.js";


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password)
            logger.warn("User Registration Failed - Missing Fields");
            return res.status(400).json({
                message: "All fields are required"
            })


        // check if email format is valid
        if(!isEmail(email))
        {
            logger.warn("User Registration Failed - Invalid Email format");
            return res.status(400).json({message : "Email format is invalid"})
        }
        
        // check if user exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            logger.warn(`User Registration Failed - User already exist ${email}`);
            return res.status(400).json({ message: "User already exists" })
        }

        // create user

        const newUser = await User.create(
            {
                name,
                email: email.toLowerCase(),
                password
            }
        );

        logger.warn(`User Registration Success - ${email}`);
        res.status(201).json({ message: "User registered sucessfully" });

    } catch (error) {

        logger.warn(`User Registration error - ${error.message}`);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            logger.warn(`User Login Failed - Email doesnot exist ${email}`);
            return res.status(400).json({ message: "User doesnot exist" });
        }

        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn(`User Login Failed - Invalid Password ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }


        logger.info(`User Login Success -  ${email}`);
        res.status(200).json({ message: "User logged in" })

    }
    catch (error) {
        logger.warn(`User Login Error - ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export { registerUser, loginUser };