import { Schema, model } from "mongoose";
import User, {Role} from "../interfaces/user.interface";


const userSchema = new Schema<User> ({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    name: {
        type: String,
    },
    googleID: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: [Role.Pharmacist, Role.User]
    },
    emailVerificationStatus: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending',
    },
    verificationCode: {
        type: String
    },
    confirmationCodeExpiresIn: {
        type: Date,
    },
    phone: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: {
        type: Number
    },
    refreshToken: [String]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
})


export default model('User', userSchema)