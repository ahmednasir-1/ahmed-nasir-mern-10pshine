import cron from 'node-cron'
import { Note } from "../models/note.model.js"
import logger from './logger.js'

// delete notes permanently after 30 days
cron.schedule('* * * * *', async () => {
    try {

        const time = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        await Note.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: time }
        })


    } catch (error) {
        logger.error(`Auto Deletion Error - ${error.message}`)
    }
})