import dotenv from "dotenv";
dotenv.config(
    {
        path: '../.env'
    }
);

import nodemailer from 'nodemailer'
import logger from './logger.js'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }

})



export const sendEmailToUser = async (userEmail, token) => {

    try {

        const link = `http://localhost:5000/api/v1/users/verify/${token}`
        await transporter.sendMail({
            from: process.env.EMAIL ,
            to: userEmail,
            subject: "Email Verification",
            html: `<b>Click this link to activate your account</b>
            <br/>
            <a href="${link}">Activate Account</a>`,
        });

        logger.info(`Verification Email sent to User's Email = ${userEmail}`)
        
    } catch (err) {
        logger.error(`Verification Email sent Failed - ${err.message}`)

    }
}

export const forgotPasswordEmail = async (userEmail, token) => {

    try {

        const link = `http://localhost:5173/reset-password/${token}`
        await transporter.sendMail({
            from: process.env.EMAIL ,
            to: userEmail,
            subject: "Reset Password",
            html: `<b>Click this link to reset your password</b>
            <br/>
            <a href="${link}">Reset Password</a>`,
        });

        logger.info(`Forgot Email sent to User's Email = ${userEmail}`)
        
    } catch (err) {
        logger.error(`Forgot Email sent Failed - ${err.message}`)

    }
}