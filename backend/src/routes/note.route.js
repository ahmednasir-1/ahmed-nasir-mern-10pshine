import express from "express";
import { createNote, delNote, getNotes, singleNote, updateNote } from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/create", protect, createNote);
router.patch("/update/:id", protect, updateNote);
router.delete("/delete/:id", protect, delNote);
router.get("/:id", protect, singleNote);

export default router;