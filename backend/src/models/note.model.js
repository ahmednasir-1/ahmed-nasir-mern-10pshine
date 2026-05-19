import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 1000
        }
        ,
        content: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 1000

        },
        isPinned: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

export const Note = mongoose.model("Note", noteSchema)