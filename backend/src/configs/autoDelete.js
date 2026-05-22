import cron from 'node-cron'
import { Note } from "../models/note.model.js"

// delete notes permanently after 30 days
cron.schedule('* * * * *', async () => {
    try {

        console.log("cron runnning")

        const time = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        const result = await Note.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: time }
        })


    } catch (error) {
        logger.error(`Auto Deletion Error - ${error.message}`)
        console.log("auto delete error", error.message)
    }
})