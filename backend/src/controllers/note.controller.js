import { Note } from "../models/note.model.js";
import logger from "../configs/logger.js";


const createNote = async (req, res) => {
    try {

        console.log(req);

        const { title, content } = req.body;

        if (!title || !content) {
            logger.info(`Note Create Failed - Missing Fields`);
            return res.status(400).json({ message: "Title and content is required" })
        }

        await Note.create(
            {
                title, content,
                user: req.user._id
            }
        );

        logger.info("Note Create Success");
        res.status(201).json({ message: "Note created successfully" });

    } catch (error) {
        logger.error(`Note Create Failed - ${error.mesasge}`);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}

const getNotes = async (req, res) => {

    try {

        // fetch user id from link and find notes for this user
        const notes = await Note.find({ user: req.user._id });
        if (!notes) {
            logger.info(`Note Found Failed - No Note Found for ${req.user._id}`);
            res.status(400).json({ message: "No note found" });
        }

        logger.info(`Note Found Success - All Notes Found for ${req.user._id}`);
        res.status(200).json(notes);

    } catch (error) {
        logger.error(`Note Found Failed - Server Error ${req.user._id}`);
        res.status(500).json({ mesasge: "Server error", error: error.message })
    }
}

const singleNote = async (req, res) => {
    try {

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        if (!note) {
            logger.info(`Note Found Failed - No Note Found ${req.user._id}`)
            return res.status(400).json({ message: "No note found" })
        }

        logger.info("Note Found Success")
        res.status(200).json(note)
    } catch (error) {
        logger.error(`Note Found Failed - Server Error ${error}`)
        res.status(500).json({ message: "server error" })
    }
}
const updateNote = async (req, res) => {

    try {
        const { title, content } = req.body;
        // find note by both user id and note id
        const note = await Note.findOneAndUpdate({
            _id: req.params.id,
            user: req.user._id
        }
            ,
            { title, content },
            {
                new: true
            })

        if (!note) {
            logger.warn("Note Updation Failed - Note not found");
            res.status(400).json({ message: "Note not foudn" })
        }

        logger.info("Note Updation Success")
        res.status(200).json({ message: "Note updated" }, note)
    }
    catch (error) {
        logger.error("Note Updation Error ")
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}


const delNote = async (req, res) => {

    try {

        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if (!note) {
            logger.warn("Note Deletion Failed - Note not found");
            res.status(400).json({ message: "Note not found" })
        }

        logger.info("Note Deletion Success")
        res.status(200).json({ message: "Note deleted" })
    }
    catch (error) {
        logger.error("Note Deletion Failed ")
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

export { createNote, getNotes, updateNote, delNote, singleNote };