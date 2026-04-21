import { User } from "../models/user.model.js";
import isEmail from "validator/lib/isEmail.js"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password)
            return res.status(400).json({
                message: "All fields are required"
            })


        // check if email format is valid
        if(!isEmail(email))
        {
            return res.status(400).json({message : "Email format is invalid"})
        }
        
        // check if user exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
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

        res.status(201).json({ message: "User registered sucessfully" });

    } catch (error) {

        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User doesnot exist" });
        }

        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }


        res.status(200).json({ message: "User logged in" })

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

}


export { registerUser, loginUser };