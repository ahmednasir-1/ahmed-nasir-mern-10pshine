import connectDB from "./configs/database.js";
import dotenv from "dotenv";
import app from "./app.js";


dotenv.config(
    {
        path: '../.env'
    }
);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);

        })
    } catch (error) {
        console.log("Connection failed", error);

    }
}

startServer();
