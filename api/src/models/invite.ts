import { Schema, Document, model } from "mongoose";

export type InviteDocument = Document & {
    token: string;
    email: string;
    adminType: string;
    plants: [{
        plantId: string;
        departments: [String];
    }]
    validUntilDate: Date;
    isDeleted: boolean;
    isUsed: boolean;
};

const InviteSchema = new Schema<InviteDocument>({
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    adminType: {
        type: String,
        required: true,
    },
    plants: [{
        plantId: {
            type: String,
            required: true,
        },
        departments: [String],
    }],
    validUntilDate: {
        type: Date,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    isUsed: {
        type: Boolean,
        required: true,
    },

});

export const Invite = model<InviteDocument>("Invite", InviteSchema);
