import express from "express";
import userRouter from "./routes/user.route.js"
import noteRouter from "./routes/note.route.js"

const app = express();

app.use(express.json())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter)

export default app;