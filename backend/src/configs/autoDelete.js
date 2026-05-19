import cron from 'node-cron'
import Note from "../models/note.model.js"

// delete notes permanently after 5 minutes 
cron.schedule('*/5 * * * *', async () =>{
    try {
        const fiveMinutesAgo = new Date()
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

        const result = await Note.deleteMany({
            isDeleted: true,
            deletedAt : {$lte: fiveMinutesAgo}
        })

        if(result.deletedCount > 0)
        {
            console.log("auto deleted notes")
        }
    } catch (error) {
        console.log("auto delete error", error.message)
    }
})