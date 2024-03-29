

import { Schema, Document, model } from "mongoose";


export type DunnageDocument = Document & {
    departmentId: string;
    name: string;
    skidQuantity: number;
    currentCount?: number;
    lowStock: number;
    moderateStock: number;
    marketLocation: string;
    imageURL: string;
    isDeleted: boolean;
};

const dunnageSchema = new Schema<DunnageDocument>({
    departmentId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    skidQuantity: {
        type: Number,
        required: true,
    },
    currentCount: {
        type: Number,
        required: false,
    },
    lowStock: {
        type: Number,
        required: true,
    },
    moderateStock: {
        type: Number,
        required: true,
    },
    marketLocation: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    imageURL: {
        type: String,
        required: false,
    },
});


export const Dunnage = model<DunnageDocument>("Dunnage", dunnageSchema);
