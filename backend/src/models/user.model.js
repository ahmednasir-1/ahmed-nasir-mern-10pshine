import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 30
        }
        ,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 6,
            maxLength: 50
        },


        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 1024
        },

        isVerified: {
            type: Boolean,
            default: false
        }
        ,
        verificationToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }

)

// hash password before saving

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
      return
   }
    this.password = await bcrypt.hash(this.password, 10);

})

// compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)

}

export const User = mongoose.model("User", userSchema);