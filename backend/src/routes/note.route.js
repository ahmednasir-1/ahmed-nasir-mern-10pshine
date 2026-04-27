import express from "express";
import { createNote, delNote, getNotes, updateNote } from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/create", protect, createNote);
router.patch("/update/:id", protect, updateNote);
router.delete("/delete/:id", protect, delNote);

export default router;