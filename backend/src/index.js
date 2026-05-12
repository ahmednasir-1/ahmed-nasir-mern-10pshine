import dotenv from "dotenv";
import connectDB from "./configs/database.js";
import app from "./app.js";
import logger from "./configs/logger.js";


dotenv.config(
    {
        path: '../.env'
    }
);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT || 8000, () => {
            logger.info(`Server is running on port ${process.env.PORT}`);

        })
    } catch (error) {
        logger.error("Server Connection failed", error);

    }
}

startServer();
