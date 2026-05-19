import express from "express";
import { createNote, delNote, getNotes, getTrashNotes, moveToTrash, permanentDelNote, restoreNotes, singleNote, togglePin, updateNote } from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/trash", protect, getTrashNotes)
router.get("/", protect, getNotes);
router.post("/create", protect, createNote);
router.patch("/update/:id", protect, updateNote);
// router.delete("/delete/:id", protect, delNote);
router.get("/:id", protect, singleNote);
router.put("/pin/:id", protect, togglePin);
router.delete("/trash/:id", protect, moveToTrash)
router.put("/restore/:id", protect, restoreNotes)
router.delete("/permanent/:id", protect, permanentDelNote)

export default router;