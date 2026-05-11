import { User } from "../models/user.model.js";
import isEmail from "validator/lib/isEmail.js"
import logger from "../configs/logger.js";
import jwt from 'jsonwebtoken' ;
import crypto from 'crypto'
import { sendEmailToUser } from "../configs/email.js";

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}



const registerUser = async (req, res) => {
    try {

        console.log('request body, ', req.body);
        
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password)
        {

            logger.warn("User Registration Failed - Missing Fields");
            return res.status(400).json({
                message: "All fields are required"
            })
        }


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


        // generate token
        const token = crypto.randomBytes(32).toString('hex')

        // create user
        const newUser = await User.create(
            {
                name,
                email: email.toLowerCase(),
                password,
                isVerified: false,
                verificationToken: token
            }
        );

        // send email
        await sendEmailToUser(newUser.email, token)

        logger.info(`User Registration Success - ${email}`);
        res.status(201).json({ mesasge: "Registration Success! Please check your email to activate your account"   });

    } catch (error) {

        logger.warn(`User Registration error - ${error.message}`);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const verifyEmail = async (req, res) =>{

    try {
        
    
    const {token} = req.params;

    const user = await User.findOne({verificationToken: token})

    if(!user)
    {
        return res.status(400).json({message: "User doensot exist"})
    }

    user.verificationToken = null;
    user.isVerified = true;
    await user.save()

    logger.info(`Email Verified - ${user.email}`)

    } catch (error) {
        logger.error(`Email Verification Failed - Server Error ${error}`)
        res.status(500).json({message: "Internal server error - verificaton failed"})
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

        if(!user.isVerified)
        {
            logger.info(`User Login Failed - Email doesnot verified ${email}`)
            return res.status(400).json({message: "Please verify your email first!"})
        }


        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn(`User Login Failed - Invalid Password ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }


        logger.info(`User Login Success -  ${email}`);
        res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
     
        })

    }
    catch (error) {
        logger.warn(`User Login Error - ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export { registerUser, loginUser, verifyEmail };