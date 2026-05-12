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

        logger.info(`Email sent to User's Email = ${userEmail}`)
        
    } catch (err) {
        logger.error(`Email sent Failed - ${err.message}`)

    }
}