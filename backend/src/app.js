import express from "express";
import userRouter from "./routes/user.route.js"
import noteRouter from "./routes/note.route.js"
import cors from 'cors';



const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter)

export default app;