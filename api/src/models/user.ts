import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";
import { Plant } from "./plant";


export type UserDocument = Document & {
    name: string;
    password: string;
    email: string;
    plants: [{
        plantId: string;
        departments: [String];
        isActive: boolean;
    }]
    role: string;
    deactivatedDate: Date;
    passwordResetToken: String | undefined;
    passwordResetExpires: Date | undefined;
};

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    plants: [{
        plantId: {
            type: String,
            required: false,
        },
        departments: [String],
        isActive: {
            type: Boolean,
            required: true,
        },
    }],
    role: {
        type: String,
        required: true,
    },
    deactivatedDate: {
        type: Date,
        required: false,
    },
    passwordResetToken: {
        type: String,
        required: false,
    },
    passwordResetExpires: {
        type: Date,
        required: false,
    },

});

userSchema.pre("save", async function save(next) {
    const user = this as UserDocument;

    if (!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

export const User = model<UserDocument>("User", userSchema);

